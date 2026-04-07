import { signup } from "app/auth/actions";
import {
  AuthField,
  AuthFooterLink,
  AuthMessage,
  AuthShell,
} from "components/auth/auth-shell";
import { SubmitButton } from "components/auth/submit-button";
import { createClient } from "lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Criar conta",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; next?: string }>;
}) {
  const [{ message, next }, supabase] = await Promise.all([
    searchParams,
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(next || "/");
  }

  return (
    <AuthShell
      eyebrow="Cadastro"
      title="Crie sua conta sem sair do ritmo da vitrine."
      description="O cadastro usa email e senha e respeita a mesma linguagem limpa da storefront. Se a confirmacao por email estiver ativa no Supabase, a rota de confirmacao ja esta pronta."
      footer={
        <AuthFooterLink
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          label="Ja possui conta?"
          action="Entrar"
        />
      }
    >
      <form action={signup} className="space-y-5">
        <input type="hidden" name="next" value={next || ""} />
        <div className="space-y-1">
          <h2 className="text-2xl font-medium text-black dark:text-white">
            Abrir nova conta
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Guarde seus dados para futuras compras e personalize a experiencia
            da loja.
          </p>
        </div>
        <AuthMessage message={message} />
        <div className="grid gap-4">
          <AuthField
            label="Email"
            name="email"
            type="email"
            placeholder="voce@aurora.store"
          />
          <AuthField
            label="Senha"
            name="password"
            type="password"
            placeholder="Minimo de 8 caracteres"
          />
          <AuthField
            label="Confirmar senha"
            name="confirmPassword"
            type="password"
            placeholder="Repita a senha"
          />
        </div>
        <SubmitButton idleLabel="Criar conta" pendingLabel="Criando conta..." />
      </form>
    </AuthShell>
  );
}
