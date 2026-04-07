"use server";

import { getCurrentAdminContext, isAdminRole } from "lib/admin";
import { DEFAULT_OPTION, TAGS } from "lib/constants";
import { getTranslations } from "lib/i18n/server";
import {
  getSupabaseAdmin,
  requireSupabaseServiceRoleKey,
} from "lib/supabase/admin";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

function getField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getCheckboxValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function getNumericField(formData: FormData, key: string) {
  const value = getField(formData, key);

  if (!value) {
    return null;
  }

  const normalized = Number(value.replace(",", "."));
  return Number.isFinite(normalized) ? normalized : null;
}

function getNumericIdField(formData: FormData, key: string) {
  const value = getNumericField(formData, key);
  return value && value > 0 ? Math.trunc(value) : null;
}

function createAdminRedirect(
  path: string,
  message: string,
  tone: "error" | "success",
  params?: Record<string, string | undefined>,
) {
  const searchParams = new URLSearchParams({ message, tone });

  for (const [key, value] of Object.entries(params || {})) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  return `${path}?${searchParams.toString()}`;
}

function createUsersRedirect(message: string, tone: "error" | "success") {
  return createAdminRedirect("/admin/users", message, tone);
}

function createProductsRedirect(
  message: string,
  tone: "error" | "success",
  params?: Record<string, string | undefined>,
) {
  return createAdminRedirect("/admin/products", message, tone, params);
}

function createOrdersRedirect(message: string, tone: "error" | "success") {
  return createAdminRedirect("/admin/orders", message, tone);
}

function mapCreateUserErrorMessage(message: string, fallback: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("already been registered") ||
    normalized.includes("already registered") ||
    normalized.includes("already exists") ||
    normalized.includes("duplicate")
  ) {
    return "email_in_use";
  }

  return fallback;
}

function normalizeProductSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function toDescriptionHtml(value: string) {
  return value
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

function parseTags(value: string) {
  return [...new Set(
    value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  )];
}

async function requireAdminPanelAccess(path: string) {
  const { t } = await getTranslations();
  const { user, isAdmin, isSuperAdmin } = await getCurrentAdminContext();

  if (!user) {
    redirect(
      `/login?message=${encodeURIComponent(t("auth.validation.accessAccount"))}&next=${encodeURIComponent(path)}`,
    );
  }

  if (!isAdmin) {
    redirect("/account");
  }

  requireSupabaseServiceRoleKey();

  return { user, isSuperAdmin, t, supabaseAdmin: getSupabaseAdmin() };
}

async function requireSuperAdminAccess(path: string, errorKey: string) {
  const context = await requireAdminPanelAccess(path);

  if (!context.isSuperAdmin) {
    redirect(createAdminRedirect(path, context.t(errorKey), "error"));
  }

  return context;
}

export async function createAdminUser(formData: FormData) {
  const { t, supabaseAdmin } = await requireSuperAdminAccess(
    "/admin/users",
    "admin.createUser.errors.superAdminOnly",
  );

  const fullName = getField(formData, "fullName");
  const email = getField(formData, "email").toLowerCase();
  const password = getField(formData, "password");
  const role = getField(formData, "role");

  if (!fullName) {
    redirect(
      createUsersRedirect(t("admin.createUser.errors.fullNameRequired"), "error"),
    );
  }

  if (!email || !email.includes("@")) {
    redirect(
      createUsersRedirect(t("admin.createUser.errors.invalidEmail"), "error"),
    );
  }

  if (!password || password.length < 8) {
    redirect(
      createUsersRedirect(t("admin.createUser.errors.shortPassword"), "error"),
    );
  }

  if (!isAdminRole(role)) {
    redirect(
      createUsersRedirect(t("admin.createUser.errors.invalidRole"), "error"),
    );
  }

  const roleLabel = t(`admin.roles.${role}`);
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
    app_metadata: {
      role,
    },
  });

  if (error || !data.user) {
    const message =
      error?.message &&
      mapCreateUserErrorMessage(
        error.message,
        t("admin.createUser.errors.createFailed"),
      );

    redirect(
      createUsersRedirect(
        message === "email_in_use"
          ? t("admin.createUser.errors.emailInUse")
          : t("admin.createUser.errors.createFailed"),
        "error",
      ),
    );
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
    {
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    },
    {
      onConflict: "id",
    },
  );

  if (profileError) {
    redirect(
      createUsersRedirect(
        t("admin.createUser.errors.profileSyncFailed"),
        "error",
      ),
    );
  }

  redirect(
    createUsersRedirect(
      t("admin.createUser.success", { email, role: roleLabel }),
      "success",
    ),
  );
}

async function getManagedAdminProfile(userId: string) {
  const { supabaseAdmin, t } = await requireSuperAdminAccess(
    "/admin/users",
    "admin.userManagement.errors.superAdminOnly",
  );
  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("id, email, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    redirect(
      createUsersRedirect(
        t("admin.userManagement.errors.loadTargetFailed"),
        "error",
      ),
    );
  }

  if (!profile || profile.role !== "admin") {
    redirect(
      createUsersRedirect(
        t("admin.userManagement.errors.adminOnly"),
        "error",
      ),
    );
  }

  return { profile, supabaseAdmin, t };
}

