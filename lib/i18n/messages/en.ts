import type { Messages } from "..";

export const en = {
  locale: "en",
  site: {
    language: "en",
    languages: {
      "pt-BR": "Portuguese",
      en: "English",
    },
    homeDescription:
      "High-performance ecommerce storefront built with Next.js, Supabase, and Mercado Pago.",
    authAccess: "Mago das Vendas Access",
    logoLabel: "logo",
    copyright: "All rights reserved.",
    viewSource: "View source",
    createdBy: "Created by Vercel",
    deployOnVercel: "Deploy on Vercel",
    deploy: "Deploy",
  },
  common: {
    actions: {
      login: "Log in",
      signup: "Create account",
      logout: "Log out",
      admin: "Admin",
      myAccount: "My account",
      backToCatalog: "Back to catalog",
      goHome: "Go home",
      backToLogin: "Back to login",
      retry: "Try again",
      showPassword: "Show password",
      hidePassword: "Hide password",
      open: "Open",
      close: "Close",
    },
    labels: {
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      checkout: "Checkout",
      language: "Language",
    },
  },
  auth: {
    login: {
      metadataTitle: "Log in",
      eyebrow: "Login",
      title: "Sign in to keep your shopping journey moving.",
      description:
        "Use your email and password to access your account, review your profile, and keep the store flow ready for the next steps.",
      heading: "Welcome back",
      subtitle:
        "Sign in with the same credentials you will use to manage your account.",
      emailPlaceholder: "you@aurora.store",
      passwordPlaceholder: "Your password",
      submit: "Log in",
      pending: "Signing in...",
      noAccount: "Don't have an account yet?",
      createNow: "Create one now",
    },
    signup: {
      metadataTitle: "Create account",
      eyebrow: "Sign up",
      title: "Create your account without losing the storefront rhythm.",
      description:
        "The signup flow uses email and password and keeps the same clean storefront language. If email confirmation is enabled in Supabase, the confirmation route is already wired up.",
      heading: "Open a new account",
      subtitle:
        "Save your details for future purchases and personalize the store experience.",
      emailPlaceholder: "you@aurora.store",
      passwordPlaceholder: "At least 8 characters",
      confirmPasswordPlaceholder: "Repeat your password",
      submit: "Create account",
      pending: "Creating account...",
      hasAccount: "Already have an account?",
      loginAction: "Log in",
    },
    error: {
      metadataTitle: "Authentication error",
      badge: "Auth",
      title: "We could not complete authentication.",
      fallbackMessage:
        "Check whether the link is still valid and try again from the login screen.",
      confirmEmailFailure: "Could not confirm your email.",
    },
    validation: {
      invalidEmail: "Enter a valid email address.",
      shortPassword: "Password must be at least 8 characters long.",
      passwordMismatch: "Passwords must match.",
      invalidLogin: "We could not sign you in with these credentials.",
      signupFailed: "We could not create your account.",
      accountCreated: "Account created. Check your email to confirm access.",
      continueCheckout: "Log in to continue with checkout.",
      accessAccount: "Log in to access your account.",
    },
  },
  account: {
    metadataTitle: "My account",
    badge: "My account",
    title: "Everything that matters in your account, in one place.",
    description:
      "Review your core details, keep up with recent orders, and quickly access anything that still needs your attention.",
    emailLabel: "Email",
    createdAtLabel: "Account created",
    createdNow: "Just now",
    nextModules: "Next modules",
    nextModuleItems: {
      orderHistory: "Authenticated order history",
      addresses: "Favorite addresses and delivery details",
      profile: "Profile preferences and communication",
    },
    orders: {
      badge: "Orders",
      title: "Keep track of everything that already went through checkout.",
      description:
        "This is where you can review order status, payment status, purchased items, and the main details for every purchase.",
      emptyTitle: "No orders here yet.",
      emptyDescription:
        "As soon as you complete an authenticated purchase, it will appear here with status, items, and payment reference.",
      summaryTitle: "Quick summary",
      summary: {
        total: "Total orders",
        paid: "Paid orders",
        open: "Open orders",
        latest: "Latest order",
      },
      orderNumber: "Order #{{id}}",
      placedOn: "Placed on",
      lastUpdate: "Updated on",
      itemsLabel: "Items",
      itemCountSingle: "{{count}} item",
      itemCountPlural: "{{count}} items",
      customerName: "Customer",
      customerEmail: "Email",
      totalLabel: "Total",
      quantityLabel: "Qty. {{quantity}}",
      unitPriceLabel: "Unit price",
      gateway: "Gateway",
      paymentReference: "Payment reference",
      continuePayment: "Continue payment",
      viewProduct: "View product",
      notAvailable: "Not available",
      status: {
        order: {
          pending_payment: "Awaiting payment",
          paid: "Paid",
          delivered: "Delivered",
          cancelled: "Cancelled",
          refunded: "Refunded",
        },
        payment: {
          pending: "Payment pending",
          paid: "Payment approved",
          authorized: "Payment authorized",
          failed: "Payment failed",
          refunded: "Payment refunded",
          approved: "Payment approved",
          rejected: "Payment rejected",
        },
      },
    },
  },
  admin: {
    metadataTitle: "Admin",
    badge: "Admin panel",
    title: "Internal operations control with access scoped by permission level.",
    description:
      "This first step opens the foundation of the admin panel with a focus on elevated user creation while keeping the same storefront visual language.",
    roles: {
      admin: "Admin",
      super_admin: "Super admin",
      customer: "Customer",
    },
    sidebar: {
      title: "Operations center",
      description:
        "Choose a module from the sidebar to edit the right area without mixing flows.",
    },
    navigation: {
      products: "Products",
      productsDescription: "Catalog creation, editing, and operations.",
      users: "Users",
      usersDescription: "Administrative access creation and management.",
      orders: "Orders",
      ordersDescription: "Operational tracking and deliveries.",
    },
    summary: {
      currentAccess: "Your access",
      currentUser: "Current user",
      phase: "Current phase",
      phaseValue: "User creation",
    },
    createUser: {
      title: "Create an admin user",
      description:
        "Create new accounts with admin or super admin roles and keep their profile ready for the next admin modules.",
      restrictedDescription:
        "You can access the admin area, but user creation is restricted to super admin profiles.",
      restrictedTitle: "Creation is restricted in this phase",
      restrictedBody:
        "Once we validate this first step, admins will keep access to the panel for order operations, while elevated account creation remains under super admin responsibility.",
      fields: {
        fullName: "Full name",
        role: "Access level",
      },
      placeholders: {
        fullName: "Example: Marina Costa",
        email: "admin@mago.com",
        password: "At least 8 characters",
      },
      helper:
        "Users created here receive a confirmed email and have their role stored in the database profile. Use this flow only for internal access.",
      submit: "Create user",
      pending: "Creating user...",
      success: "{{email}} was created successfully as {{role}}.",
      errors: {
        superAdminOnly:
          "Only super admins can create new administrative users.",
        fullNameRequired: "Enter the user's full name.",
        invalidEmail: "Enter a valid email address.",
        shortPassword: "Password must be at least 8 characters long.",
        invalidRole: "Select a valid access level.",
        emailInUse: "A user with this email already exists.",
        createFailed: "We could not create the user right now.",
        profileSyncFailed:
          "The user was created, but the administrative profile could not be synced.",
      },
    },
    permissions: {
      title: "Permission scope",
      admin:
        "Can access the panel and, in upcoming steps, monitor orders and mark deliveries.",
      superAdmin:
        "Can create admins and super admins, plus move on to catalog and delivery management.",
    },
    users: {
      title: "Administrative users",
      description:
        "Create and organize internal access with a screen focused on elevated roles and clear operational context.",
      listTitle: "All users",
      listDescription:
        "Review the full authentication user base with role context, creation date, and recent activity.",
      emptyTitle: "No users found.",
      emptyDescription:
        "As soon as accounts exist in authentication, they will appear here for administrative follow-up.",
      noNameAvailable: "No name provided",
      noRecentAccess: "No recent access",
      metrics: {
        totalUsers: "Total users",
        internalAccess: "Internal access",
        customers: "Customers",
        recentActivity: "Signed in within 30 days",
      },
      fields: {
        createdAt: "Created on",
        lastSignIn: "Last sign in",
      },
      status: {
        confirmed: "Confirmed account",
        pending: "Awaiting confirmation",
      },
      accountState: {
        active: "Active account",
        disabled: "Disabled account",
      },
    },
    userManagement: {
      confirmDelete:
        "Are you sure you want to delete the account {{email}}? This action cannot be undone.",
      actions: {
        deactivate: "Deactivate",
        reactivate: "Reactivate",
        delete: "Delete",
      },
      success: {
        deactivated: "{{email}} was deactivated successfully.",
        reactivated: "{{email}} was reactivated successfully.",
        deleted: "{{email}} was deleted successfully.",
      },
      errors: {
        superAdminOnly:
          "Only super admins can change administrative accounts.",
        loadTargetFailed: "We could not load the selected account.",
        adminOnly:
          "Only accounts with the admin role can be changed through this flow.",
        invalidTarget: "Select a valid admin account to continue.",
        deactivateFailed: "We could not deactivate this account right now.",
        reactivateFailed: "We could not reactivate this account right now.",
        deleteFailed: "We could not delete this account right now.",
      },
    },
    products: {
      title: "Products",
      description:
        "Manage the catalog with visibility into status, price, imagery, and availability while keeping the same storefront language.",
      metrics: {
        totalProducts: "Total products",
        activeProducts: "Active products",
        availableProducts: "Available for sale",
        categories: "Categories",
      },
      listTitle: "Store catalog",
      listDescription:
        "Review every product, monitor catalog health, and jump straight into the form to create or update key information.",
      emptyTitle: "No products registered yet.",
      emptyDescription:
        "As soon as the catalog receives items, they will appear here with status, category, tags, and quick access for editing.",
      noCategory: "No category",
      noTags: "No tags yet",
      state: {
        active: "Active",
        inactive: "Inactive",
        available: "Available",
        unavailable: "Unavailable",
      },
      fields: {
        title: "Product title",
        slug: "Slug",
        price: "Price",
        category: "Category",
        description: "Description",
        imageUrl: "Image URL",
        imageAlt: "Image alt text",
        tags: "Tags",
        active: "Active product",
        activeDescription:
          "Keeps the product visible in storefront queries and the public catalog.",
        availableForSale: "Available for sale",
        availableForSaleDescription:
          "Controls whether the purchase can continue through the product and cart flow.",
        updatedAt: "Last updated",
        variants: "Variants",
      },
      placeholders: {
        title: "Example: Orbital Station Pro",
        slug: "example-orbital-station-pro",
        category: "Select a category",
        description:
          "Describe the product clearly for both the storefront and checkout.",
        imageUrl: "https://...",
        imageAlt: "Short image description",
        tags: "launch, featured, premium",
      },
      variantCountSingle: "{{count}} variant",
      variantCountPlural: "{{count}} variants",
      form: {
        createTitle: "New product",
        editTitle: "Editing {{title}}",
        description:
          "Fill in the essential product fields to keep catalog operations centered in the admin panel.",
      },
      actions: {
        edit: "Edit",
        create: "Save product",
        update: "Update product",
        pending: "Saving product...",
        createNew: "Create new product",
      },
      restrictedBody:
        "You can review the catalog, but only super admins can create or edit products.",
      errors: {
        superAdminOnly: "Only super admins can create or edit products.",
        titleRequired: "Enter the product title.",
        slugRequired: "Enter a valid product slug.",
        invalidPrice: "Enter a valid product price.",
        slugInUse: "A product with this slug already exists.",
        saveFailed: "We could not save the product right now.",
        variantSyncFailed:
          "The product was saved, but there was an error syncing the variants.",
        imageSyncFailed:
          "The product was saved, but there was an error syncing the main image.",
      },
      success: {
        created: "{{title}} was created successfully.",
        updated: "{{title}} was updated successfully.",
      },
    },
    orders: {
      title: "Orders",
      description:
        "Monitor the order lifecycle with payment context, purchased items, and a direct action to mark deliveries as completed.",
      metrics: {
        totalOrders: "Total orders",
        awaitingDelivery: "Awaiting delivery",
        delivered: "Delivered",
        grossRevenue: "Gross revenue",
      },
      listTitle: "Order operations",
      listDescription:
        "Monitor each order with the main checkout details, track the payment, and mark it as delivered when the operation is complete.",
      emptyTitle: "No orders found.",
      emptyDescription:
        "When the store starts receiving authenticated purchases, orders will appear here with items, status, and payment reference.",
      fields: {
        customer: "Customer",
        email: "Email",
        createdAt: "Created on",
        updatedAt: "Updated on",
        paymentReference: "Payment reference",
        items: "Items",
        variant: "Variant",
        latestPaymentStatus: "Latest payment status",
      },
      actions: {
        markDelivered: "Mark as delivered",
        delivered: "Delivered order",
        waitingPayment: "Awaiting payment",
      },
      errors: {
        invalidTarget: "We could not locate the selected order.",
        notReadyForDelivery:
          "Delivery can only be marked when the order has been paid.",
        deliveryUpdateFailed:
          "We could not update the order to delivered right now.",
      },
      success: {
        delivered: "Order #{{id}} was marked as delivered.",
        alreadyDelivered: "This order was already marked as delivered.",
      },
    },
    comingSoon: {
      title: "Module prepared for the next step",
    },
    nextSteps: {
      title: "Next steps",
      orders: "Operational order tracking in real time.",
      delivery: "Manual order status updates to delivered.",
      catalog: "Deeper product and user management.",
    },
  },
  cart: {
    title: "My cart",
    openCart: "Open cart",
    closeCart: "Close cart",
    empty: "Your cart is empty.",
    taxes: "Taxes",
    shipping: "Shipping",
    shippingAtCheckout: "Calculated at checkout",
    total: "Total",
    proceedToCheckout: "Go to checkout",
    outOfStock: "Out of stock",
    selectOption: "Select an option",
    addToCart: "Add to cart",
    removeItem: "Remove item from cart",
    increaseQuantity: "Increase item quantity",
    decreaseQuantity: "Decrease item quantity",
    errors: {
      add: "Could not add the item to the cart.",
      fetch: "Could not load the cart.",
      remove: "Could not remove the item.",
      update: "Could not update the item quantity.",
      itemNotFound: "Item not found in cart.",
    },
    toast: {
      addedTitle: "Item added to cart",
      addedDescription: "{{productTitle}} is already in your cart.",
    },
  },
  search: {
    metadataTitle: "Search",
    metadataDescription: "Search products in the store.",
    inputPlaceholder: "Search products...",
    sortBy: "Sort by",
    collections: "Collections",
    noResultsFor: 'We could not find products for "{{query}}"',
    showingResultsFor:
      'Showing {{count}} {{label}} for "{{query}}"',
    result: "result",
    results: "results",
    noProductsInCollection: "No products found in this collection.",
    sorting: {
      relevance: "Relevance",
      trending: "Trending",
      latest: "Latest arrivals",
      priceLowToHigh: "Price: low to high",
      priceHighToLow: "Price: high to low",
    },
    allProductsTitle: "All",
    allProductsDescription: "All products",
  },
  menu: {
    catalog: "Catalog",
    about: "About",
  },
  checkout: {
    success: {
      title: "Payment approved",
      description:
        "Your order was sent to Mercado Pago and the return indicates approval.",
    },
    pending: {
      title: "Payment pending",
      description:
        "The order was created and we are now waiting for confirmation from Mercado Pago.",
    },
    failure: {
      title: "Payment not completed",
      description:
        "Checkout was interrupted or declined. You can review your cart and try again.",
    },
    orderNumber: "Order #{{externalReference}}",
  },
  product: {
    relatedProducts: "Related products",
    outOfStockSuffix: " (Out of stock)",
  },
  error: {
    title: "Something went wrong",
    description:
      "There was a temporary issue in the storefront. Please try again in a moment.",
  },
  welcomeToast: {
    title: "Welcome to Mago das Vendas!",
    description:
      "This storefront combines Next.js, Supabase, and Mercado Pago to deliver a fast journey from catalog to checkout.",
    cta: "Create my version",
  },
  seo: {
    searchFallbackCollectionDescription:
      "{{collectionName}} products",
  },
} as const satisfies Messages;
