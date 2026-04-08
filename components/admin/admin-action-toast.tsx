"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type Tone = "error" | "success";

export function AdminActionToast({
  message,
  tone,
}: {
  message?: string;
  tone: Tone;
}) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const toastMethod = tone === "success" ? toast.success : toast.error;
    toastMethod(message, {
      id: `admin-action-${tone}`,
    });
  }, [message, tone]);

  return null;
}
