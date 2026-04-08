import {
  createAdminUser,
  deactivateAdminUser,
  deleteAdminUser,
  reactivateAdminUser,
} from "app/admin/actions";
import { AdminModal } from "components/admin/admin-modal";
import { ConfirmSubmitButton } from "components/admin/confirm-submit-button";
import { MessageBanner } from "components/admin/message-banner";
import { PasswordField } from "components/admin/password-field";
import { SubmitButton } from "components/auth/submit-button";
import { getAdminUsers, getCurrentAdminContext } from "lib/admin";
import { getTranslations } from "lib/i18n/server";
import Link from "next/link";

type MessageTone = "error" | "success";

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2 text-sm text-neutral-700 dark:text-neutral-200">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-black placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:bg-neutral-900"
      />
    </label>
  );
}

function getRoleBadgeClasses(role: string) {
  switch (role) {
    case "super_admin":
      return "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black";
    case "admin":
      return "border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-100";
    default:
      return "border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300";
  }
}

function getAccountStateBadgeClasses(isDisabled: boolean) {
  return isDisabled
    ? "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100"
    : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100";
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    message?: string;
    tone?: MessageTone;
    create?: string;
  }>;
}) {
  const [
    { message, tone, create },
    { locale, t },
    { user, isSuperAdmin },
    adminUsers,
  ] = await Promise.all([
    searchParams,
    getTranslations(),
    getCurrentAdminContext(),
    getAdminUsers(),
  ]);

  const createOpen = create === "1";
  const effectiveTone = tone === "success" ? "success" : "error";
  const totalUsers = adminUsers.length;
  const internalUsers = adminUsers.filter((adminUser) =>
    ["admin", "super_admin"].includes(adminUser.role),
  ).length;
  const customerUsers = adminUsers.filter(
    (adminUser) => adminUser.role === "customer",
  ).length;
  const recentUsers = adminUsers.filter((adminUser) => {
    if (!adminUser.lastSignInAt) {
      return false;
    }

    return Date.now() - new Date(adminUser.lastSignInAt).getTime() <=
      1000 * 60 * 60 * 24 * 30;
  }).length;
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.users.metrics.totalUsers")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {totalUsers}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.users.metrics.internalAccess")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {internalUsers}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.users.metrics.customers")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {customerUsers}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-6 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
            {t("admin.users.metrics.recentActivity")}
          </p>
          <p className="mt-3 text-3xl font-medium text-black dark:text-white">
            {recentUsers}
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium text-black dark:text-white">
              {t("admin.users.listTitle")}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {t("admin.users.listDescription")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {message && !createOpen ? (
              <div className="lg:min-w-[320px]">
                <MessageBanner message={message} tone={effectiveTone} />
              </div>
            ) : null}

            {isSuperAdmin ? (
              <Link
                href="/admin/users?create=1"
                className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                {t("admin.users.actions.create")}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {adminUsers.length ? (
            adminUsers.map((adminUser) => {
              const initials =
                adminUser.fullName
                  ?.split(" ")
                  .map((part) => part[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() ||
                adminUser.email?.slice(0, 2).toUpperCase() ||
                "US";

              return (
                <article
                  key={adminUser.id}
                  className="rounded-[1.75rem] border border-neutral-200 bg-neutral-50 p-5 transition hover:border-neutral-300 hover:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-950"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-sm font-medium text-black dark:border-neutral-700 dark:bg-black dark:text-white">
                        {initials}
                      </div>
                      <div className="min-w-0 space-y-2">
                        <div>
                          <h3 className="truncate text-lg font-medium text-black dark:text-white">
                            {adminUser.fullName || t("admin.users.noNameAvailable")}
                          </h3>
                          <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                            {adminUser.email || t("account.orders.notAvailable")}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getRoleBadgeClasses(
                              adminUser.role,
                            )}`}
                          >
                            {t(`admin.roles.${adminUser.role}`)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 text-sm text-neutral-600 sm:grid-cols-2 lg:min-w-[320px] dark:text-neutral-300">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                          {t("admin.users.fields.createdAt")}
                        </p>
                        <p className="mt-2 font-medium text-black dark:text-white">
                          {adminUser.createdAt
                            ? dateFormatter.format(new Date(adminUser.createdAt))
                            : t("account.orders.notAvailable")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
                          {t("admin.users.fields.lastSignIn")}
                        </p>
                        <p className="mt-2 font-medium text-black dark:text-white">
                          {adminUser.lastSignInAt
                            ? dateFormatter.format(
                                new Date(adminUser.lastSignInAt),
                              )
                            : t("admin.users.noRecentAccess")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getAccountStateBadgeClasses(
                        adminUser.isDisabled,
                      )}`}
                    >
                      {adminUser.isDisabled
                        ? t("admin.users.accountState.disabled")
                        : t("admin.users.accountState.active")}
                    </span>

                    {isSuperAdmin &&
                    adminUser.role === "admin" &&
                    adminUser.id !== user?.id ? (
                      <div className="ml-auto flex flex-wrap gap-2">
                        <form action={deactivateAdminUser}>
                          <input type="hidden" name="userId" value={adminUser.id} />
                          <button
                            type="submit"
                            disabled={adminUser.isDisabled}
                            className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-black transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
                          >
                            {t("admin.userManagement.actions.deactivate")}
                          </button>
                        </form>

                        <form action={reactivateAdminUser}>
                          <input type="hidden" name="userId" value={adminUser.id} />
                          <button
                            type="submit"
                            disabled={!adminUser.isDisabled}
                            className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-black transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:border-neutral-600 dark:hover:bg-neutral-900"
                          >
                            {t("admin.userManagement.actions.reactivate")}
                          </button>
                        </form>

                        <form action={deleteAdminUser}>
                          <input type="hidden" name="userId" value={adminUser.id} />
                          <ConfirmSubmitButton
                            confirmMessage={t(
                              "admin.userManagement.confirmDelete",
                              {
                                email:
                                  adminUser.email ||
                                  t("account.orders.notAvailable"),
                              },
                            )}
                            label={t("admin.userManagement.actions.delete")}
                            className="inline-flex h-10 items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-900 transition hover:border-red-300 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-100 dark:hover:border-red-900 dark:hover:bg-red-950/60"
                          />
                        </form>
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-neutral-300 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/80">
              <h3 className="text-lg font-medium text-black dark:text-white">
                {t("admin.users.emptyTitle")}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {t("admin.users.emptyDescription")}
              </p>
            </div>
          )}
        </div>
      </section>

      {createOpen && isSuperAdmin ? (
        <AdminModal
          title={t("admin.createUser.modalTitle")}
          description={t("admin.createUser.modalDescription")}
          closeHref="/admin/users"
          closeLabel={t("common.actions.close")}
        >
          <div className="space-y-5">
            <MessageBanner message={message} tone={effectiveTone} />

            <form action={createAdminUser} className="space-y-5">
              <div className="grid gap-4">
                <Field
                  label={t("admin.createUser.fields.fullName")}
                  name="fullName"
                  placeholder={t("admin.createUser.placeholders.fullName")}
                />
                <Field
                  label={t("common.labels.email")}
                  name="email"
                  type="email"
                  placeholder={t("admin.createUser.placeholders.email")}
                />
                <PasswordField
                  label={t("common.labels.password")}
                  name="password"
                  placeholder={t("admin.createUser.placeholders.password")}
                  showLabel={t("common.actions.showPassword")}
                  hideLabel={t("common.actions.hidePassword")}
                />
                <label className="grid gap-2 text-sm text-neutral-700 dark:text-neutral-200">
                  <span className="font-medium">
                    {t("admin.createUser.fields.role")}
                  </span>
                  <select
                    name="role"
                    defaultValue="admin"
                    className="h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-black focus:border-neutral-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:border-neutral-600 dark:focus:bg-neutral-900"
                  >
                    <option value="admin">{t("admin.roles.admin")}</option>
                    <option value="super_admin">
                      {t("admin.roles.super_admin")}
                    </option>
                  </select>
                </label>
              </div>

              <SubmitButton
                idleLabel={t("admin.createUser.submit")}
                pendingLabel={t("admin.createUser.pending")}
              />
            </form>
          </div>
        </AdminModal>
      ) : null}
    </div>
  );
}
