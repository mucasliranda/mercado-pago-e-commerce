import { persistMercadoPagoWebhook } from "lib/shopify";
import { getTranslations } from "lib/i18n/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CheckoutStatusPage(props: {
  params: Promise<{ status: string }>;
  searchParams?: Promise<{
    external_reference?: string;
    payment_id?: string;
    collection_id?: string;
    status?: string;
    collection_status?: string;
  }>;
}) {
  const { t } = await getTranslations();
  const contentByStatus = {
    success: {
      title: t("checkout.success.title"),
      description: t("checkout.success.description"),
    },
    pending: {
      title: t("checkout.pending.title"),
      description: t("checkout.pending.description"),
    },
    failure: {
      title: t("checkout.failure.title"),
      description: t("checkout.failure.description"),
    },
  } as const;
  const params = await props.params;
  const searchParams = await props.searchParams;
  const content =
    contentByStatus[params.status as keyof typeof contentByStatus];

  if (!content) {
    notFound();
  }

  const paymentId =
    searchParams?.payment_id || searchParams?.collection_id || undefined;
  const paymentStatus =
    searchParams?.status || searchParams?.collection_status || undefined;

  if (searchParams?.external_reference || paymentId) {
    try {
      await persistMercadoPagoWebhook({
        external_reference: searchParams?.external_reference,
        payment_id: paymentId,
        status: paymentStatus,
      });
    } catch (error) {
      console.error("Mercado Pago checkout return sync error", error);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-6 px-4 py-16">
      <div className="rounded-full border border-neutral-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        {t("common.labels.checkout")}
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold">{content.title}</h1>
        <p className="text-base text-neutral-600 dark:text-neutral-300">
          {content.description}
        </p>
        {searchParams?.external_reference ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("checkout.orderNumber", {
              externalReference: searchParams.external_reference,
            })}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/search"
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white"
        >
          {t("common.actions.backToCatalog")}
        </Link>
        <Link
          href="/"
          className="rounded-full border border-neutral-200 px-5 py-3 text-sm font-medium dark:border-neutral-800"
        >
          {t("common.actions.goHome")}
        </Link>
      </div>
    </div>
  );
}
