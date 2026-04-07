import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "components/cart/cart-context";
import { I18nProvider } from "components/i18n-provider";
import { Navbar } from "components/layout/navbar";
import { GeistSans } from "geist/font/sans";
import { getTranslations } from "lib/i18n/server";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { locale, messages } = await getTranslations();
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang={locale} className={GeistSans.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <I18nProvider locale={locale} messages={messages}>
          <CartProvider cartPromise={cart}>
            <Analytics />
            <Navbar />
            <main>
              {children}
              <Toaster closeButton />
            </main>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
