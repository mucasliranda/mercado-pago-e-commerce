export const ptBR = {
  locale: "pt-BR",
  site: {
    language: "pt-BR",
    languages: {
      "pt-BR": "Portugues",
      en: "English",
    },
    homeDescription:
      "Loja virtual de alta performance criada com Next.js, Supabase e Mercado Pago.",
    authAccess: "Acesso Aurora Store",
    logoLabel: "logo",
    copyright: "Todos os direitos reservados.",
    viewSource: "Ver codigo-fonte",
    createdBy: "Criado por Vercel",
    deployOnVercel: "Fazer deploy na Vercel",
    deploy: "Deploy",
  },
  common: {
    actions: {
      login: "Entrar",
      signup: "Criar conta",
      logout: "Sair",
      myAccount: "Minha conta",
      backToCatalog: "Voltar ao catalogo",
      goHome: "Ir para a home",
      backToLogin: "Voltar para login",
      retry: "Tentar novamente",
      open: "Abrir",
      close: "Fechar",
    },
    labels: {
      email: "Email",
      password: "Senha",
      confirmPassword: "Confirmar senha",
      checkout: "Checkout",
      language: "Idioma",
    },
  },
  auth: {
    login: {
      metadataTitle: "Entrar",
      eyebrow: "Login",
      title: "Entre para salvar sua jornada de compra.",
      description:
        "Use email e senha para acessar sua conta, revisar seu perfil e deixar o fluxo da loja pronto para os proximos passos.",
      heading: "Bem-vindo de volta",
      subtitle:
        "Acesse com as mesmas credenciais que voce vai usar para acompanhar sua conta.",
      emailPlaceholder: "voce@aurora.store",
      passwordPlaceholder: "Sua senha",
      submit: "Entrar",
      pending: "Entrando...",
      noAccount: "Ainda nao tem conta?",
      createNow: "Criar agora",
    },
    signup: {
      metadataTitle: "Criar conta",
      eyebrow: "Cadastro",
      title: "Crie sua conta sem sair do ritmo da vitrine.",
      description:
        "O cadastro usa email e senha e respeita a mesma linguagem limpa da storefront. Se a confirmacao por email estiver ativa no Supabase, a rota de confirmacao ja esta pronta.",
      heading: "Abrir nova conta",
      subtitle:
        "Guarde seus dados para futuras compras e personalize a experiencia da loja.",
      emailPlaceholder: "voce@aurora.store",
      passwordPlaceholder: "Minimo de 8 caracteres",
      confirmPasswordPlaceholder: "Repita a senha",
      submit: "Criar conta",
      pending: "Criando conta...",
      hasAccount: "Ja possui conta?",
      loginAction: "Entrar",
    },
    error: {
      metadataTitle: "Erro de autenticacao",
      badge: "Auth",
      title: "Nao foi possivel concluir a autenticacao.",
      fallbackMessage:
        "Confira se o link ainda e valido e tente novamente a partir da tela de login.",
      confirmEmailFailure: "Falha ao confirmar o email.",
    },
    validation: {
      invalidEmail: "Informe um email valido.",
      shortPassword: "A senha precisa ter pelo menos 8 caracteres.",
      passwordMismatch: "As senhas precisam ser iguais.",
      invalidLogin: "Nao foi possivel entrar com esses dados.",
      signupFailed: "Nao foi possivel criar a sua conta.",
      accountCreated:
        "Conta criada. Confira seu email para confirmar o acesso.",
      continueCheckout: "Entre para continuar com a compra.",
      accessAccount: "Entre para acessar sua conta.",
    },
  },
  account: {
    metadataTitle: "Minha conta",
    badge: "Minha conta",
    title: "Tudo o que importa da sua conta, em um so lugar.",
    description:
      "Revise seus dados principais, acompanhe pedidos recentes e tenha acesso rapido ao que ainda precisa de alguma acao.",
    emailLabel: "Email",
    createdAtLabel: "Conta criada",
    createdNow: "Agora mesmo",
    nextModules: "Proximos modulos",
    nextModuleItems: {
      orderHistory: "Historico de pedidos autenticados",
      addresses: "Enderecos favoritos e dados de entrega",
      profile: "Preferencias de perfil e comunicacao",
    },
    orders: {
      badge: "Pedidos",
      title: "Acompanhe tudo o que ja passou pelo checkout.",
      description:
        "Aqui voce encontra o status do pedido, pagamento, itens comprados e os principais dados para continuar ou revisar cada compra.",
      emptyTitle: "Nenhum pedido por aqui ainda.",
      emptyDescription:
        "Assim que voce concluir uma compra autenticada, ela aparece nesta area com status, itens e referencia de pagamento.",
      summaryTitle: "Resumo rapido",
      summary: {
        total: "Total de pedidos",
        paid: "Pedidos pagos",
        open: "Pedidos em andamento",
        latest: "Ultimo pedido",
      },
      orderNumber: "Pedido #{{id}}",
      placedOn: "Criado em",
      lastUpdate: "Atualizado em",
      itemsLabel: "Itens",
      itemCountSingle: "{{count}} item",
      itemCountPlural: "{{count}} itens",
      customerName: "Cliente",
      customerEmail: "Email",
      totalLabel: "Total",
      quantityLabel: "Qtd. {{quantity}}",
      unitPriceLabel: "Valor unitario",
      gateway: "Gateway",
      paymentReference: "Referencia de pagamento",
      continuePayment: "Continuar pagamento",
      viewProduct: "Ver produto",
      notAvailable: "Nao disponivel",
      status: {
        order: {
          pending_payment: "Aguardando pagamento",
          paid: "Pago",
          delivered: "Entregue",
          cancelled: "Cancelado",
          refunded: "Reembolsado",
        },
        payment: {
          pending: "Pagamento pendente",
          paid: "Pagamento aprovado",
          authorized: "Pagamento autorizado",
          failed: "Pagamento falhou",
          refunded: "Pagamento reembolsado",
          approved: "Pagamento aprovado",
          rejected: "Pagamento recusado",
        },
      },
    },
  },
  cart: {
    title: "Meu carrinho",
    openCart: "Abrir carrinho",
    closeCart: "Fechar carrinho",
    empty: "Seu carrinho esta vazio.",
    taxes: "Impostos",
    shipping: "Frete",
    shippingAtCheckout: "Calculado no checkout",
    total: "Total",
    proceedToCheckout: "Ir para o checkout",
    outOfStock: "Sem estoque",
    selectOption: "Selecione uma opcao",
    addToCart: "Adicionar ao carrinho",
    removeItem: "Remover item do carrinho",
    increaseQuantity: "Aumentar quantidade do item",
    decreaseQuantity: "Diminuir quantidade do item",
    errors: {
      add: "Nao foi possivel adicionar o item ao carrinho.",
      fetch: "Nao foi possivel carregar o carrinho.",
      remove: "Nao foi possivel remover o item do carrinho.",
      update: "Nao foi possivel atualizar a quantidade do item.",
      itemNotFound: "Item nao encontrado no carrinho.",
    },
    toast: {
      addedTitle: "Item adicionado ao carrinho",
      addedDescription: "{{productTitle}} ja esta no seu carrinho.",
    },
  },
  search: {
    metadataTitle: "Busca",
    metadataDescription: "Busque produtos na loja.",
    inputPlaceholder: "Buscar produtos...",
    sortBy: "Ordenar por",
    collections: "Colecoes",
    noResultsFor: 'Nao encontramos produtos para "{{query}}"',
    showingResultsFor:
      'Mostrando {{count}} {{label}} para "{{query}}"',
    result: "resultado",
    results: "resultados",
    noProductsInCollection: "Nao encontramos produtos nesta colecao.",
    sorting: {
      relevance: "Relevancia",
      trending: "Em alta",
      latest: "Lancamentos",
      priceLowToHigh: "Preco: menor para maior",
      priceHighToLow: "Preco: maior para menor",
    },
    allProductsTitle: "Todos",
    allProductsDescription: "Todos os produtos",
  },
  menu: {
    catalog: "Catalogo",
    about: "Sobre",
  },
  checkout: {
    success: {
      title: "Pagamento aprovado",
      description:
        "Seu pedido foi enviado ao Mercado Pago e o retorno indica aprovacao.",
    },
    pending: {
      title: "Pagamento pendente",
      description:
        "O pedido foi criado e agora estamos aguardando a confirmacao do Mercado Pago.",
    },
    failure: {
      title: "Pagamento nao concluido",
      description:
        "O checkout foi interrompido ou recusado. Voce pode revisar o carrinho e tentar novamente.",
    },
    orderNumber: "Pedido #{{externalReference}}",
  },
  product: {
    relatedProducts: "Produtos relacionados",
    outOfStockSuffix: " (Sem estoque)",
  },
  error: {
    title: "Algo deu errado",
    description:
      "Houve um problema temporario na storefront. Tente novamente em instantes.",
  },
  welcomeToast: {
    title: "Bem-vindo a Aurora Store!",
    description:
      "Esta storefront combina Next.js, Supabase e Mercado Pago para oferecer uma experiencia rapida do catalogo ao checkout.",
    cta: "Criar minha versao",
  },
  seo: {
    searchFallbackCollectionDescription:
      "{{collectionName}} produtos",
  },
} as const;

export type PtBRMessages = typeof ptBR;
