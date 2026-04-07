import "server-only";

import type { User } from "@supabase/supabase-js";
import {
  getSupabaseAdmin,
  requireSupabaseServiceRoleKey,
} from "lib/supabase/admin";
import type {
  DatabaseCategoryRow,
  DatabaseProductImageRow,
  DatabaseProductRow,
  DatabaseProductVariantRow,
  Image,
} from "lib/shopify/types";
import { createClient } from "lib/supabase/server";
import type { Database } from "lib/supabase/database.types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export const adminRoles = ["admin", "super_admin"] as const;

export type AdminRole = (typeof adminRoles)[number];
export type AdminProfile = Pick<
  ProfileRow,
  "id" | "email" | "full_name" | "role"
>;
export type AdminDirectoryRole = AdminRole | "customer";
export type AdminDirectoryUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: AdminDirectoryRole;
  createdAt: string | null;
  lastSignInAt: string | null;
  emailConfirmed: boolean;
  bannedUntil: string | null;
  isDisabled: boolean;
};

type AdminCategoryRecord = DatabaseCategoryRow;
type AdminProductRecord = DatabaseProductRow & {
  categories?: DatabaseCategoryRow | DatabaseCategoryRow[] | null;
  product_images?: DatabaseProductImageRow[] | null;
  product_variants?: DatabaseProductVariantRow[] | null;
};

type AdminOrderProductRecord = Pick<
  DatabaseProductRow,
  "id" | "name" | "title" | "slug"
> & {
  product_images?: DatabaseProductImageRow[] | null;
};

type AdminOrderVariantRecord = Pick<DatabaseProductVariantRow, "id" | "title">;

type AdminOrderItemRecord = {
  id: number;
  variant_id: number | null;
  product_id: number;
  quantity: number;
  unit_price: string | number;
  line_total: string | number;
  products?: AdminOrderProductRecord | AdminOrderProductRecord[] | null;
  product_variants?: AdminOrderVariantRecord | AdminOrderVariantRecord[] | null;
};

type AdminOrderRecord = {
  id: number;
  user_id: string | null;
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
  order_items?: AdminOrderItemRecord[] | null;
};

type AdminPaymentRecord = {
  id: number;
  order_id: number;
  gateway: string;
  gateway_payment_id: string | null;
  status: string;
  amount: string | number;
  created_at: string;
  updated_at: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
};

export type AdminCatalogProduct = {
  id: string;
  name: string;
  title: string;
  slug: string;
  description: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  active: boolean;
  availableForSale: boolean;
  category: AdminCategory | null;
  featuredImage: Image | null;
  featuredImageUrl: string;
  featuredImageAlt: string;
  tags: string[];
  variantCount: number;
  updatedAt: string;
};

export type AdminOrderItem = {
  id: string;
  quantity: number;
  variantTitle: string | null;
  unitPrice: {
    amount: string;
    currencyCode: string;
  };
  lineTotal: {
    amount: string;
    currencyCode: string;
  };
  product: {
    id: string;
    handle: string;
    title: string;
    featuredImage: Image;
  };
};

export type AdminOrderPayment = {
  id: string;
  gateway: string;
  gatewayPaymentId: string | null;
  status: string;
  amount: {
    amount: string;
    currencyCode: string;
  };
  createdAt: string;
};

export type AdminOrder = {
  id: string;
  userId: string | null;
  externalReference: string | null;
  status: string;
  paymentStatus: string;
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
  customerEmail: string | null;
  customerName: string | null;
  checkoutUrl: string | null;
  mercadoPagoPaymentId: string | null;
  createdAt: string;
  updatedAt: string;
  items: AdminOrderItem[];
  latestPayment: AdminOrderPayment | null;
};

function toAmountString(value: number | string | null | undefined) {
  return Number(value ?? 0).toFixed(2);
}

function pickRelationValue<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function normalizeProductImage(
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

export function isAdminRole(role?: string | null): role is AdminRole {
  return role === "admin" || role === "super_admin";
}

export function isSuperAdminRole(
  role?: string | null,
): role is Extract<AdminRole, "super_admin"> {
  return role === "super_admin";
}

export async function getCurrentAdminContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      isAdmin: false,
      isSuperAdmin: false,
    };
  }

  const { data: profile, error } = await getSupabaseAdmin()
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle<AdminProfile>();

  if (error) {
    console.error("Failed to resolve admin context", error);

    return {
      user,
      profile: null,
      isAdmin: false,
      isSuperAdmin: false,
    };
  }

  return {
    user,
    profile: profile ?? null,
    isAdmin: isAdminRole(profile?.role),
    isSuperAdmin: isSuperAdminRole(profile?.role),
  };
}

function normalizeDirectoryRole(role?: string | null): AdminDirectoryRole {
  return isAdminRole(role) ? role : "customer";
}

