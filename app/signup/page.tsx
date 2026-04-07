import { signup } from "app/auth/actions";
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
  return { title: t("auth.signup.metadataTitle") };
}

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
  const { t } = await getTranslations();

  if (user) {
    redirect(next || "/");
  }

  return (
    <AuthShell
      eyebrow={t("auth.signup.eyebrow")}
      title={t("auth.signup.title")}
      description={t("auth.signup.description")}
      footer={
        <AuthFooterLink
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          label={t("auth.signup.hasAccount")}
          action={t("auth.signup.loginAction")}
        />
      }
    >
      <form action={signup} className="space-y-5">
        <input type="hidden" name="next" value={next || ""} />
        <div className="space-y-1">
          <h2 className="text-2xl font-medium text-black dark:text-white">
            {t("auth.signup.heading")}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("auth.signup.subtitle")}
          </p>
        </div>
        <AuthMessage message={message} />
        <div className="grid gap-4">
          <AuthField
            label={t("common.labels.email")}
            name="email"
            type="email"
            placeholder={t("auth.signup.emailPlaceholder")}
          />
          <AuthField
            label={t("common.labels.password")}
            name="password"
            type="password"
            placeholder={t("auth.signup.passwordPlaceholder")}
          />
          <AuthField
            label={t("common.labels.confirmPassword")}
            name="confirmPassword"
            type="password"
            placeholder={t("auth.signup.confirmPasswordPlaceholder")}
          />
        </div>
        <SubmitButton
          idleLabel={t("auth.signup.submit")}
          pendingLabel={t("auth.signup.pending")}
        />
      </form>
    </AuthShell>
  );
}
