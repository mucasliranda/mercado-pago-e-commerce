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
    authAccess: "Acesso Mago das Vendas",
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
      admin: "Admin",
      myAccount: "Minha conta",
      backToCatalog: "Voltar ao catalogo",
      goHome: "Ir para a home",
      backToLogin: "Voltar para login",
      retry: "Tentar novamente",
      showPassword: "Mostrar senha",
      hidePassword: "Ocultar senha",
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
  admin: {
    metadataTitle: "Admin",
    badge: "Painel admin",
    title: "Controle interno da operacao, com acesso por nivel de permissao.",
    description:
      "Esta primeira etapa abre a base do painel administrativo com foco na criacao de usuarios com role elevada, sem romper a linguagem visual da storefront.",
    roles: {
      admin: "Admin",
      super_admin: "Super admin",
      customer: "Cliente",
    },
    sidebar: {
      title: "Centro de operacoes",
      description:
        "Escolha um modulo na lateral para editar a area certa sem misturar fluxos.",
    },
    navigation: {
      products: "Produtos",
      productsDescription: "Cadastro, edicao e operacao de catalogo.",
      users: "Usuarios",
      usersDescription: "Criacao e gestao de acessos administrativos.",
      orders: "Pedidos",
      ordersDescription: "Acompanhamento operacional e entregas.",
    },
    summary: {
      currentAccess: "Seu acesso",
      currentUser: "Usuario atual",
      phase: "Etapa atual",
      phaseValue: "Criacao de usuarios",
    },
    createUser: {
      title: "Criar usuario administrativo",
      description:
        "Crie novas contas com role de admin ou super admin e deixe o perfil pronto para os proximos modulos do painel.",
      restrictedDescription:
        "Voce tem acesso ao painel admin, mas a criacao de usuarios fica restrita a perfis super admin.",
      restrictedTitle: "Criacao restrita nesta fase",
      restrictedBody:
        "Assim que validarmos esta primeira etapa, admins seguem com o painel liberado para acompanhar pedidos, enquanto o cadastro de novos perfis elevados continua sob responsabilidade de super admins.",
      fields: {
        fullName: "Nome completo",
        role: "Nivel de acesso",
      },
      placeholders: {
        fullName: "Ex.: Marina Costa",
        email: "admin@mago.com",
        password: "Minimo de 8 caracteres",
      },
      helper:
        "Os usuarios criados aqui recebem email ja confirmado e ficam com o role salvo no perfil da base. Use esse fluxo apenas para acessos internos.",
      submit: "Criar usuario",
      pending: "Criando usuario...",
      success: "{{email}} criado com sucesso como {{role}}.",
      errors: {
        superAdminOnly:
          "Somente super admins podem criar novos usuarios administrativos.",
        fullNameRequired: "Informe o nome completo do usuario.",
        invalidEmail: "Informe um email valido.",
        shortPassword: "A senha precisa ter pelo menos 8 caracteres.",
        invalidRole: "Selecione um nivel de acesso valido.",
        emailInUse: "Ja existe um usuario com esse email.",
        createFailed: "Nao foi possivel criar o usuario agora.",
        profileSyncFailed:
          "O usuario foi criado, mas nao foi possivel sincronizar o perfil administrativo.",
      },
    },
    permissions: {
      title: "Escopo por permissao",
      admin:
        "Pode acessar o painel e, nas proximas etapas, acompanhar pedidos e marcar entregas.",
      superAdmin:
        "Pode criar admins e super admins, alem de evoluir para gestao de catalogo e entregas.",
    },
    users: {
      title: "Usuarios administrativos",
      description:
        "Crie e organize acessos internos com uma tela focada em roles elevadas e contexto operacional claro.",
      listTitle: "Todos os usuarios",
      listDescription:
        "Veja a base completa de usuarios da autenticacao com contexto de role, data de criacao e atividade recente.",
      emptyTitle: "Nenhum usuario encontrado.",
      emptyDescription:
        "Assim que houver contas cadastradas na autenticacao, elas aparecem aqui para acompanhamento administrativo.",
      noNameAvailable: "Nome nao informado",
      noRecentAccess: "Sem acesso recente",
      metrics: {
        totalUsers: "Total de usuarios",
        internalAccess: "Acessos internos",
        customers: "Clientes",
        recentActivity: "Acessos nos ultimos 30 dias",
      },
      fields: {
        createdAt: "Criado em",
        lastSignIn: "Ultimo acesso",
      },
      status: {
        confirmed: "Conta confirmada",
        pending: "Aguardando confirmacao",
      },
      accountState: {
        active: "Conta ativa",
        disabled: "Conta desativada",
      },
    },
    userManagement: {
      confirmDelete:
        "Tem certeza que deseja apagar a conta {{email}}? Esta acao nao pode ser desfeita.",
      actions: {
        deactivate: "Desativar",
        reactivate: "Reativar",
        delete: "Apagar",
      },
      success: {
        deactivated: "{{email}} foi desativado com sucesso.",
        reactivated: "{{email}} foi reativado com sucesso.",
        deleted: "{{email}} foi apagado com sucesso.",
      },
      errors: {
        superAdminOnly:
          "Somente super admins podem alterar contas administrativas.",
        loadTargetFailed:
          "Nao foi possivel carregar a conta selecionada.",
        adminOnly:
          "Apenas contas com role admin podem ser alteradas por este fluxo.",
        invalidTarget: "Selecione uma conta admin valida para continuar.",
        deactivateFailed: "Nao foi possivel desativar esta conta agora.",
        reactivateFailed: "Nao foi possivel reativar esta conta agora.",
        deleteFailed: "Nao foi possivel apagar esta conta agora.",
      },
    },
    products: {
      title: "Produtos",
      description:
        "Gerencie o catalogo com visibilidade de status, preco, imagem e disponibilidade sem sair da linguagem da storefront.",
      metrics: {
        totalProducts: "Total de produtos",
        activeProducts: "Produtos ativos",
        availableProducts: "Disponiveis para venda",
        categories: "Categorias",
      },
      listTitle: "Catalogo da loja",
      listDescription:
        "Veja todos os produtos, acompanhe o estado do catalogo e abra rapidamente o formulario para criar ou atualizar informacoes.",
      emptyTitle: "Nenhum produto cadastrado.",
      emptyDescription:
        "Assim que o catalogo receber itens, eles aparecem aqui com status, categoria, tags e acesso rapido para edicao.",
      noCategory: "Sem categoria",
      noTags: "Sem tags ainda",
      state: {
        active: "Ativo",
        inactive: "Inativo",
        available: "Disponivel",
        unavailable: "Indisponivel",
      },
      fields: {
        title: "Titulo do produto",
        slug: "Slug",
        price: "Preco",
        category: "Categoria",
        description: "Descricao",
        imageUrl: "URL da imagem",
        imageAlt: "Texto alternativo da imagem",
        tags: "Tags",
        active: "Produto ativo",
        activeDescription:
          "Mantem o produto visivel nas consultas da storefront e no catalogo publico.",
        availableForSale: "Disponivel para venda",
        availableForSaleDescription:
          "Controla se a compra pode seguir no fluxo do produto e do carrinho.",
        updatedAt: "Ultima atualizacao",
        variants: "Variantes",
      },
      placeholders: {
        title: "Ex.: Estacao Orbital Pro",
        slug: "ex-estacao-orbital-pro",
        category: "Selecione uma categoria",
        description:
          "Descreva o produto com clareza para a vitrine e para o checkout.",
        imageUrl: "https://...",
        imageAlt: "Descricao curta da imagem",
        tags: "lançamento, destaque, premium",
      },
      variantCountSingle: "{{count}} variante",
      variantCountPlural: "{{count}} variantes",
      form: {
        createTitle: "Novo produto",
        editTitle: "Editando {{title}}",
        description:
          "Preencha os campos essenciais do produto para manter a operacao do catalogo centralizada no painel.",
      },
      actions: {
        edit: "Editar",
        create: "Salvar produto",
        update: "Atualizar produto",
        pending: "Salvando produto...",
        createNew: "Criar novo produto",
      },
      restrictedBody:
        "Voce pode acompanhar o catalogo, mas somente super admins podem criar ou alterar produtos.",
      errors: {
        superAdminOnly:
          "Somente super admins podem criar ou editar produtos.",
        titleRequired: "Informe o titulo do produto.",
        slugRequired: "Informe um slug valido para o produto.",
        invalidPrice: "Informe um preco valido para o produto.",
        slugInUse: "Ja existe um produto com esse slug.",
        saveFailed: "Nao foi possivel salvar o produto agora.",
        variantSyncFailed:
          "O produto foi salvo, mas houve um erro ao sincronizar as variantes.",
        imageSyncFailed:
          "O produto foi salvo, mas houve um erro ao sincronizar a imagem principal.",
      },
      success: {
        created: "{{title}} foi criado com sucesso.",
        updated: "{{title}} foi atualizado com sucesso.",
      },
    },
    orders: {
      title: "Pedidos",
      description:
        "Acompanhe o ciclo dos pedidos com contexto de pagamento, itens comprados e uma acao direta para marcar entregas concluidas.",
      metrics: {
        totalOrders: "Total de pedidos",
        awaitingDelivery: "Aguardando entrega",
        delivered: "Entregues",
        grossRevenue: "Receita bruta",
      },
      listTitle: "Operacao de pedidos",
      listDescription:
        "Monitore cada pedido com os dados principais do checkout, acompanhe o pagamento e marque como entregue quando a operacao for concluida.",
      emptyTitle: "Nenhum pedido encontrado.",
      emptyDescription:
        "Quando a loja receber compras autenticadas, os pedidos aparecem aqui com seus itens, status e referencia de pagamento.",
      fields: {
        customer: "Cliente",
        email: "Email",
        createdAt: "Criado em",
        updatedAt: "Atualizado em",
        paymentReference: "Referencia de pagamento",
        items: "Itens",
        variant: "Variante",
        latestPaymentStatus: "Ultimo status do pagamento",
      },
      actions: {
        markDelivered: "Marcar como entregue",
        delivered: "Pedido entregue",
        waitingPayment: "Aguardando pagamento",
      },
      errors: {
        invalidTarget: "Nao foi possivel localizar o pedido informado.",
        notReadyForDelivery:
          "A entrega so pode ser marcada quando o pedido estiver pago.",
        deliveryUpdateFailed:
          "Nao foi possivel atualizar o pedido para entregue agora.",
      },
      success: {
        delivered: "Pedido #{{id}} marcado como entregue.",
        alreadyDelivered: "Esse pedido ja estava marcado como entregue.",
      },
    },
    comingSoon: {
      title: "Modulo preparado para a proxima etapa",
    },
    nextSteps: {
      title: "Proximas entregas",
      orders: "Acompanhamento operacional dos pedidos em tempo real.",
      delivery: "Alteracao manual do status do pedido para entregue.",
      catalog: "Gestao de produtos e usuarios com mais profundidade.",
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
    title: "Bem-vindo a Mago das Vendas!",
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
