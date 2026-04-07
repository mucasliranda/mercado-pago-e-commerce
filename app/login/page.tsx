import { login } from "app/auth/actions";
import {
  AuthField,
  AuthFooterLink,
  AuthMessage,
  AuthShell,
} from "components/auth/auth-shell";
import { SubmitButton } from "components/auth/submit-button";
import { getTranslations } from "lib/i18n/server";
import { createClient } from "lib/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("auth.login.metadataTitle") };
}

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
  const { t } = await getTranslations();

  if (user) {
    redirect(next || "/");
  }

  return (
    <AuthShell
      eyebrow={t("auth.login.eyebrow")}
      title={t("auth.login.title")}
      description={t("auth.login.description")}
      footer={
        <AuthFooterLink
          href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
          label={t("auth.login.noAccount")}
          action={t("auth.login.createNow")}
        />
      }
    >
      <form action={login} className="space-y-5">
        <input type="hidden" name="next" value={next || ""} />
        <div className="space-y-1">
          <h2 className="text-2xl font-medium text-black dark:text-white">
            {t("auth.login.heading")}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("auth.login.subtitle")}
          </p>
        </div>
        <AuthMessage message={message} />
        <div className="grid gap-4">
          <AuthField
            label={t("common.labels.email")}
            name="email"
            type="email"
            placeholder={t("auth.login.emailPlaceholder")}
          />
          <AuthField
            label={t("common.labels.password")}
            name="password"
            type="password"
            placeholder={t("auth.login.passwordPlaceholder")}
          />
        </div>
        <SubmitButton
          idleLabel={t("auth.login.submit")}
          pendingLabel={t("auth.login.pending")}
        />
      </form>
    </AuthShell>
  );
}
