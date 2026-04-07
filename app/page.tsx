// import { Carousel } from "components/carousel";
// import { ThreeItemGrid } from "components/grid/three-items";
// import Footer from "components/layout/footer";
import { redirect } from "next/navigation";

export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Supabase, and Mercado Pago.",
  openGraph: {
    type: "website",
  },
};

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