export async function getAdminUsers(): Promise<AdminDirectoryUser[]> {
  requireSupabaseServiceRoleKey();

  const supabaseAdmin = getSupabaseAdmin();
  const authUsers: User[] = [];
  const perPage = 200;

  for (let page = 1; ; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const batch = data.users ?? [];
    authUsers.push(...batch);

    if (batch.length < perPage) {
      break;
    }
  }

  if (!authUsers.length) {
    return [];
  }

  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .in(
      "id",
      authUsers.map((user) => user.id),
    );

  if (profilesError) {
    throw profilesError;
  }

  const profilesById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );

  return authUsers
    .map((user) => {
      const profile = profilesById.get(user.id);
      const bannedUntil = user.banned_until ?? null;
      const fullNameFromMetadata =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name
            : null;

      return {
        id: user.id,
        email: user.email ?? profile?.email ?? null,
        fullName: profile?.full_name ?? fullNameFromMetadata,
        role: normalizeDirectoryRole(profile?.role),
        createdAt: profile?.created_at ?? user.created_at ?? null,
        lastSignInAt: user.last_sign_in_at ?? null,
        emailConfirmed: Boolean(user.email_confirmed_at),
        bannedUntil,
        isDisabled: bannedUntil
          ? new Date(bannedUntil).getTime() > Date.now()
          : false,
      };
    })
    .sort((left, right) => {
      const leftDate = left.createdAt ? new Date(left.createdAt).getTime() : 0;
      const rightDate = right.createdAt
        ? new Date(right.createdAt).getTime()
        : 0;

      return rightDate - leftDate;
    });
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  requireSupabaseServiceRoleKey();

  const { data, error } = await getSupabaseAdmin()
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data || []) as AdminCategoryRecord[]).map((category) => ({
    id: category.id.toString(),
    name: category.name,
    slug: category.slug,
  }));
}

export async function getAdminProducts(): Promise<AdminCatalogProduct[]> {
  requireSupabaseServiceRoleKey();

  const { data, error } = await getSupabaseAdmin()
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
        categories (
          id,
          name,
          slug,
          created_at
        ),
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
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data || []) as AdminProductRecord[]).map((product) => {
    const category = pickRelationValue(product.categories);
    const images = [...(product.product_images || [])].sort(
      (left, right) => left.position - right.position,
    );
    const featuredImageRow =
      images.find((image) => image.is_featured) || images[0] || null;
    const featuredImage = featuredImageRow
      ? normalizeProductImage(
          featuredImageRow,
          product.title || product.name,
        )
      : null;

    return {
      id: product.id.toString(),
      name: product.name,
      title: product.title || product.name,
      slug: product.slug,
      description: product.description || "",
      price: {
        amount: toAmountString(product.price),
        currencyCode: product.currency_code.trim() || "BRL",
      },
      active: product.active,
      availableForSale: product.available_for_sale,
      category: category
        ? {
            id: category.id.toString(),
            name: category.name,
            slug: category.slug,
          }
        : null,
      featuredImage,
      featuredImageUrl: featuredImageRow?.image_url || "",
      featuredImageAlt:
        featuredImageRow?.alt_text || product.title || product.name,
      tags: product.tags || [],
      variantCount: product.product_variants?.length || 0,
      updatedAt: product.updated_at,
    };
  });
}

export async function getAdminOrders(): Promise<AdminOrder[]> {
  requireSupabaseServiceRoleKey();

  const { data: orders, error: orderError } = await getSupabaseAdmin()
    .from("orders")
    .select(
      `
        id,
        user_id,
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
          variant_id,
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
          ),
          product_variants (
            id,
            title
          )
        )
      `,
    )
    .order("created_at", { ascending: false });

  if (orderError) {
    throw orderError;
  }

  const orderRows = (orders || []) as unknown as AdminOrderRecord[];

  if (!orderRows.length) {
    return [];
  }

  const { data: payments, error: paymentError } = await getSupabaseAdmin()
    .from("payments")
    .select(
      "id, order_id, gateway, gateway_payment_id, status, amount, created_at, updated_at",
    )
    .in(
      "order_id",
      orderRows.map((order) => order.id),
    )
    .order("created_at", { ascending: false });

  if (paymentError) {
    throw paymentError;
  }

  const latestPaymentsByOrder = new Map<number, AdminPaymentRecord>();

  for (const payment of (payments || []) as AdminPaymentRecord[]) {
    if (!latestPaymentsByOrder.has(payment.order_id)) {
      latestPaymentsByOrder.set(payment.order_id, payment);
    }
  }

  return orderRows.map((order) => {
    const currency = order.currency.trim() || "BRL";
    const latestPayment = latestPaymentsByOrder.get(order.id);

    return {
      id: order.id.toString(),
      userId: order.user_id,
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
      items: (order.order_items || []).map((item) => {
        const product = pickRelationValue(item.products);
        const variant = pickRelationValue(item.product_variants);
        const productImages = product?.product_images || [];
        const featuredImage =
          productImages.find((image) => image.is_featured) ||
          productImages[0] ||
          null;

        return {
          id: item.id.toString(),
          quantity: item.quantity,
          variantTitle:
            variant?.title && variant.title !== product?.title
              ? variant.title
              : null,
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
            title: product?.title || product?.name || "Produto",
            featuredImage: normalizeProductImage(
              featuredImage,
              product?.title || product?.name || "Produto",
            ),
          },
        };
      }),
      latestPayment: latestPayment
        ? {
            id: latestPayment.id.toString(),
            gateway: latestPayment.gateway,
            gatewayPaymentId: latestPayment.gateway_payment_id,
            status: latestPayment.status,
            amount: {
              amount: toAmountString(latestPayment.amount),
              currencyCode: currency,
            },
            createdAt: latestPayment.created_at,
          }
        : null,
    };
  });
}
