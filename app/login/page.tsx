import { login } from "app/auth/actions";
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
  title: "Entrar",
};

export default async function LoginPage({
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
      eyebrow="Login"
      title="Entre para salvar sua jornada de compra."
      description="Use email e senha para acessar sua conta, revisar seu perfil e deixar o fluxo da loja pronto para os proximos passos."
      footer={
        <AuthFooterLink
          href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
          label="Ainda nao tem conta?"
          action="Criar agora"
        />
      }
    >
      <form action={login} className="space-y-5">
        <input type="hidden" name="next" value={next || ""} />
        <div className="space-y-1">
          <h2 className="text-2xl font-medium text-black dark:text-white">
            Bem-vindo de volta
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Acesse com as mesmas credenciais que voce vai usar para acompanhar
            sua conta.
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
            placeholder="Sua senha"
          />
        </div>
        <SubmitButton idleLabel="Entrar" pendingLabel="Entrando..." />
      </form>
    </AuthShell>
  );
}
