"use client";

import clsx from "clsx";
import { useTranslations } from "components/i18n-provider";
import type { Locale } from "lib/i18n";

const languageLabels: Record<Locale, string> = {
  "pt-BR": "PT",
  en: "EN",
};

export function LanguageSwitcher() {
  const { isPending, locale, setLocale, t } = useTranslations();

  return (
    <div
      className="inline-flex items-center rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-950"
      aria-label={t("common.labels.language")}
      role="group"
    >
      {(Object.keys(languageLabels) as Locale[]).map((language) => {
        const isActive = locale === language;

        return (
          <button
            key={language}
            type="button"
            onClick={() => setLocale(language)}
            disabled={isPending || isActive}
            title={t(`site.languages.${language}`)}
            className={clsx(
              "rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.18em] transition",
              {
                "bg-black text-white dark:bg-white dark:text-black": isActive,
                "text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white":
                  !isActive,
                "opacity-70": isPending,
              },
            )}
          >
            {languageLabels[language]}
          </button>
        );
      })}
    </div>
  );
}
