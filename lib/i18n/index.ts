import { en } from "./messages/en";
import { ptBR, type PtBRMessages } from "./messages/pt-br";

export const defaultLocale = "pt-BR" as const;
export const locales = [defaultLocale, "en"] as const;
export const localeCookieName = "locale";

export const dictionaries = {
  "pt-BR": ptBR,
  en,
} as const;

export type Locale = keyof typeof dictionaries;
type DeepMessageShape<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends Record<string, unknown>
      ? DeepMessageShape<T[K]>
      : T[K];
};

export type Messages = DeepMessageShape<PtBRMessages>;

type TranslationValues = Record<string, string | number | undefined | null>;

function resolveMessage(messages: Messages, key: string) {
  return key.split(".").reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[part];
  }, messages);
}

function interpolate(message: string, values?: TranslationValues) {
  if (!values) {
    return message;
  }

  return message.replace(/\{\{(\w+)\}\}/g, (_, token: string) => {
    const value = values[token];
    return value === undefined || value === null ? "" : String(value);
  });
}

export function isLocale(value: string): value is Locale {
  return value in dictionaries;
}

export function normalizeLocale(value?: string | null): Locale | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "pt" || normalized === "pt-br" || normalized.startsWith("pt-")) {
    return "pt-BR";
  }

  if (normalized === "en" || normalized.startsWith("en-")) {
    return "en";
  }

  return null;
}

export function resolveLocaleFromHeader(header?: string | null): Locale {
  if (!header) {
    return defaultLocale;
  }

  const tokens = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim())
    .filter(Boolean) as string[];

  for (const token of tokens) {
    const locale = normalizeLocale(token);

    if (locale) {
      return locale;
    }
  }

  return defaultLocale;
}

export function getMessages(locale: Locale = defaultLocale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}

export function createTranslator(
  locale: Locale = defaultLocale,
  messages: Messages = getMessages(locale),
) {
  return {
    locale,
    messages,
    t: (key: string, values?: TranslationValues) => {
      const value = resolveMessage(messages, key);

      if (typeof value !== "string") {
        return key;
      }

      return interpolate(value, values);
    },
  };
}
