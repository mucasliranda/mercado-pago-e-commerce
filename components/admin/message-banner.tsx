"use client";

type MessageTone = "error" | "success";

export function MessageBanner({
  message,
  tone,
}: {
  message?: string;
  tone: MessageTone;
}) {
  if (!message) {
    return null;
  }

  const toneClasses =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100"
      : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100";

  return (
    <div className={`rounded-3xl border px-4 py-3 text-sm ${toneClasses}`}>
      {message}
    </div>
  );
}
