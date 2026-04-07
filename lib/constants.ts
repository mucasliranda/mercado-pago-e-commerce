import {
  createTranslator,
  defaultLocale,
  type Locale,
} from "lib/i18n";

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export function getDefaultSort(locale: Locale = defaultLocale): SortFilterItem {
  const { t } = createTranslator(locale);

  return {
    title: t("search.sorting.relevance"),
    slug: null,
    sortKey: "RELEVANCE",
    reverse: false,
  };
}

export function getSorting(locale: Locale = defaultLocale): SortFilterItem[] {
  const { t } = createTranslator(locale);

  return [
    getDefaultSort(locale),
    {
      title: t("search.sorting.trending"),
      slug: "trending-desc",
      sortKey: "BEST_SELLING",
      reverse: false,
    },
    {
      title: t("search.sorting.latest"),
      slug: "latest-desc",
      sortKey: "CREATED_AT",
      reverse: true,
    },
    {
      title: t("search.sorting.priceLowToHigh"),
      slug: "price-asc",
      sortKey: "PRICE",
      reverse: false,
    },
    {
      title: t("search.sorting.priceHighToLow"),
      slug: "price-desc",
      sortKey: "PRICE",
      reverse: true,
    },
  ];
}

export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
