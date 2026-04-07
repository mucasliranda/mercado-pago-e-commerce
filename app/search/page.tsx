import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { getTranslations } from "lib/i18n/server";
import { getDefaultSort, getSorting } from "lib/constants";
import { getProducts } from "lib/shopify";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();

  return {
    title: t("search.metadataTitle"),
    description: t("search.metadataDescription"),
  };
}

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, t } = await getTranslations();
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const sorting = getSorting(locale);
  const defaultSort = getDefaultSort(locale);
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText =
    products.length > 1 ? t("search.results") : t("search.result");

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? t("search.noResultsFor", { query: searchValue })
            : t("search.showingResultsFor", {
                count: products.length,
                label: resultsText,
                query: searchValue,
              })}
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
