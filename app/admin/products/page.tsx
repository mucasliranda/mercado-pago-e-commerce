import { upsertAdminProduct } from "app/admin/actions";
import { MessageBanner } from "components/admin/message-banner";
import { SubmitButton } from "components/auth/submit-button";
import {
  getAdminCategories,
  getAdminProducts,
  getCurrentAdminContext,
} from "lib/admin";
import { getTranslations } from "lib/i18n/server";
import Link from "next/link";

type MessageTone = "error" | "success";

function Field({
  label,
  name,
  placeholder,
  type = "text",
  defaultValue,
  required = true,
  step,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <label className="grid gap-2 text-sm text-neutral-700 dark:text-neutral-200">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-black placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:bg-neutral-900"
      />
    </label>
  );
}

function TextAreaField({
  label,
  name,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm text-neutral-700 dark:text-neutral-200">
      <span className="font-medium">{label}</span>
      <textarea
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={5}
        className="min-h-32 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-black placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:bg-neutral-900"
      />
    </label>
  );
}

function ToggleField({
  label,
  description,
  name,
  defaultChecked,
}: {
  label: string;
  description: string;
  name: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 h-4 w-4 rounded border-neutral-300 text-black focus:ring-black dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:ring-white"
      />
      <span className="grid gap-1">
        <span className="text-sm font-medium text-black dark:text-white">
          {label}
        </span>
        <span className="text-sm leading-5 text-neutral-500 dark:text-neutral-400">
          {description}
        </span>
      </span>
    </label>
  );
}

function formatCurrency(locale: string, amount: string, currency: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(Number(amount));
}

