import Link from "next/link";
import { ReactNode } from "react";

export function AuthShell({
  eyebrow,
  title,
  description,
  footer,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-80px)] w-full max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] dark:border-neutral-800 dark:bg-neutral-950">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.18),_transparent_55%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_50%)]" />
        <div className="relative flex h-full flex-col justify-between gap-10">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              {eyebrow}
            </span>
            <div className="space-y-3">
              <h1 className="max-w-xl text-4xl font-medium tracking-tight text-black md:text-5xl dark:text-white">
                {title}
              </h1>
              <p className="max-w-lg text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {description}
              </p>
            </div>
          </div>
          <div className="grid gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
              <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
              Aurora Store Access
              <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center">
        <div className="w-full rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-950">
          {children}
          <div className="mt-8 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            {footer}
          </div>
        </div>
      </section>
    </div>
  );
}

export function AuthField({
  label,
  name,
  type,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm text-neutral-700 dark:text-neutral-200">
      <span className="font-medium">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required
        className="h-12 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-black placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:bg-neutral-900"
      />
    </label>
  );
}

export function AuthMessage({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100">
      {message}
    </div>
  );
}

export function AuthFooterLink({
  href,
  label,
  action,
}: {
  href: string;
  label: string;
  action: string;
}) {
  return (
    <p>
      {label}{" "}
      <Link
        href={href}
        className="font-medium text-black underline underline-offset-4 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-300"
      >
        {action}
      </Link>
    </p>
  );
}
