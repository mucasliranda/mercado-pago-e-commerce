export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type SEO = {
  title: string;
  description: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type Product = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
  featuredImage: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  categoryId?: string;
  featuredImage: Image;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

export type Cart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: CartItem[];
  totalQuantity: number;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
  path: string;
};

export type Menu = {
  title: string;
  path: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type AccountOrderItem = {
  id: string;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
  product: {
    id: string;
    handle: string;
    title: string;
    featuredImage: Image;
  };
};

export type AccountOrderPayment = {
  id: string;
  gateway: string;
  gatewayPaymentId: string | null;
  status: string;
  amount: Money;
  createdAt: string;
  updatedAt: string;
};

export type AccountOrder = {
  id: string;
  externalReference: string | null;
  status: string;
  paymentStatus: string;
  totalAmount: Money;
  customerEmail: string | null;
  customerName: string | null;
  checkoutUrl: string | null;
  mercadoPagoPaymentId: string | null;
  createdAt: string;
  updatedAt: string;
  items: AccountOrderItem[];
  latestPayment: AccountOrderPayment | null;
};

export type DatabaseCategoryRow = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
};

export type DatabaseProductRow = {
  id: number;
  category_id: number | null;
  name: string;
  title: string | null;
  slug: string;
  description: string | null;
  description_html: string | null;
  price: string | number;
  active: boolean;
  available_for_sale: boolean;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[];
  currency_code: string;
  created_at: string;
  updated_at: string;
};

export type DatabaseProductImageRow = {
  id: number;
  product_id: number;
  image_url: string;
  alt_text: string | null;
  position: number;
  bucket: string | null;
  storage_path: string | null;
  width: number;
  height: number;
  is_featured: boolean;
  created_at: string;
};

export type DatabaseProductOptionRow = {
  id: number;
  product_id: number;
  name: string;
  values: string[];
  position: number;
  created_at: string;
  updated_at: string;
};

export type DatabaseProductVariantRow = {
  id: number;
  product_id: number;
  title: string;
  sku: string | null;
  available_for_sale: boolean;
  price: string | number;
  currency_code: string;
  selected_options: {
    name: string;
    value: string;
  }[];
  position: number;
  created_at: string;
  updated_at: string;
};

export type DatabasePageRow = {
  id: number;
  title: string;
  handle: string;
  body: string;
  body_summary: string;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type DatabaseMenuRow = {
  id: number;
  title: string;
  handle: string;
  deleted_at?: string | null;
  menu_items?: DatabaseMenuItemRow[];
};

export type DatabaseMenuItemRow = {
  id: number;
  menu_id: number;
  title: string;
  path: string;
  position: number;
  deleted_at?: string | null;
};

export type DatabaseCartRow = {
  id: string;
  checkout_url: string | null;
  subtotal_amount: string | number;
  total_amount: string | number;
  tax_amount: string | number;
  total_quantity: number;
  currency: string;
};

export type DatabaseCartItemRow = {
  id: number;
  cart_id: string;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
};
