# Next.js Commerce com Supabase e Mercado Pago

Storefront em Next.js App Router com:

- catalogo e conteudo no Supabase
- imagens servidas pelo Supabase Storage
- carrinho persistido no Supabase
- checkout hospedado no Mercado Pago

## Stack

- Next.js 15
- React 19
- Supabase Database + Storage
- Mercado Pago SDK para checkout

## Estrutura de dados

O projeto reutiliza e estende o schema que ja existia no Supabase:

- `categories`: categorias exibidas como collections
- `products`: produtos do catalogo
- `product_images`: imagens dos produtos
- `orders`, `order_items`, `payments`: pedidos e pagamento
- `pages`, `menus`, `menu_items`: conteudo institucional e navegacao
- `carts`, `cart_items`: carrinho da storefront

A migracao aplicada nesta etapa tambem foi salva em [supabase/migrations/20260405212200_storefront_cart_content.sql](/c:/Users/Lucas/Documents/GitHub/mercado-pago-e-commerce/supabase/migrations/20260405212200_storefront_cart_content.sql).

## Variaveis de ambiente

Use as variaveis definidas em [.env.example](/c:/Users/Lucas/Documents/GitHub/mercado-pago-e-commerce/.env.example).

Minimo para a storefront:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Minimo para mutacoes server-side:

- `SUPABASE_SERVICE_ROLE_KEY`

Minimo para checkout:

- `MERCADO_PAGO_ACCESS_TOKEN`

O endpoint de notificacao do Mercado Pago pode ficar com o padrao:

- `https://seu-dominio.com/api/mercado-pago/webhook`

Variaveis opcionais para testar o checkout fora do localhost:

- `MERCADO_PAGO_PUBLIC_BASE_URL`

## Supabase: prod e staging

O repositório foi preparado para trabalhar com:

- `production`: projeto principal `psgffxtbccsnpuqkrbww`
- `staging`: branch persistente do Supabase referenciada por `SUPABASE_PROJECT_ID_STAGING`

O arquivo [supabase/config.toml](/c:/Users/Lucas/Documents/GitHub/mercado-pago-e-commerce/supabase/config.toml) já inclui:

- `remotes.production`
- `remotes.staging`

Fluxo recomendado:

1. Faça login no CLI:

```bash
supabase login
```

2. Crie a branch persistente de staging:

```bash
pnpm supabase:branch:create:staging
```

3. Liste as branches e copie o valor de `BRANCH PROJECT ID` da branch `staging`:

```bash
pnpm supabase:branches:list
```

4. Exporte `SUPABASE_PROJECT_ID_STAGING` no shell atual.

5. Publique a configuração de prod e staging:

```bash
pnpm supabase:config:push:prod
pnpm supabase:config:push:staging
```

6. Quando quiser aplicar migrations:

```bash
pnpm supabase:db:push:prod
pnpm supabase:db:push:staging
```

Observacoes:

- A criação/listagem de branches exige `SUPABASE_ACCESS_TOKEN` ou `supabase login`.
- A branch persistente precisa existir antes de `staging` funcionar de verdade.
- O CLI de `staging` usa o `BRANCH PROJECT ID`, nao o nome da branch.

## Como rodar

1. Instale as dependencias:

```bash
pnpm install
```

2. Preencha as variaveis em `.env.local`.

3. Rode a aplicacao:

```bash
pnpm dev
```

## Como alimentar o catalogo

- Cadastre categorias em `public.categories`
- Cadastre produtos em `public.products`
- Envie as imagens para o bucket do Supabase Storage
- Salve as URLs publicas em `public.product_images.image_url`

Hoje a storefront trabalha com uma variante padrao por produto. Isso deixa a migracao simples e funcional usando o schema atual. Se voce quiser, o proximo passo natural e abrir suporte a variantes reais, estoque e atributos como cor/tamanho.

## Checkout

No clique em checkout a aplicacao:

1. cria um pedido em `public.orders`
2. copia os itens para `public.order_items`
3. cria uma preferencia no Mercado Pago
4. redireciona o usuario para o `init_point`

Existe tambem um webhook basico em [app/api/mercado-pago/webhook/route.ts](/c:/Users/Lucas/Documents/GitHub/mercado-pago-e-commerce/app/api/mercado-pago/webhook/route.ts) para armazenar notificacoes recebidas.

## Regras de compra

Para iniciar o checkout, o cliente precisa estar autenticado.

## Validacao

Foi validado com:

```bash
pnpm build
pnpm prettier:check
```

Observacoes do ambiente atual:

- o build passou com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- para carrinho persistido e criacao de pedidos, use `SUPABASE_SERVICE_ROLE_KEY`
