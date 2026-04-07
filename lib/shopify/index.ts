import "server-only";

import { DEFAULT_OPTION, TAGS } from "lib/constants";
import {
  createTranslator,
  defaultLocale,
  type Locale,
} from "lib/i18n";
import {
  createCheckoutPreference,
  getMercadoPagoMerchantOrder,
  getMercadoPagoPayment,
} from "lib/mercado-pago";
import {
  getSupabaseAdmin,
  requireSupabaseServiceRoleKey,
} from "lib/supabase/admin";
import type { Json, TablesInsert } from "lib/supabase/database.types";
import { createClient } from "lib/supabase/server";
import { ensureStartsWith } from "lib/utils";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidateTag,
} from "next/cache";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  AccountOrder,
  AccountOrderPayment,
  Cart,
  CartItem,
  Collection,
  DatabaseCartItemRow,
  DatabaseCartRow,
  DatabaseCategoryRow,
  DatabaseMenuRow,
  DatabasePageRow,
  DatabaseProductImageRow,
  DatabaseProductOptionRow,
  DatabaseProductRow,
  DatabaseProductVariantRow,
  Image,
  Menu,
  Page,
  Product,
  ProductOption,
  ProductVariant,
} from "./types";

const supabaseAdmin = getSupabaseAdmin;

type ProductRecord = DatabaseProductRow & {
  product_images?: DatabaseProductImageRow[] | null;
  product_options?: DatabaseProductOptionRow[] | null;
  product_variants?: DatabaseProductVariantRow[] | null;
};

type PageRecord = DatabasePageRow;

type MenuRecord = DatabaseMenuRow & {
  menu_items?: {
    id: number;
    title: string;
    path: string;
    position: number;
  }[];
};

type CartItemRecord = DatabaseCartItemRow & {
  products?: ProductRecord | null;
  product_variants?: DatabaseProductVariantRow | null;
};

type CartRecord = DatabaseCartRow & {
  cart_items?: CartItemRecord[] | null;
};

type AccountOrderProductRecord = Pick<
  DatabaseProductRow,
  "id" | "name" | "title" | "slug"
> & {
  product_images?: DatabaseProductImageRow[] | null;
};

type AccountOrderItemRecord = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
  products?: AccountOrderProductRecord | AccountOrderProductRecord[] | null;
};

type AccountOrderRecord = {
  id: number;
  external_reference: string | null;
  status: string;
  payment_status: string;
  total_amount: string | number;
  currency: string;
  customer_email: string | null;
  customer_name: string | null;
  checkout_url: string | null;
  mercadopago_payment_id: string | null;
  created_at: string;
  updated_at: string;
  order_items?: AccountOrderItemRecord[] | null;
};

type AccountPaymentRecord = {
  id: number;
  order_id: number;
  gateway: string;
  gateway_payment_id: string | null;
  status: string;
  amount: string | number;
  created_at: string;
  updated_at: string;
};

function toAmountString(value: number | string | null | undefined) {
  return Number(value ?? 0).toFixed(2);
}

function normalizeImage(
  image: DatabaseProductImageRow | null | undefined,
  fallbackTitle: string,
): Image {
  return {
    url: image?.image_url || "/placeholder.png",
    altText: image?.alt_text || fallbackTitle,
    width: image?.width || 1200,
    height: image?.height || 1200,
  };
}

function reshapeProduct(product: ProductRecord): Product {
  const images = [...(product.product_images || [])].sort(
    (left, right) => left.position - right.position,
  );
  const featuredImage = normalizeImage(
    images.find((image) => image.is_featured) || images[0],
    product.title || product.name,
  );
  const variants = [...(product.product_variants || [])]
    .sort((left, right) => left.position - right.position)
    .map(
      (variant): ProductVariant => ({
        id: variant.id.toString(),
        title: variant.title,
        availableForSale: variant.available_for_sale,
        selectedOptions: variant.selected_options || [],
        price: {
          amount: toAmountString(variant.price),
          currencyCode: variant.currency_code.trim() || product.currency_code,
        },
      }),
    );
  const options = [...(product.product_options || [])]
    .sort((left, right) => left.position - right.position)
    .map(
      (option): ProductOption => ({
        id: option.id.toString(),
        name: option.name,
        values: option.values,
      }),
    );
  const variantPrices = variants.length
    ? variants.map((variant) => Number(variant.price.amount))
    : [Number(product.price)];
  const priceCurrencyCode =
    variants[0]?.price.currencyCode || product.currency_code.trim() || "BRL";

  return {
    id: product.id.toString(),
    handle: product.slug,
    availableForSale: product.available_for_sale,
    title: product.title || product.name,
    description: product.description || "",
    descriptionHtml: product.description_html || "",
    options,
    priceRange: {
      minVariantPrice: {
        amount: Math.min(...variantPrices).toFixed(2),
        currencyCode: priceCurrencyCode,
      },
      maxVariantPrice: {
        amount: Math.max(...variantPrices).toFixed(2),
        currencyCode: priceCurrencyCode,
      },
    },
    variants,
    featuredImage,
    images: images.length
      ? images.map((image) =>
          normalizeImage(image, product.title || product.name),
        )
      : [featuredImage],
    seo: {
      title: product.seo_title || product.title || product.name,
      description:
        product.seo_description ||
        product.description ||
        product.title ||
        product.name,
    },
    tags: product.tags || [],
    updatedAt: product.updated_at,
  };
}

