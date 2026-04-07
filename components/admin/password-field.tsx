"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function PasswordField({
  label,
  name,
  placeholder,
  showLabel,
  hideLabel,
}: {
  label: string;
  name: string;
  placeholder: string;
  showLabel: string;
  hideLabel: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="grid gap-2 text-sm text-neutral-700 dark:text-neutral-200">
      <span className="font-medium">{label}</span>
      <div className="relative">
        <input
          name={name}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          required
          className="h-12 w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 pr-14 text-sm text-black placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-neutral-600 dark:focus:bg-neutral-900"
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-neutral-300 hover:text-black dark:border-neutral-700 dark:bg-black dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-white"
          aria-label={isVisible ? hideLabel : showLabel}
          title={isVisible ? hideLabel : showLabel}
        >
          {isVisible ? (
            <EyeSlashIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </label>
  );
}
