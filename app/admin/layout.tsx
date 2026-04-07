import { AdminSidebar } from "components/admin/admin-sidebar";
import { getCurrentAdminContext } from "lib/admin";
import { getTranslations } from "lib/i18n/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [{ t }, { user, profile, isAdmin, isSuperAdmin }] = await Promise.all([
    getTranslations(),
    getCurrentAdminContext(),
  ]);

  if (!user) {
    redirect(
      `/login?message=${encodeURIComponent(t("auth.validation.accessAccount"))}&next=/admin/users`,
    );
  }

  if (!isAdmin) {
    redirect("/account");
  }

  const currentRole = isSuperAdmin
    ? t("admin.roles.super_admin")
    : t("admin.roles.admin");

  return (
    <div className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-7xl px-4 py-10 md:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-24 xl:self-start">
          <AdminSidebar
            currentUserEmail={profile?.email || user.email}
            currentRole={currentRole}
          />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
