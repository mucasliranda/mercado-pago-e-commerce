import "server-only";

import { cookies, headers } from "next/headers";
import {
  createTranslator,
  defaultLocale,
  getMessages,
  localeCookieName,
  normalizeLocale,
  resolveLocaleFromHeader,
  type Locale,
} from ".";

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = normalizeLocale(cookieStore.get(localeCookieName)?.value);

  if (cookieLocale) {
    return cookieLocale;
  }

  const headerStore = await headers();
  return resolveLocaleFromHeader(headerStore.get("accept-language"));
}

export async function getTranslations(locale?: Locale) {
  const resolvedLocale = locale || (await getRequestLocale()) || defaultLocale;
  const messages = getMessages(resolvedLocale);

  return {
    ...createTranslator(resolvedLocale, messages),
    locale: resolvedLocale,
    messages,
  };
}
