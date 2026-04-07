// import { Carousel } from "components/carousel";
// import { ThreeItemGrid } from "components/grid/three-items";
// import Footer from "components/layout/footer";
import { getTranslations } from "lib/i18n/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();

  return {
    description: t("site.homeDescription"),
    openGraph: {
      type: "website",
    },
  };
}

export default function HomePage() {
  redirect("/search");
  // return (
  //   <>
  //     <ThreeItemGrid />
  //     <Carousel />
  //     <Footer />
  //   </>
  // );
}
