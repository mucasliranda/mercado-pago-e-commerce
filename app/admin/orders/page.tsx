import { markOrderAsDelivered } from "app/admin/actions";
import { MessageBanner } from "components/admin/message-banner";
import { getAdminOrders } from "lib/admin";
import { getTranslations } from "lib/i18n/server";
import Link from "next/link";

type MessageTone = "error" | "success";

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
  t: (key: string, values?: Record<string, string | number>) => string,
  type: "order" | "payment",
  status: string,
) {
  const key = `account.orders.status.${type}.${status}`;
  const translated = t(key);

  return translated === key ? formatFallbackStatus(status) : translated;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; tone?: MessageTone }>;
}) {
  const [{ message, tone }, { locale, t }, orders] = await Promise.all([
    searchParams,
    getTranslations(),
    getAdminOrders(),
  ]);

  const effectiveTone = tone === "success" ? "success" : "error";
  const awaitingDelivery = orders.filter(
    (order) => order.status === "paid" && order.paymentStatus === "paid",
  ).length;
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;
  const grossRevenue = orders.reduce(
    (total, order) => total + Number(order.totalAmount.amount),
    0,
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.orders.metrics.totalOrders")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {orders.length}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.orders.metrics.awaitingDelivery")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {awaitingDelivery}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.orders.metrics.delivered")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {deliveredOrders}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.orders.metrics.grossRevenue")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {formatCurrency(locale, grossRevenue.toFixed(2), "BRL")}
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium text-black dark:text-white">
              {t("admin.orders.listTitle")}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {t("admin.orders.listDescription")}
            </p>
          </div>
          <div className="lg:max-w-md">
            <MessageBanner message={message} tone={effectiveTone} />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {orders.length ? (
            orders.map((order) => {
              const canMarkDelivered =
                order.status === "paid" && order.paymentStatus === "paid";

              return (
                <article
                  key={order.id}
                  className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900"
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

                      <div className="grid gap-2 text-sm text-neutral-600 dark:text-neutral-300 md:grid-cols-2 xl:grid-cols-3">
                        <p>
                          <span className="text-neutral-400 dark:text-neutral-500">
                            {t("admin.orders.fields.customer")}:
                          </span>{" "}
                          {order.customerName ||
                            order.customerEmail ||
                            t("account.orders.notAvailable")}
                        </p>
                        <p>
                          <span className="text-neutral-400 dark:text-neutral-500">
                            {t("admin.orders.fields.email")}:
                          </span>{" "}
                          {order.customerEmail || t("account.orders.notAvailable")}
                        </p>
                        <p>
                          <span className="text-neutral-400 dark:text-neutral-500">
                            {t("admin.orders.fields.createdAt")}:
                          </span>{" "}
                          {formatDate(locale, order.createdAt)}
                        </p>
                        <p>
                          <span className="text-neutral-400 dark:text-neutral-500">
                            {t("admin.orders.fields.updatedAt")}:
                          </span>{" "}
                          {formatDate(locale, order.updatedAt)}
                        </p>
                        <p>
                          <span className="text-neutral-400 dark:text-neutral-500">
                            {t("admin.orders.fields.paymentReference")}:
                          </span>{" "}
                          {order.latestPayment?.gatewayPaymentId ||
                            order.mercadoPagoPaymentId ||
                            t("account.orders.notAvailable")}
                        </p>
                        <p>
                          <span className="text-neutral-400 dark:text-neutral-500">
                            {t("admin.orders.fields.items")}:
                          </span>{" "}
                          {order.items.length}
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
                        <div className="flex h-20 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white sm:w-20 dark:border-neutral-700 dark:bg-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.product.featuredImage.url}
                            alt={item.product.featuredImage.altText}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-lg font-medium text-black dark:text-white">
                            {item.product.title}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {item.variantTitle ? (
                              <span>
                                {t("admin.orders.fields.variant")}:{" "}
                                {item.variantTitle}
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
                          {item.product.handle ? (
                            <Link
                              href={`/product/${item.product.handle}`}
                              className="mt-3 inline-flex text-sm font-medium text-black underline underline-offset-4 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
                            >
                              {t("account.orders.viewProduct")}
                            </Link>
                          ) : null}
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

                  <div className="mt-5 flex flex-col gap-3 rounded-3xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 lg:flex-row lg:items-center lg:justify-between">
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
                          {t("admin.orders.fields.latestPaymentStatus")}:
                        </span>{" "}
                        {order.latestPayment
                          ? getLocalizedStatus(
                              t,
                              "payment",
                              order.latestPayment.status,
                            )
                          : t("account.orders.notAvailable")}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
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

                      {canMarkDelivered ? (
                        <form action={markOrderAsDelivered}>
                          <input type="hidden" name="orderId" value={order.id} />
                          <button
                            type="submit"
                            className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                          >
                            {t("admin.orders.actions.markDelivered")}
                          </button>
                        </form>
                      ) : order.status === "delivered" ? (
                        <span className="inline-flex h-11 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 px-5 text-sm font-medium text-cyan-900 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-100">
                          {t("admin.orders.actions.delivered")}
                        </span>
                      ) : (
                        <span className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 px-5 text-sm font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                          {t("admin.orders.actions.waitingPayment")}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/80">
              <h3 className="text-lg font-medium text-black dark:text-white">
                {t("admin.orders.emptyTitle")}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {t("admin.orders.emptyDescription")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