function reshapePage(page: PageRecord): Page {
  return {
    id: page.id.toString(),
    title: page.title,
    handle: page.handle,
    body: page.body,
    bodySummary: page.body_summary,
    seo: {
      title: page.seo_title || page.title,
      description: page.seo_description || page.body_summary,
    },
    createdAt: page.created_at,
    updatedAt: page.updated_at,
  };
}

function reshapeCategory(
  category: DatabaseCategoryRow,
  locale: Locale = defaultLocale,
): Collection {
  const { t } = createTranslator(locale);

  return {
    handle: category.slug,
    title: category.name,
    description: t("seo.searchFallbackCollectionDescription", {
      collectionName: category.name,
    }),
    seo: {
      title: category.name,
      description: t("seo.searchFallbackCollectionDescription", {
        collectionName: category.name,
      }),
    },
    updatedAt: category.created_at,
    path: `/search/${category.slug}`,
  };
}

function createFallbackMenu(
  handle: string,
  locale: Locale = defaultLocale,
): Menu[] {
  const { t } = createTranslator(locale);
  const normalizedHandle = normalizeMenuHandle(handle);

  if (normalizedHandle === "footer-menu") {
    return [
      { title: t("menu.catalog"), path: "/search" },
      { title: t("menu.about"), path: "/sobre" },
    ];
  }

  return [
    { title: t("menu.catalog"), path: "/search" },
    { title: t("menu.about"), path: "/sobre" },
  ];
}

function normalizeMenuHandle(handle: string) {
  const aliases: Record<string, string> = {
    "next-js-frontend-header-menu": "main-menu",
    "next-js-frontend-footer-menu": "footer-menu",
  };

  return aliases[handle] || handle;
}

