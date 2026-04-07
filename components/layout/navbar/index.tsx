import { AuthNav } from "components/auth/auth-nav";
import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import { getTranslations } from "lib/i18n/server";
import { getMenu } from "lib/shopify";
import { Menu } from "lib/shopify/types";
import { createClient } from "lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import { LanguageSwitcher } from "./language-switcher";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const { SITE_NAME } = process.env;

export async function Navbar() {
  const { locale, t } = await getTranslations();
  const [menu, supabase] = await Promise.all([
    getMenu("next-js-frontend-header-menu", locale),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const authMenu = [
    ...menu,
    ...(user
      ? [{ title: t("common.actions.myAccount"), path: "/account" }]
      : [
          { title: t("common.actions.login"), path: "/login" },
          { title: t("common.actions.signup"), path: "/signup" },
        ]),
  ];

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={authMenu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex items-center justify-end gap-3 md:w-1/3">
          <LanguageSwitcher />
          <AuthNav userEmail={user?.email} />
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
