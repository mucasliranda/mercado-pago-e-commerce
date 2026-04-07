"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useTransition,
} from "react";
import {
  createTranslator,
  localeCookieName,
  locales,
  type Messages,
  defaultLocale,
  type Locale,
} from "lib/i18n";
import { useRouter } from "next/navigation";

type I18nValue = ReturnType<typeof createTranslator> & {
  isPending: boolean;
  locales: readonly Locale[];
  setLocale: (nextLocale: Locale) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  children,
  locale,
  messages,
}: {
  children: ReactNode;
  locale: Locale;
  messages: Messages;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const value = useMemo(() => {
    const translator = createTranslator(locale, messages);

    return {
      ...translator,
      isPending,
      locales,
      setLocale: (nextLocale: Locale) => {
        document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;

        startTransition(() => {
          router.refresh();
        });
      },
    };
  }, [isPending, locale, messages, router]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslations() {
  const context = useContext(I18nContext);

  if (context) {
    return context;
  }

  return {
    ...createTranslator(defaultLocale),
    isPending: false,
    locales,
    setLocale: () => {},
  };
}