export async function deactivateAdminUser(formData: FormData) {
  const userId = getField(formData, "userId");
  const currentContext = await requireSuperAdminAccess(
    "/admin/users",
    "admin.userManagement.errors.superAdminOnly",
  );

  if (!userId || userId === currentContext.user.id) {
    redirect(
      createUsersRedirect(
        currentContext.t("admin.userManagement.errors.invalidTarget"),
        "error",
      ),
    );
  }

  const { profile, supabaseAdmin, t } = await getManagedAdminProfile(userId);
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    ban_duration: "876000h",
  });

  if (error) {
    redirect(
      createUsersRedirect(
        t("admin.userManagement.errors.deactivateFailed"),
        "error",
      ),
    );
  }

  redirect(
    createUsersRedirect(
      t("admin.userManagement.success.deactivated", {
        email: profile.email ?? profile.id,
      }),
      "success",
    ),
  );
}

export async function reactivateAdminUser(formData: FormData) {
  const userId = getField(formData, "userId");
  const currentContext = await requireSuperAdminAccess(
    "/admin/users",
    "admin.userManagement.errors.superAdminOnly",
  );

  if (!userId || userId === currentContext.user.id) {
    redirect(
      createUsersRedirect(
        currentContext.t("admin.userManagement.errors.invalidTarget"),
        "error",
      ),
    );
  }

  const { profile, supabaseAdmin, t } = await getManagedAdminProfile(userId);
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    ban_duration: "none",
  });

  if (error) {
    redirect(
      createUsersRedirect(
        t("admin.userManagement.errors.reactivateFailed"),
        "error",
      ),
    );
  }

  redirect(
    createUsersRedirect(
      t("admin.userManagement.success.reactivated", {
        email: profile.email ?? profile.id,
      }),
      "success",
    ),
  );
}

export async function deleteAdminUser(formData: FormData) {
  const userId = getField(formData, "userId");
  const currentContext = await requireSuperAdminAccess(
    "/admin/users",
    "admin.userManagement.errors.superAdminOnly",
  );

  if (!userId || userId === currentContext.user.id) {
    redirect(
      createUsersRedirect(
        currentContext.t("admin.userManagement.errors.invalidTarget"),
        "error",
      ),
    );
  }

  const { profile, supabaseAdmin, t } = await getManagedAdminProfile(userId);
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId, false);

  if (error) {
    redirect(
      createUsersRedirect(
        t("admin.userManagement.errors.deleteFailed"),
        "error",
      ),
    );
  }

  redirect(
    createUsersRedirect(
      t("admin.userManagement.success.deleted", {
        email: profile.email ?? profile.id,
      }),
      "success",
    ),
  );
}

