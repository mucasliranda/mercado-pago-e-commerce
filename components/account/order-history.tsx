import Image from "next/image";
import Link from "next/link";
import type { Locale } from "lib/i18n";
import { getTranslations } from "lib/i18n/server";
import type { AccountOrder } from "lib/shopify/types";

function formatDate(locale: string, value: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(locale: string, amount: string, currency: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(Number(amount));
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "paid":
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200";
    case "delivered":
      return "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/70 dark:bg-cyan-950/40 dark:text-cyan-200";
    case "authorized":
    case "pending":
    case "pending_payment":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200";
    case "cancelled":
    case "failed":
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-200";
    case "refunded":
      return "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-200";
    default:
      return "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300";
  }
}

function formatFallbackStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getLocalizedStatus(
  t: (key: string) => string,
  type: "order" | "payment",
  status: string,
) {
  const key = `account.orders.status.${type}.${status}`;
  const translated = t(key);

  return translated === key ? formatFallbackStatus(status) : translated;
}

export async function OrderHistory({
  locale,
  orders,
}: {
  locale: Locale;
  orders: AccountOrder[];
}) {
  const { t } = await getTranslations(locale);

  if (!orders.length) {
    return (
      <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
        <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          {t("account.orders.badge")}
        </span>
        <div className="mt-6 space-y-3">
          <h2 className="text-3xl font-medium tracking-tight text-black dark:text-white">
            {t("account.orders.title")}
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            {t("account.orders.emptyDescription")}
          </p>
        </div>
        <div className="mt-8 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50/70 p-6 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300">
          <p className="font-medium text-black dark:text-white">
            {t("account.orders.emptyTitle")}
          </p>
          <p className="mt-2">{t("account.orders.emptyDescription")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
      <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        {t("account.orders.badge")}
      </span>
      <div className="mt-6 space-y-3">
        <h2 className="text-3xl font-medium tracking-tight text-black dark:text-white">
          {t("account.orders.title")}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          {t("account.orders.description")}
        </p>
      </div>

      <div className="mt-8 grid gap-5">
        {orders.map((order) => {
          const itemCountLabel =
            order.items.length === 1
              ? t("account.orders.itemCountSingle", {
                  count: order.items.length,
                })
              : t("account.orders.itemCountPlural", {
                  count: order.items.length,
                });

          return (
            <article
              key={order.id}
              className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50/80 p-6 dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 dark:border-neutral-800 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                      {t("account.orders.orderNumber", { id: order.id })}
                    </span>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${getStatusBadgeClass(
                        order.status,
                      )}`}
                    >
                      {getLocalizedStatus(t, "order", order.status)}
                    </span>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${getStatusBadgeClass(
                        order.paymentStatus,
                      )}`}
                    >
                      {getLocalizedStatus(t, "payment", order.paymentStatus)}
                    </span>
                  </div>
                  <div className="grid gap-2 text-sm text-neutral-600 dark:text-neutral-300 md:grid-cols-2">
                    <p>
                      <span className="text-neutral-400 dark:text-neutral-500">
                        {t("account.orders.placedOn")}:
                      </span>{" "}
                      {formatDate(locale, order.createdAt)}
                    </p>
                    <p>
                      <span className="text-neutral-400 dark:text-neutral-500">
                        {t("account.orders.lastUpdate")}:
                      </span>{" "}
                      {formatDate(locale, order.updatedAt)}
                    </p>
                    <p>
                      <span className="text-neutral-400 dark:text-neutral-500">
                        {t("account.orders.itemsLabel")}:
                      </span>{" "}
                      {itemCountLabel}
                    </p>
                    <p>
                      <span className="text-neutral-400 dark:text-neutral-500">
                        {t("account.orders.customerEmail")}:
                      </span>{" "}
                      {order.customerEmail || t("account.orders.notAvailable")}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-white px-5 py-4 text-right dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                    {t("account.orders.totalLabel")}
                  </p>
                  <p className="mt-2 text-2xl font-medium text-black dark:text-white">
                    {formatCurrency(
                      locale,
                      order.totalAmount.amount,
                      order.totalAmount.currencyCode,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center"
                  >
                    <div className="relative h-24 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white sm:w-24 dark:border-neutral-800 dark:bg-black">
                      <Image
                        src={item.product.featuredImage.url}
                        alt={item.product.featuredImage.altText}
                        fill
                        sizes="96px"
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-medium text-black dark:text-white">
                        {item.product.title}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {order.customerName ? (
                          <span>
                            {t("account.orders.customerName")}:{" "}
                            {order.customerName}
                          </span>
                        ) : null}
                        <span>
                          {t("account.orders.quantityLabel", {
                            quantity: item.quantity,
                          })}
                        </span>
                        <span>
                          {t("account.orders.unitPriceLabel")}:{" "}
                          {formatCurrency(
                            locale,
                            item.unitPrice.amount,
                            item.unitPrice.currencyCode,
                          )}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {item.product.handle ? (
                          <Link
                            href={`/product/${item.product.handle}`}
                            className="text-sm font-medium text-black underline underline-offset-4 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
                          >
                            {t("account.orders.viewProduct")}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-black dark:text-white sm:text-right">
                      {formatCurrency(
                        locale,
                        item.lineTotal.amount,
                        item.lineTotal.currencyCode,
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 md:flex-row md:flex-wrap md:items-center md:justify-between">
                <div className="grid gap-1">
                  <p>
                    <span className="text-neutral-400 dark:text-neutral-500">
                      {t("account.orders.gateway")}:
                    </span>{" "}
                    {order.latestPayment?.gateway === "mercado_pago"
                      ? "Mercado Pago"
                      : order.latestPayment?.gateway ||
                        t("account.orders.notAvailable")}
                  </p>
                  <p>
                    <span className="text-neutral-400 dark:text-neutral-500">
                      {t("account.orders.paymentReference")}:
                    </span>{" "}
                    {order.latestPayment?.gatewayPaymentId ||
                      order.mercadoPagoPaymentId ||
                      t("account.orders.notAvailable")}
                  </p>
                </div>

                {order.checkoutUrl &&
                ["pending", "pending_payment", "authorized"].includes(
                  order.status,
                ) ? (
                  <Link
                    href={order.checkoutUrl}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-200 bg-white px-5 text-sm font-medium text-black transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
                  >
                    {t("account.orders.continuePayment")}
                  </Link>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
