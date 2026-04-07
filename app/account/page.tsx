import { OrderHistory } from "components/account/order-history";
import Link from "next/link";
import { signOut } from "app/auth/actions";
import { getTranslations } from "lib/i18n/server";
import { getAccountOrders } from "lib/shopify";
import { createClient } from "lib/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("account.metadataTitle") };
}

export default async function AccountPage() {
  const { locale, t } = await getTranslations();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?message=${encodeURIComponent(t("auth.validation.accessAccount"))}`,
    );
  }

  const orders = await getAccountOrders(user.id);
  const totalOrders = orders.length;
  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "paid" || order.status === "paid",
  ).length;
  const openOrders = orders.filter((order) =>
    ["pending", "pending_payment", "authorized"].includes(order.status),
  ).length;
  const latestOrderDate = orders[0]?.createdAt
    ? new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(orders[0].createdAt))
    : null;

  const joinedAt = user.created_at
    ? new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(user.created_at))
    : null;

  return (
    <div className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
            <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              {t("account.badge")}
            </span>
            <div className="mt-6 space-y-3">
              <h1 className="text-4xl font-medium tracking-tight text-black dark:text-white">
                {t("account.title")}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {t("account.description")}
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                  {t("account.emailLabel")}
                </p>
                <p className="mt-3 text-lg font-medium text-black dark:text-white">
                  {user.email}
                </p>
              </div>
              <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                  {t("account.createdAtLabel")}
                </p>
                <p className="mt-3 text-lg font-medium text-black dark:text-white">
                  {joinedAt || t("account.createdNow")}
                </p>
              </div>
            </div>
          </section>

          <OrderHistory locale={locale} orders={orders} />
        </div>

        <section className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="text-2xl font-medium text-black dark:text-white">
              {t("account.orders.summaryTitle")}
            </h2>
            <div className="mt-5 grid gap-3 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                  {t("account.orders.summary.total")}
                </p>
                <p className="mt-3 text-3xl font-medium text-black dark:text-white">
                  {totalOrders}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                  {t("account.orders.summary.paid")}
                </p>
                <p className="mt-3 text-3xl font-medium text-black dark:text-white">
                  {paidOrders}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                  {t("account.orders.summary.open")}
                </p>
                <p className="mt-3 text-3xl font-medium text-black dark:text-white">
                  {openOrders}
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                  {t("account.orders.summary.latest")}
                </p>
                <p className="mt-3 text-base font-medium text-black dark:text-white">
                  {latestOrderDate || t("account.orders.notAvailable")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex flex-col gap-3">
              <Link
                href="/search"
                className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-medium text-black transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
              >
                {t("common.actions.backToCatalog")}
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                  {t("common.actions.logout")}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
