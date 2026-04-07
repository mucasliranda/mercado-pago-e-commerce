import Link from "next/link";
import { notFound } from "next/navigation";

const contentByStatus = {
  success: {
    title: "Pagamento aprovado",
    description:
      "Seu pedido foi enviado ao Mercado Pago e o retorno indica aprovacao.",
  },
  pending: {
    title: "Pagamento pendente",
    description:
      "O pedido foi criado e agora estamos aguardando a confirmacao do Mercado Pago.",
  },
  failure: {
    title: "Pagamento nao concluido",
    description:
      "O checkout foi interrompido ou recusado. Voce pode revisar o carrinho e tentar novamente.",
  },
} as const;

export default async function CheckoutStatusPage(props: {
  params: Promise<{ status: string }>;
  searchParams?: Promise<{ external_reference?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const content =
    contentByStatus[params.status as keyof typeof contentByStatus];

  if (!content) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-6 px-4 py-16">
      <div className="rounded-full border border-neutral-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        Checkout
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold">{content.title}</h1>
        <p className="text-base text-neutral-600 dark:text-neutral-300">
          {content.description}
        </p>
        {searchParams?.external_reference ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Pedido #{searchParams.external_reference}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/search"
          className="rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white"
        >
          Voltar ao catalogo
        </Link>
        <Link
          href="/"
          className="rounded-full border border-neutral-200 px-5 py-3 text-sm font-medium dark:border-neutral-800"
        >
          Ir para a home
        </Link>
      </div>
    </div>
  );
}
