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
    authAccess: "Aurora Store Access",
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
      myAccount: "My account",
      backToCatalog: "Back to catalog",
      goHome: "Go home",
      backToLogin: "Back to login",
      retry: "Try again",
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
    title: "Welcome to Aurora Store!",
    description:
      "This storefront combines Next.js, Supabase, and Mercado Pago to deliver a fast journey from catalog to checkout.",
    cta: "Create my version",
  },
  seo: {
    searchFallbackCollectionDescription:
      "{{collectionName}} products",
  },
} as const satisfies Messages;
