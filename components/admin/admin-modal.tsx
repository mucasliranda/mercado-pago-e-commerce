"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function AdminModal({
  title,
  description,
  closeHref,
  closeLabel,
  children,
}: {
  title: string;
  description?: string;
  closeHref: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.push(closeHref);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeHref, router]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm md:px-6"
      onClick={() => router.push(closeHref)}
    >
      <div
        className="relative w-full max-w-3xl rounded-[2rem] border border-neutral-200 bg-white shadow-[0_30px_90px_-30px_rgba(0,0,0,0.35)] dark:border-neutral-800 dark:bg-neutral-950"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-6 py-5 dark:border-neutral-800 md:px-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-medium text-black dark:text-white">
              {title}
            </h2>
            {description ? (
              <p className="max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => router.push(closeHref)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:text-black dark:border-neutral-700 dark:bg-black dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white"
            aria-label={closeLabel}
            title={closeLabel}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6 md:px-8">{children}</div>
      </div>
    </div>
  );
}