export async function upsertAdminProduct(formData: FormData) {
  const { t, supabaseAdmin } = await requireSuperAdminAccess(
    "/admin/products",
    "admin.products.errors.superAdminOnly",
  );

  const productId = getNumericIdField(formData, "productId");
  const title = getField(formData, "title");
  const slug = normalizeProductSlug(getField(formData, "slug") || title);
  const description = getField(formData, "description");
  const imageUrl = getField(formData, "imageUrl");
  const imageAlt = getField(formData, "imageAlt") || title;
  const tags = parseTags(getField(formData, "tags"));
  const categoryId = getNumericIdField(formData, "categoryId");
  const price = getNumericField(formData, "price");
  const active = getCheckboxValue(formData, "active");
  const availableForSale = getCheckboxValue(formData, "availableForSale");

  if (!title) {
    redirect(
      createProductsRedirect(t("admin.products.errors.titleRequired"), "error"),
    );
  }

  if (!slug) {
    redirect(
      createProductsRedirect(t("admin.products.errors.slugRequired"), "error"),
    );
  }

  if (price === null || price < 0) {
    redirect(
      createProductsRedirect(t("admin.products.errors.invalidPrice"), "error"),
    );
  }

  const productPayload = {
    category_id: categoryId,
    name: title,
    title,
    slug,
    description: description || null,
    description_html: description ? toDescriptionHtml(description) : null,
    price,
    active,
    available_for_sale: availableForSale,
    seo_title: title,
    seo_description: description || title,
    tags,
    currency_code: "BRL",
  };

  const mutation = productId
    ? await supabaseAdmin
        .from("products")
        .update(productPayload)
        .eq("id", productId)
        .select("id")
        .maybeSingle<{ id: number }>()
    : await supabaseAdmin
        .from("products")
        .insert(productPayload)
        .select("id")
        .single<{ id: number }>();

  if (mutation.error || !mutation.data) {
    const isDuplicateSlug =
      mutation.error?.code === "23505" &&
      mutation.error.message.toLowerCase().includes("slug");

    redirect(
      createProductsRedirect(
        isDuplicateSlug
          ? t("admin.products.errors.slugInUse")
          : t("admin.products.errors.saveFailed"),
        "error",
        productId ? { edit: productId.toString() } : undefined,
      ),
    );
  }

  const persistedProductId = mutation.data.id;
  const { data: existingVariants, error: variantsError } = await supabaseAdmin
    .from("product_variants")
    .select("id")
    .eq("product_id", persistedProductId);

  if (variantsError) {
    redirect(
      createProductsRedirect(
        t("admin.products.errors.variantSyncFailed"),
        "error",
        { edit: persistedProductId.toString() },
      ),
    );
  }

  if ((existingVariants || []).length) {
    const { error: variantUpdateError } = await supabaseAdmin
      .from("product_variants")
      .update({
        price,
        available_for_sale: availableForSale,
        currency_code: "BRL",
      })
      .eq("product_id", persistedProductId);

    if (variantUpdateError) {
      redirect(
        createProductsRedirect(
          t("admin.products.errors.variantSyncFailed"),
          "error",
          { edit: persistedProductId.toString() },
        ),
      );
    }
  } else {
    const { error: variantInsertError } = await supabaseAdmin
      .from("product_variants")
      .insert({
        product_id: persistedProductId,
        title: DEFAULT_OPTION,
        available_for_sale: availableForSale,
        price,
        currency_code: "BRL",
        selected_options: [],
        position: 0,
      });

    if (variantInsertError) {
      redirect(
        createProductsRedirect(
          t("admin.products.errors.variantSyncFailed"),
          "error",
          { edit: persistedProductId.toString() },
        ),
      );
    }
  }

  if (imageUrl || imageAlt) {
    const { data: existingImage, error: existingImageError } =
      await supabaseAdmin
        .from("product_images")
        .select("id, image_url")
        .eq("product_id", persistedProductId)
        .order("is_featured", { ascending: false })
        .order("position", { ascending: true })
        .limit(1)
        .maybeSingle<{ id: number; image_url: string }>();

    if (existingImageError) {
      redirect(
        createProductsRedirect(
          t("admin.products.errors.imageSyncFailed"),
          "error",
          { edit: persistedProductId.toString() },
        ),
      );
    }

    if (existingImage) {
      const { error: imageUpdateError } = await supabaseAdmin
        .from("product_images")
        .update({
          image_url: imageUrl || existingImage.image_url,
          alt_text: imageAlt || title,
          is_featured: true,
          position: 0,
        })
        .eq("id", existingImage.id);

      if (imageUpdateError) {
        redirect(
          createProductsRedirect(
            t("admin.products.errors.imageSyncFailed"),
            "error",
            { edit: persistedProductId.toString() },
          ),
        );
      }
    } else if (imageUrl) {
      const { error: imageInsertError } = await supabaseAdmin
        .from("product_images")
        .insert({
          product_id: persistedProductId,
          image_url: imageUrl,
          alt_text: imageAlt || title,
          position: 0,
          is_featured: true,
        });

      if (imageInsertError) {
        redirect(
          createProductsRedirect(
            t("admin.products.errors.imageSyncFailed"),
            "error",
            { edit: persistedProductId.toString() },
          ),
        );
      }
    }
  }

  revalidateTag(TAGS.products, "seconds");
  revalidatePath("/search");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);

  redirect(
    createProductsRedirect(
      t(
        productId
          ? "admin.products.success.updated"
          : "admin.products.success.created",
        { title },
      ),
      "success",
      { edit: persistedProductId.toString() },
    ),
  );
}

export async function markOrderAsDelivered(formData: FormData) {
  const { t, supabaseAdmin } = await requireAdminPanelAccess("/admin/orders");
  const orderId = getNumericIdField(formData, "orderId");

  if (!orderId) {
    redirect(
      createOrdersRedirect(t("admin.orders.errors.invalidTarget"), "error"),
    );
  }

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, status, payment_status")
    .eq("id", orderId)
    .maybeSingle<{ id: number; status: string; payment_status: string }>();

  if (orderError || !order) {
    redirect(
      createOrdersRedirect(t("admin.orders.errors.invalidTarget"), "error"),
    );
  }

  if (order.status === "delivered") {
    redirect(
      createOrdersRedirect(t("admin.orders.success.alreadyDelivered"), "success"),
    );
  }

  if (order.status !== "paid" || order.payment_status !== "paid") {
    redirect(
      createOrdersRedirect(t("admin.orders.errors.notReadyForDelivery"), "error"),
    );
  }

  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({ status: "delivered" })
    .eq("id", order.id);

  if (updateError) {
    redirect(
      createOrdersRedirect(t("admin.orders.errors.deliveryUpdateFailed"), "error"),
    );
  }

  revalidatePath("/admin/orders");
  revalidatePath("/account");

  redirect(
    createOrdersRedirect(
      t("admin.orders.success.delivered", { id: order.id }),
      "success",
    ),
  );
}
