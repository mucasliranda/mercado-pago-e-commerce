import Link from "next/link";

export const metadata = {
  title: "Erro de autenticacao",
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-2xl items-center px-4 py-10 md:px-6">
      <div className="w-full rounded-[2rem] border border-neutral-200 bg-white p-8 text-center shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
        <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
          Auth
        </span>
        <h1 className="mt-5 text-3xl font-medium text-black dark:text-white">
          Nao foi possivel concluir a autenticacao.
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          {message ||
            "Confira se o link ainda e valido e tente novamente a partir da tela de login."}
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
}
