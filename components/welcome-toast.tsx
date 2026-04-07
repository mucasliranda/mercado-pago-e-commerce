"use client";

import { useTranslations } from "components/i18n-provider";
import { useEffect } from "react";
import { toast } from "sonner";

export function WelcomeToast() {
  const { t } = useTranslations();

  useEffect(() => {
    if (window.innerHeight < 650) return;

    if (!document.cookie.includes("welcome-toast=2")) {
      toast(t("welcomeToast.title"), {
        id: "welcome-toast",
        duration: Infinity,
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
        description: (
          <>
            {t("welcomeToast.description")}{" "}
            <a
              href="https://vercel.com/templates/next.js/nextjs-commerce"
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              {t("welcomeToast.cta")}
            </a>
            .
          </>
        ),
      });
    }
  }, [t]);

  return null;
}