function getStringValue(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function getNumberValue(value: unknown) {
  return typeof value === "number"
    ? value
    : typeof value === "string" && value.length > 0
      ? Number(value)
      : null;
}

function getObjectValue(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

function getMercadoPagoPaymentIdCandidate(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toString();
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return /^\d+$/.test(normalized) ? normalized : null;
}

function extractMercadoPagoPaymentId(payload: Record<string, unknown>) {
  const data = getObjectValue(payload.data);

  return (
    getMercadoPagoPaymentIdCandidate(data?.id) ||
    getMercadoPagoPaymentIdCandidate(payload.payment_id) ||
    getMercadoPagoPaymentIdCandidate(payload.collection_id) ||
    getMercadoPagoPaymentIdCandidate(payload.id)
  );
}

function extractMercadoPagoExternalReference(payload: Record<string, unknown>) {
  return (
    getStringValue(payload.external_reference) ||
    getStringValue(getObjectValue(payload.metadata)?.external_reference)
  );
}

function extractMercadoPagoStatus(payload: Record<string, unknown>) {
  return getStringValue(payload.status) || "pending";
}

function extractMercadoPagoAmount(payload: Record<string, unknown>) {
  return getNumberValue(payload.transaction_amount) || 0;
}

function mapMercadoPagoStatuses(status: string | null | undefined) {
  const normalizedStatus = (status || "pending").toLowerCase();

  return {
    paymentStatus: (() => {
      switch (normalizedStatus) {
        case "approved":
          return "paid";
        case "authorized":
          return "authorized";
        case "refunded":
          return "refunded";
        case "cancelled":
        case "rejected":
          return "failed";
        default:
          return "pending";
      }
    })(),
    orderStatus: (() => {
      switch (normalizedStatus) {
        case "approved":
          return "paid";
        case "refunded":
          return "refunded";
        case "cancelled":
        case "rejected":
          return "cancelled";
        default:
          return "pending_payment";
      }
    })(),
    paymentRowStatus: (() => {
      switch (normalizedStatus) {
        case "approved":
          return "approved";
        case "refunded":
          return "refunded";
        case "cancelled":
          return "cancelled";
        case "rejected":
          return "rejected";
        default:
          return "pending";
      }
    })(),
  };
}

function extractMercadoPagoResourceType(payload: Record<string, unknown>) {
  const type =
    getStringValue(payload.type) ||
    getStringValue(payload.topic) ||
    getStringValue(payload.resource) ||
    getStringValue(payload.action);

  if (!type) {
    return null;
  }

  if (type.includes("merchant_order")) {
    return "merchant_order";
  }

  if (type.includes("payment")) {
    return "payment";
  }

  return type;
}

function reshapeCart(cart: CartRecord): Cart {
  const items = (cart.cart_items || []).map((item) => {
    const product = item.products;
    const variant = item.product_variants;
    const productImage = normalizeImage(
      product?.product_images?.find((image) => image.is_featured) ||
        product?.product_images?.[0],
      product?.title || product?.name || "Product",
    );
    const selectedOptions = variant?.selected_options || [
      {
        name: "Title",
        value: DEFAULT_OPTION,
      },
    ];

    return {
      id: item.id.toString(),
      quantity: item.quantity,
      cost: {
        totalAmount: {
          amount: toAmountString(item.line_total),
          currencyCode: ensureStartsWith(cart.currency, "").trim() || "BRL",
        },
      },
      merchandise: {
        id: (item.variant_id || item.product_id).toString(),
        title: variant?.title || DEFAULT_OPTION,
        selectedOptions,
        product: {
          id: item.product_id.toString(),
          categoryId: product?.category_id?.toString(),
          description: product?.description || "",
          handle: product?.slug || "",
          title: product?.title || product?.name || "Produto",
          featuredImage: productImage,
        },
      },
    } satisfies CartItem;
  });

  const currencyCode = cart.currency.trim() || "BRL";

  return {
    id: cart.id,
    checkoutUrl: cart.checkout_url || "",
    totalQuantity: cart.total_quantity,
    lines: items,
    cost: {
      subtotalAmount: {
        amount: toAmountString(cart.subtotal_amount),
        currencyCode,
      },
      totalAmount: {
        amount: toAmountString(cart.total_amount),
        currencyCode,
      },
      totalTaxAmount: {
        amount: toAmountString(cart.tax_amount),
        currencyCode,
      },
    },
  };
}

function reshapeAccountOrderItem(
  item: AccountOrderItemRecord,
  currency: string,
): AccountOrder["items"][number] {
  const product = Array.isArray(item.products)
    ? item.products[0]
    : item.products;
  const title = product?.title || product?.name || `Produto ${item.product_id}`;
  const featuredImage = normalizeImage(
    product?.product_images?.find((image) => image.is_featured) ||
      product?.product_images?.[0],
    title,
  );

  return {
    id: item.id.toString(),
    quantity: item.quantity,
    unitPrice: {
      amount: toAmountString(item.unit_price),
      currencyCode: currency,
    },
    lineTotal: {
      amount: toAmountString(item.line_total),
      currencyCode: currency,
    },
    product: {
      id: item.product_id.toString(),
      handle: product?.slug || "",
      title,
      featuredImage,
    },
  };
}

function reshapeAccountPayment(
  payment: AccountPaymentRecord,
  currency: string,
): AccountOrderPayment {
  return {
    id: payment.id.toString(),
    gateway: payment.gateway,
    gatewayPaymentId: payment.gateway_payment_id,
    status: payment.status,
    amount: {
      amount: toAmountString(payment.amount),
      currencyCode: currency,
    },
    createdAt: payment.created_at,
    updatedAt: payment.updated_at,
  };
}

export async function getAccountOrders(userId: string): Promise<AccountOrder[]> {
  requireSupabaseServiceRoleKey();
  const { data: orders, error: orderError } = await supabaseAdmin()
    .from("orders")
    .select(
      `
        id,
        external_reference,
        status,
        payment_status,
        total_amount,
        currency,
        customer_email,
        customer_name,
        checkout_url,
        mercadopago_payment_id,
        created_at,
        updated_at,
        order_items (
          id,
          product_id,
          quantity,
          unit_price,
          line_total,
          products (
            id,
            name,
            title,
            slug,
            product_images (
              id,
              product_id,
              image_url,
              alt_text,
              position,
              bucket,
              storage_path,
              width,
              height,
              is_featured,
              created_at
            )
          )
        )
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (orderError) {
    throw orderError;
  }

  const orderRows = (orders || []) as unknown as AccountOrderRecord[];

  if (!orderRows.length) {
    return [];
  }

  const orderIds = orderRows.map((order) => order.id);
  const { data: payments, error: paymentError } = await supabaseAdmin()
    .from("payments")
    .select(
      "id, order_id, gateway, gateway_payment_id, status, amount, created_at, updated_at",
    )
    .in("order_id", orderIds)
    .order("created_at", { ascending: false });

  if (paymentError) {
    throw paymentError;
  }

  const latestPaymentsByOrder = new Map<number, AccountPaymentRecord>();

  for (const payment of (payments || []) as AccountPaymentRecord[]) {
    if (!latestPaymentsByOrder.has(payment.order_id)) {
      latestPaymentsByOrder.set(payment.order_id, payment);
    }
  }

  return orderRows.map((order) => {
    const currency = order.currency.trim() || "BRL";
    const latestPayment = latestPaymentsByOrder.get(order.id);

    return {
      id: order.id.toString(),
      externalReference: order.external_reference,
      status: order.status,
      paymentStatus: order.payment_status,
      totalAmount: {
        amount: toAmountString(order.total_amount),
        currencyCode: currency,
      },
      customerEmail: order.customer_email,
      customerName: order.customer_name,
      checkoutUrl: order.checkout_url,
      mercadoPagoPaymentId: order.mercadopago_payment_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: (order.order_items || []).map((item) =>
        reshapeAccountOrderItem(item, currency),
      ),
      latestPayment: latestPayment
        ? reshapeAccountPayment(latestPayment, currency)
        : null,
    };
  });
}

async function fetchProducts({
  categorySlug,
  limit,
}: {
  categorySlug?: string;
  limit?: number;
}) {
  let query = supabaseAdmin()
    .from("products")
    .select(
      `
        id,
        category_id,
        name,
        title,
        slug,
        description,
        description_html,
        price,
        active,
        available_for_sale,
        seo_title,
        seo_description,
        tags,
        currency_code,
        created_at,
        updated_at,
        product_images (
          id,
          product_id,
          image_url,
          alt_text,
          position,
          bucket,
          storage_path,
          width,
          height,
          is_featured,
          created_at
        ),
        product_options (
          id,
          product_id,
          name,
          values,
          position,
          created_at,
          updated_at
        ),
        product_variants (
          id,
          product_id,
          title,
          sku,
          available_for_sale,
          price,
          currency_code,
          selected_options,
          position,
          created_at,
          updated_at
        )
      `,
    )
    .eq("active", true)
    .order("updated_at", { ascending: false });

  if (categorySlug) {
    const { data: category } = await supabaseAdmin()
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle<{ id: number }>();

    if (!category) {
      return [];
    }

    query = query.eq("category_id", category.id);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data || []) as ProductRecord[];
}

async function fetchProductByHandle(handle: string) {
  const { data, error } = await supabaseAdmin()
    .from("products")
    .select(
      `
        id,
        category_id,
        name,
        title,
        slug,
        description,
        description_html,
        price,
        active,
        available_for_sale,
        seo_title,
        seo_description,
        tags,
        currency_code,
        created_at,
        updated_at,
        product_images (
          id,
          product_id,
          image_url,
          alt_text,
          position,
          bucket,
          storage_path,
          width,
          height,
          is_featured,
          created_at
        ),
        product_options (
          id,
          product_id,
          name,
          values,
          position,
          created_at,
          updated_at
        ),
        product_variants (
          id,
          product_id,
          title,
          sku,
          available_for_sale,
          price,
          currency_code,
          selected_options,
          position,
          created_at,
          updated_at
        )
      `,
    )
    .eq("slug", handle)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as ProductRecord | null;
}

async function recalculateCart(cartId: string) {
  const { data: cartItems, error } = await supabaseAdmin()
    .from("cart_items")
    .select("quantity, line_total")
    .eq("cart_id", cartId);

  if (error) {
    throw error;
  }

  const totals = (
    (cartItems || []) as Pick<DatabaseCartItemRow, "quantity" | "line_total">[]
  ).reduce(
    (accumulator, item) => ({
      totalQuantity: accumulator.totalQuantity + item.quantity,
      totalAmount: accumulator.totalAmount + Number(item.line_total),
    }),
    { totalQuantity: 0, totalAmount: 0 },
  );

  const { error: updateError } = await supabaseAdmin()
    .from("carts")
    .update({
      subtotal_amount: totals.totalAmount,
      total_amount: totals.totalAmount,
      tax_amount: 0,
      total_quantity: totals.totalQuantity,
    })
    .eq("id", cartId);

  if (updateError) {
    throw updateError;
  }
}

async function getCartById(cartId: string) {
  const { data, error } = await supabaseAdmin()
    .from("carts")
    .select(
      `
        id,
        checkout_url,
        subtotal_amount,
        total_amount,
        tax_amount,
        total_quantity,
        currency,
        cart_items (
          id,
          cart_id,
          product_id,
          variant_id,
          quantity,
          unit_price,
          line_total,
          products (
            id,
            category_id,
            name,
            title,
            slug,
            description,
            description_html,
            price,
            active,
            available_for_sale,
            seo_title,
            seo_description,
            tags,
            currency_code,
            created_at,
            updated_at,
            product_images (
              id,
              product_id,
              image_url,
              alt_text,
              position,
              bucket,
              storage_path,
              width,
              height,
              is_featured,
              created_at
            )
          ),
          product_variants (
            id,
            product_id,
            title,
            sku,
            available_for_sale,
            price,
            currency_code,
            selected_options,
            position,
            created_at,
            updated_at
          )
        )
      `,
    )
    .eq("id", cartId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as CartRecord | null;
}

export async function createCart(): Promise<Cart> {
  requireSupabaseServiceRoleKey();
  const { data, error } = await supabaseAdmin()
    .from("carts")
    .insert({
      currency: "BRL",
    })
    .select(
      "id, checkout_url, subtotal_amount, total_amount, tax_amount, total_quantity, currency",
    )
    .single();

  if (error) {
    throw error;
  }

  return reshapeCart({
    ...(data as DatabaseCartRow),
    cart_items: [],
  });
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  requireSupabaseServiceRoleKey();
  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    throw new Error("Cart cookie was not found");
  }

  for (const line of lines) {
    const variantId = Number(line.merchandiseId);
    const { data: variant, error: variantError } = await supabaseAdmin()
      .from("product_variants")
      .select("id, product_id, price, available_for_sale")
      .eq("id", variantId)
      .eq("available_for_sale", true)
      .single<{
        id: number;
        product_id: number;
        price: string | number;
        available_for_sale: boolean;
      }>();

    if (variantError) {
      throw variantError;
    }

    const { data: existingItem, error: existingItemError } =
      await supabaseAdmin()
        .from("cart_items")
        .select("id, quantity, variant_id")
        .eq("cart_id", cartId)
        .eq("variant_id", variant.id)
        .maybeSingle<{
          id: number;
          quantity: number;
          variant_id: number | null;
        }>();

    if (existingItemError) {
      throw existingItemError;
    }

    const quantity = (existingItem?.quantity || 0) + line.quantity;
    const unitPrice = Number(variant.price);
    const lineTotal = unitPrice * quantity;

    const mutation = existingItem
      ? supabaseAdmin()
          .from("cart_items")
          .update({
            quantity,
            unit_price: unitPrice,
            line_total: lineTotal,
          })
          .eq("id", existingItem.id)
      : supabaseAdmin().from("cart_items").insert({
          cart_id: cartId,
          product_id: variant.product_id,
          variant_id: variant.id,
          quantity,
          unit_price: unitPrice,
          line_total: lineTotal,
        });

    const { error: mutationError } = await mutation;

    if (mutationError) {
      throw mutationError;
    }
  }

  await recalculateCart(cartId);

  const cart = await getCartById(cartId);

  if (!cart) {
    throw new Error("Cart was not found after adding items");
  }

  return reshapeCart(cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  requireSupabaseServiceRoleKey();
  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    throw new Error("Cart cookie was not found");
  }

  const numericIds = lineIds.map((lineId) => Number(lineId)).filter(Boolean);

  const { error } = await supabaseAdmin()
    .from("cart_items")
    .delete()
    .in("id", numericIds)
    .eq("cart_id", cartId);

  if (error) {
    throw error;
  }

  await recalculateCart(cartId);

  const cart = await getCartById(cartId);

  if (!cart) {
    throw new Error("Cart was not found after removing items");
  }

  return reshapeCart(cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  requireSupabaseServiceRoleKey();
  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    throw new Error("Cart cookie was not found");
  }

  for (const line of lines) {
    const unitPriceSource = await supabaseAdmin()
      .from("product_variants")
      .select("price")
      .eq("id", Number(line.merchandiseId))
      .single<{ price: string | number }>();

    if (unitPriceSource.error) {
      throw unitPriceSource.error;
    }

    const unitPrice = Number(unitPriceSource.data.price);

    const { error } = await supabaseAdmin()
      .from("cart_items")
      .update({
        quantity: line.quantity,
        unit_price: unitPrice,
        line_total: unitPrice * line.quantity,
      })
      .eq("id", Number(line.id))
      .eq("cart_id", cartId);

    if (error) {
      throw error;
    }
  }

  await recalculateCart(cartId);

  const cart = await getCartById(cartId);

  if (!cart) {
    throw new Error("Cart was not found after updating items");
  }

  return reshapeCart(cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return undefined;
  }

  const cart = await getCartById(cartId);

  if (!cart) {
    return undefined;
  }

  return reshapeCart(cart);
}

export async function getCollection(
  handle: string,
  locale: Locale = defaultLocale,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const { data, error } = await supabaseAdmin()
    .from("categories")
    .select("id, name, slug, created_at")
    .eq("slug", handle)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? reshapeCategory(data as DatabaseCategoryRow, locale) : undefined;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  const fallbackCollection =
    collection === "hidden-homepage-featured-items" ||
    collection === "hidden-homepage-carousel"
      ? undefined
      : collection;
  const limit =
    collection === "hidden-homepage-featured-items"
      ? 3
      : collection === "hidden-homepage-carousel"
        ? 12
        : undefined;
  const products = await fetchProducts({
    categorySlug: fallbackCollection,
    limit,
  });

  const sorted = [...products].sort((left, right) => {
    if (sortKey === "PRICE") {
      return Number(left.price) - Number(right.price);
    }

    if (sortKey === "CREATED_AT") {
      return (
        new Date(left.created_at).getTime() -
        new Date(right.created_at).getTime()
      );
    }

    return (left.title || left.name).localeCompare(right.title || right.name);
  });

  return (reverse ? sorted.reverse() : sorted).map(reshapeProduct);
}

export async function getCollections(
  locale: Locale = defaultLocale,
): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");
  const { t } = createTranslator(locale);

  const { data, error } = await supabaseAdmin()
    .from("categories")
    .select("id, name, slug, created_at")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return [
    {
      handle: "",
      title: t("search.allProductsTitle"),
      description: t("search.allProductsDescription"),
      seo: {
        title: t("search.allProductsTitle"),
        description: t("search.allProductsDescription"),
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    ...((data || []) as DatabaseCategoryRow[]).map((category) =>
      reshapeCategory(category, locale),
    ),
  ];
}

export async function getMenu(
  handle: string,
  locale: Locale = defaultLocale,
): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const normalizedHandle = normalizeMenuHandle(handle);
  const { data, error } = await supabaseAdmin()
    .from("menus")
    .select(
      `
        id,
        title,
        handle,
        menu_items (
          id,
          title,
          path,
          position
        )
      `,
    )
    .eq("handle", normalizedHandle)
    .is("deleted_at", null)
    .is("menu_items.deleted_at", null)
    .maybeSingle();

  if (error) {
    throw error;
  }

  const menu = data as MenuRecord | null;
  const items = (menu?.menu_items || [])
    .sort((left, right) => left.position - right.position)
    .map((item) => ({
      title: item.title,
      path: item.path,
    }));

  return items.length ? items : createFallbackMenu(handle, locale);
}

export async function getPage(handle: string): Promise<Page> {
  const { data, error } = await supabaseAdmin()
    .from("pages")
    .select(
      "id, title, handle, body, body_summary, seo_title, seo_description, published, created_at, updated_at",
    )
    .eq("handle", handle)
    .eq("published", true)
    .single();

  if (error) {
    throw error;
  }

  return reshapePage(data as PageRecord);
}

export async function getPages(): Promise<Page[]> {
  const { data, error } = await supabaseAdmin()
    .from("pages")
    .select(
      "id, title, handle, body, body_summary, seo_title, seo_description, published, created_at, updated_at",
    )
    .eq("published", true)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data || []) as PageRecord[]).map(reshapePage);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const product = await fetchProductByHandle(handle);

  return product ? reshapeProduct(product) : undefined;
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const { data: currentProduct, error: currentProductError } =
    await supabaseAdmin()
      .from("products")
      .select("id, category_id")
      .eq("id", Number(productId))
      .maybeSingle<{ id: number; category_id: number | null }>();

  if (currentProductError) {
    throw currentProductError;
  }

  let query = supabaseAdmin()
    .from("products")
    .select(
      `
        id,
        category_id,
        name,
        title,
        slug,
        description,
        description_html,
        price,
        active,
        available_for_sale,
        seo_title,
        seo_description,
        tags,
        currency_code,
        created_at,
        updated_at,
        product_images (
          id,
          product_id,
          image_url,
          alt_text,
          position,
          bucket,
          storage_path,
          width,
          height,
          is_featured,
          created_at
        ),
        product_options (
          id,
          product_id,
          name,
          values,
          position,
          created_at,
          updated_at
        ),
        product_variants (
          id,
          product_id,
          title,
          sku,
          available_for_sale,
          price,
          currency_code,
          selected_options,
          position,
          created_at,
          updated_at
        )
      `,
    )
    .eq("active", true)
    .neq("id", Number(productId))
    .limit(5);

  if (currentProduct?.category_id) {
    query = query.eq("category_id", currentProduct.category_id);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return ((data || []) as ProductRecord[]).map(reshapeProduct);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const products = await fetchProducts({});
  const normalizedQuery = query?.trim().toLowerCase();
  const filtered = normalizedQuery
    ? products.filter((product) =>
        [
          product.title || product.name,
          product.name,
          product.description || "",
          product.slug,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : products;

  const sorted = [...filtered].sort((left, right) => {
    if (sortKey === "PRICE") {
      return Number(left.price) - Number(right.price);
    }

    if (sortKey === "CREATED_AT") {
      return (
        new Date(left.created_at).getTime() -
        new Date(right.created_at).getTime()
      );
    }

    return (left.title || left.name).localeCompare(right.title || right.name);
  });

  return (reverse ? sorted.reverse() : sorted).map(reshapeProduct);
}

function splitFullName(fullName: string | null | undefined) {
  const normalizedName = fullName?.trim();

  if (!normalizedName) {
    return {};
  }

  const [firstName, ...lastNameParts] = normalizedName.split(/\s+/);

  return {
    first_name: firstName,
    last_name: lastNameParts.join(" ") || undefined,
  };
}

async function getCheckoutPayer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabaseAdmin()
    .from("profiles")
    .select("email, full_name")
    .eq("id", user.id)
    .maybeSingle<{
      email: string | null;
      full_name: string | null;
    }>();

  const fullName =
    profile?.full_name ||
    (typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : null) ||
    (typeof user.user_metadata.name === "string"
      ? user.user_metadata.name
      : null);
  const email = profile?.email || user.email || undefined;
  const payer = {
    email,
    ...splitFullName(fullName),
  };

  if (!payer.email && !payer.first_name && !payer.last_name) {
    return null;
  }

  return {
    payer,
    userId: user.id,
    customerEmail: email ?? null,
    customerName: fullName ?? null,
  };
}

export async function createMercadoPagoCheckout(cart: Cart) {
  requireSupabaseServiceRoleKey();
  const checkoutPayer = await getCheckoutPayer();

  if (!checkoutPayer) {
    throw new Error("User must be logged in to start checkout");
  }

  const orderInsert: TablesInsert<"orders"> = {
    status: "pending_payment",
    payment_status: "pending",
    total_amount: Number(cart.cost.totalAmount.amount),
    currency: cart.cost.totalAmount.currencyCode,
    cart_id: cart.id,
    customer_email: checkoutPayer?.customerEmail,
    customer_name: checkoutPayer?.customerName,
    user_id: checkoutPayer?.userId ?? null,
  };

  const { data: order, error: orderError } = await supabaseAdmin()
    .from("orders")
    .insert(orderInsert)
    .select("id")
    .single<{ id: number }>();

  if (orderError) {
    throw orderError;
  }

  for (const line of cart.lines) {
    const unitPrice =
      Number(line.cost.totalAmount.amount) / Math.max(line.quantity, 1);

    const { error: itemError } = await supabaseAdmin()
      .from("order_items")
      .insert({
        order_id: order.id,
        product_id: Number(line.merchandise.product.id),
        variant_id: Number(line.merchandise.id),
        quantity: line.quantity,
        unit_price: unitPrice,
        line_total: unitPrice * line.quantity,
      });

    if (itemError) {
      throw itemError;
    }
  }

  const preference = await createCheckoutPreference({
    cart,
    externalReference: order.id.toString(),
    payer: checkoutPayer.payer,
    titlePrefix: process.env.SITE_NAME,
  });

  const { error: updateError } = await supabaseAdmin()
    .from("orders")
    .update({
      external_reference: order.id.toString(),
      checkout_url: preference.init_point,
      mercadopago_preference_id: preference.id,
      raw_checkout_response: preference,
    })
    .eq("id", order.id);

  if (updateError) {
    throw updateError;
  }

  if (cart.id) {
    await supabaseAdmin()
      .from("carts")
      .update({
        checkout_url: preference.init_point,
        status: "checkout_started",
      })
      .eq("id", cart.id);
  }

  return {
    url: preference.init_point,
    orderId: order.id,
  };
}

export async function revalidate(req: NextRequest): Promise<NextResponse> {
  const secret = req.nextUrl.searchParams.get("secret");
  const providedTag = req.nextUrl.searchParams.get("tag");

  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ status: 401 });
  }

  if (providedTag && Object.values(TAGS).includes(providedTag)) {
    revalidateTag(providedTag, "seconds");
    return NextResponse.json({
      status: 200,
      revalidated: true,
      tag: providedTag,
    });
  }

  revalidateTag(TAGS.collections, "seconds");
  revalidateTag(TAGS.products, "seconds");
  revalidateTag(TAGS.cart, "seconds");

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export async function persistMercadoPagoWebhook(
  payload: Record<string, unknown>,
) {
  const resourceType = extractMercadoPagoResourceType(payload);
  const paymentId = extractMercadoPagoPaymentId(payload);
  let normalizedPayload: Record<string, unknown> = payload;

  if (resourceType === "merchant_order" && paymentId) {
    const merchantOrder = await getMercadoPagoMerchantOrder(paymentId);
    const preferredPayment =
      merchantOrder.payments?.find((payment) => payment.status === "approved") ||
      merchantOrder.payments?.[0];

    normalizedPayload = {
      webhook: payload,
      merchant_order: merchantOrder,
      external_reference: merchantOrder.external_reference,
      status:
        preferredPayment?.status ||
        merchantOrder.order_status ||
        merchantOrder.status,
      transaction_amount:
        preferredPayment?.transaction_amount ||
        preferredPayment?.total_paid_amount ||
        merchantOrder.total_amount,
      id: preferredPayment?.id?.toString() || paymentId,
      payment_id: preferredPayment?.id?.toString(),
    };
  } else if (paymentId) {
    const payment = await getMercadoPagoPayment(paymentId);
    normalizedPayload = {
      webhook: payload,
      payment,
      external_reference: payment.external_reference,
      status: payment.status,
      transaction_amount: payment.transaction_amount,
      id: payment.id?.toString(),
    };
  }

  const externalReference =
    extractMercadoPagoExternalReference(normalizedPayload);

  if (!externalReference) {
    return;
  }

  const gatewayPaymentId = extractMercadoPagoPaymentId(normalizedPayload);
  const paymentGatewayStatus = extractMercadoPagoStatus(normalizedPayload);
  const amount = extractMercadoPagoAmount(normalizedPayload);
  const { paymentStatus, orderStatus, paymentRowStatus } =
    mapMercadoPagoStatuses(paymentGatewayStatus);

  const { data: order, error: orderError } = await supabaseAdmin()
    .from("orders")
    .select("id, cart_id, mercadopago_payment_id")
    .or(`external_reference.eq.${externalReference},id.eq.${externalReference}`)
    .limit(1)
    .maybeSingle<{ id: number; cart_id: string | null; mercadopago_payment_id: string | null }>();

  if (orderError) {
    throw orderError;
  }

  if (!order) {
    throw new Error(
      `Order not found for external reference ${externalReference}`,
    );
  }

  if (gatewayPaymentId) {
    const { data: existingPayment, error: existingPaymentError } =
      await supabaseAdmin()
        .from("payments")
        .select("id")
        .eq("gateway_payment_id", gatewayPaymentId)
        .maybeSingle<{ id: number }>();

    if (existingPaymentError) {
      throw existingPaymentError;
    }

    if (existingPayment) {
      const { error: paymentUpdateError } = await supabaseAdmin()
        .from("payments")
        .update({
          order_id: order.id,
          status: paymentRowStatus,
          amount: Math.max(amount, 0),
          raw_payload: normalizedPayload as Json,
        })
        .eq("id", existingPayment.id);

      if (paymentUpdateError) {
        throw paymentUpdateError;
      }
    } else {
      const { error: paymentInsertError } = await supabaseAdmin()
        .from("payments")
        .insert({
          order_id: order.id,
          gateway: "mercado_pago",
          gateway_payment_id: gatewayPaymentId,
          status: paymentRowStatus,
          amount: Math.max(amount, 0),
          raw_payload: normalizedPayload as Json,
        });

      if (paymentInsertError) {
        if (paymentInsertError.code !== "23505") {
          throw paymentInsertError;
        }

        const { error: concurrentPaymentUpdateError } = await supabaseAdmin()
          .from("payments")
          .update({
            order_id: order.id,
            status: paymentRowStatus,
            amount: Math.max(amount, 0),
            raw_payload: normalizedPayload as Json,
          })
          .eq("gateway_payment_id", gatewayPaymentId);

        if (concurrentPaymentUpdateError) {
          throw concurrentPaymentUpdateError;
        }
      }
    }
  }

  const { error: orderUpdateError } = await supabaseAdmin()
    .from("orders")
    .update({
      payment_status: paymentStatus,
      status: orderStatus,
      mercadopago_payment_id:
        gatewayPaymentId || order.mercadopago_payment_id || null,
    })
    .eq("id", order.id);

  if (orderUpdateError) {
    throw orderUpdateError;
  }

  const nextCartStatus =
    orderStatus === "paid"
      ? "completed"
      : orderStatus === "cancelled"
        ? "abandoned"
        : null;

  if (order.cart_id && nextCartStatus) {
    const { error: cartUpdateError } = await supabaseAdmin()
      .from("carts")
      .update({
        status: nextCartStatus,
      })
      .eq("id", order.cart_id);

    if (cartUpdateError) {
      throw cartUpdateError;
    }
  }
}

export async function getMercadoPagoWebhookSignature() {
  return (await headers()).get("x-signature");
}
