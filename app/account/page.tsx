import Link from "next/link";
import { signOut } from "app/auth/actions";
import { createClient } from "lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Minha conta",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Entre+para+acessar+sua+conta.");
  }

  const joinedAt = user.created_at
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(user.created_at))
    : null;

  return (
    <div className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-6xl px-4 py-10 md:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
          <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
            Minha conta
          </span>
          <div className="mt-6 space-y-3">
            <h1 className="text-4xl font-medium tracking-tight text-black dark:text-white">
              Conta pronta para a proxima etapa da loja.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              O fluxo de autenticacao ja esta ativo com Supabase Auth. Agora
              voce pode evoluir pedidos, historico e dados de perfil sem
              bloquear checkout guest.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                Email
              </p>
              <p className="mt-3 text-lg font-medium text-black dark:text-white">
                {user.email}
              </p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                Conta criada
              </p>
              <p className="mt-3 text-lg font-medium text-black dark:text-white">
                {joinedAt || "Agora mesmo"}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
            <h2 className="text-2xl font-medium text-black dark:text-white">
              Proximos modulos
            </h2>
            <div className="mt-5 grid gap-3 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                Historico de pedidos autenticados
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                Enderecos favoritos e dados de entrega
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                Preferencias de perfil e comunicacao
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
            <div className="flex flex-col gap-3">
              <Link
                href="/search"
                className="inline-flex h-12 items-center justify-center rounded-full border border-neutral-200 bg-white px-6 text-sm font-medium text-black transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
              >
                Voltar para o catalogo
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                  Sair da conta
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
