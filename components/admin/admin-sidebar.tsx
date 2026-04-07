"use client";

import {
  CubeIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "components/i18n-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationIcons = {
  "/admin/products": CubeIcon,
  "/admin/users": UsersIcon,
  "/admin/orders": ShoppingBagIcon,
} as const;

export function AdminSidebar({
  currentUserEmail,
  currentRole,
}: {
  currentUserEmail?: string | null;
  currentRole: string;
}) {
  const pathname = usePathname();
  const { t } = useTranslations();

  const items: Array<{
    href: keyof typeof navigationIcons;
    label: string;
    description: string;
  }> = [
    {
      href: "/admin/products",
      label: t("admin.navigation.products"),
      description: t("admin.navigation.productsDescription"),
    },
    {
      href: "/admin/users",
      label: t("admin.navigation.users"),
      description: t("admin.navigation.usersDescription"),
    },
    {
      href: "/admin/orders",
      label: t("admin.navigation.orders"),
      description: t("admin.navigation.ordersDescription"),
    },
  ];

  return (
    <aside className="rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
      <div className="space-y-6">
        <div className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-600 dark:border-neutral-700 dark:bg-black dark:text-neutral-300">
            {t("admin.badge")}
          </span>
          <h2 className="mt-4 text-2xl font-medium tracking-tight text-black dark:text-white">
            {t("admin.sidebar.title")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            {t("admin.sidebar.description")}
          </p>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = navigationIcons[item.href];
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-start gap-4 rounded-[1.5rem] border px-4 py-4 transition ${
                  isActive
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-neutral-200 bg-white text-black hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-white dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                    isActive
                      ? "bg-white/10 dark:bg-black/10"
                      : "bg-neutral-100 dark:bg-neutral-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">
                    {item.label}
                  </span>
                  <span
                    className={`mt-1 block text-sm leading-5 ${
                      isActive
                        ? "text-white/75 dark:text-black/70"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.summary.currentAccess")}
          </p>
          <p className="mt-3 text-lg font-medium text-black dark:text-white">
            {currentRole}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.summary.currentUser")}
          </p>
          <p className="mt-3 truncate text-sm font-medium text-black dark:text-white">
            {currentUserEmail || t("account.orders.notAvailable")}
          </p>
        </div>
      </div>
    </aside>
  );
}