function formatDate(locale: string, value: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStateBadgeClasses(active: boolean) {
  return active
    ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
    : "border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300";
}

function getAvailabilityBadgeClasses(availableForSale: boolean) {
  return availableForSale
    ? "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-100"
    : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100";
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    message?: string;
    tone?: MessageTone;
    edit?: string;
  }>;
}) {
  const [
    { message, tone, edit },
    { locale, t },
    { isSuperAdmin },
    products,
    categories,
  ] = await Promise.all([
    searchParams,
    getTranslations(),
    getCurrentAdminContext(),
    getAdminProducts(),
    getAdminCategories(),
  ]);

  const selectedProduct = products.find((product) => product.id === edit) || null;
  const effectiveTone = tone === "success" ? "success" : "error";
  const activeProducts = products.filter((product) => product.active).length;
  const availableProducts = products.filter(
    (product) => product.availableForSale,
  ).length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.products.metrics.totalProducts")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {products.length}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.products.metrics.activeProducts")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {activeProducts}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.products.metrics.availableProducts")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {availableProducts}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.products.metrics.categories")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {categories.length}
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium text-black dark:text-white">
              {t("admin.products.listTitle")}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {t("admin.products.listDescription")}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {products.length ? (
              products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5 transition hover:border-neutral-300 hover:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-950"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black">
                        {product.featuredImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                            IMG
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 space-y-2">
                        <div>
                          <h3 className="truncate text-lg font-medium text-black dark:text-white">
                            {product.title}
                          </h3>
                          <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                            /product/{product.slug}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStateBadgeClasses(
                              product.active,
                            )}`}
                          >
                            {product.active
                              ? t("admin.products.state.active")
                              : t("admin.products.state.inactive")}
                          </span>
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getAvailabilityBadgeClasses(
                              product.availableForSale,
                            )}`}
                          >
                            {product.availableForSale
                              ? t("admin.products.state.available")
                              : t("admin.products.state.unavailable")}
                          </span>
                          <span className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-black dark:text-neutral-300">
                            {product.category?.name ||
                              t("admin.products.noCategory")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm text-neutral-600 sm:grid-cols-2 lg:min-w-[320px] dark:text-neutral-300">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                          {t("admin.products.fields.price")}
                        </p>
                        <p className="mt-2 font-medium text-black dark:text-white">
                          {formatCurrency(
                            locale,
                            product.price.amount,
                            product.price.currencyCode,
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                          {t("admin.products.fields.updatedAt")}
                        </p>
                        <p className="mt-2 font-medium text-black dark:text-white">
                          {formatDate(locale, product.updatedAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                          {t("admin.products.fields.variants")}
                        </p>
                        <p className="mt-2 font-medium text-black dark:text-white">
                          {product.variantCount === 1
                            ? t("admin.products.variantCountSingle", {
                                count: product.variantCount,
                              })
                            : t("admin.products.variantCountPlural", {
                                count: product.variantCount,
                              })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {product.tags.length ? (
                      product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-black dark:text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-neutral-400 dark:text-neutral-500">
                        {t("admin.products.noTags")}
                      </span>
                    )}

                    {isSuperAdmin ? (
                      <Link
                        href={`/admin/products?edit=${product.id}`}
                        className="ml-auto inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-black transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
                      >
                        {t("admin.products.actions.edit")}
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/80">
                <h3 className="text-lg font-medium text-black dark:text-white">
                  {t("admin.products.emptyTitle")}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {t("admin.products.emptyDescription")}
                </p>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
            <div className="space-y-4">
              <MessageBanner message={message} tone={effectiveTone} />

              <div className="space-y-2">
                <h2 className="text-2xl font-medium text-black dark:text-white">
                  {selectedProduct
                    ? t("admin.products.form.editTitle", {
                        title: selectedProduct.title,
                      })
                    : t("admin.products.form.createTitle")}
                </h2>
                <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {isSuperAdmin
                    ? t("admin.products.form.description")
                    : t("admin.products.restrictedBody")}
                </p>
              </div>

              {selectedProduct ? (
                <Link
                  href="/admin/products"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-black transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
                >
                  {t("admin.products.actions.createNew")}
                </Link>
              ) : null}
            </div>

            {isSuperAdmin ? (
              <form action={upsertAdminProduct} className="mt-6 space-y-5">
                {selectedProduct ? (
                  <input
                    type="hidden"
                    name="productId"
                    value={selectedProduct.id}
                  />
                ) : null}

                <div className="grid gap-4">
                  <Field
                    label={t("admin.products.fields.title")}
                    name="title"
                    placeholder={t("admin.products.placeholders.title")}
                    defaultValue={selectedProduct?.title}
                  />
                  <Field
                    label={t("admin.products.fields.slug")}
                    name="slug"
                    placeholder={t("admin.products.placeholders.slug")}
                    defaultValue={selectedProduct?.slug}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label={t("admin.products.fields.price")}
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      defaultValue={selectedProduct?.price.amount}
                    />
                    <label className="grid gap-2 text-sm text-neutral-700 dark:text-neutral-200">
                      <span className="font-medium">
                        {t("admin.products.fields.category")}
                      </span>
                      <select
                        name="categoryId"
                        defaultValue={selectedProduct?.category?.id || ""}
                        className="h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-black focus:border-neutral-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-neutral-600 dark:focus:bg-neutral-900"
                      >
                        <option value="">
                          {t("admin.products.placeholders.category")}
                        </option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <TextAreaField
                    label={t("admin.products.fields.description")}
                    name="description"
                    placeholder={t("admin.products.placeholders.description")}
                    defaultValue={selectedProduct?.description}
                  />

                  <Field
                    label={t("admin.products.fields.imageUrl")}
                    name="imageUrl"
                    type="url"
                    required={false}
                    placeholder={t("admin.products.placeholders.imageUrl")}
                    defaultValue={selectedProduct?.featuredImageUrl}
                  />
                  <Field
                    label={t("admin.products.fields.imageAlt")}
                    name="imageAlt"
                    required={false}
                    placeholder={t("admin.products.placeholders.imageAlt")}
                    defaultValue={selectedProduct?.featuredImageAlt}
                  />
                  <Field
                    label={t("admin.products.fields.tags")}
                    name="tags"
                    required={false}
                    placeholder={t("admin.products.placeholders.tags")}
                    defaultValue={selectedProduct?.tags.join(", ")}
                  />

                  <div className="grid gap-3">
                    <ToggleField
                      name="active"
                      label={t("admin.products.fields.active")}
                      description={t("admin.products.fields.activeDescription")}
                      defaultChecked={selectedProduct?.active ?? true}
                    />
                    <ToggleField
                      name="availableForSale"
                      label={t("admin.products.fields.availableForSale")}
                      description={t(
                        "admin.products.fields.availableForSaleDescription",
                      )}
                      defaultChecked={selectedProduct?.availableForSale ?? true}
                    />
                  </div>
                </div>

                <SubmitButton
                  idleLabel={
                    selectedProduct
                      ? t("admin.products.actions.update")
                      : t("admin.products.actions.create")
                  }
                  pendingLabel={t("admin.products.actions.pending")}
                />
              </form>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
