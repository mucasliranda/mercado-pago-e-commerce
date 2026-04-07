import Link from "next/link";
import { signOut } from "app/auth/actions";
import { getTranslations } from "lib/i18n/server";

export async function AuthNav({ userEmail }: { userEmail?: string }) {
  const { t } = await getTranslations();

  if (!userEmail) {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <Link
          href="/login"
          className="text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
        >
          {t("common.actions.login")}
        </Link>
        <Link
          href="/signup"
          className="inline-flex h-10 items-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-black transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
        >
          {t("common.actions.signup")}
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-3 md:flex">
      <Link
        href="/account"
        className="text-sm text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
      >
        {userEmail}
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="inline-flex h-10 items-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-black transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
        >
          {t("common.actions.logout")}
        </button>
      </form>
    </div>
  );
}
