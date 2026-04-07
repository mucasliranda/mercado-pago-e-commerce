import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "lib/i18n/server";
import { createClient } from "lib/supabase/server";

export async function GET(request: NextRequest) {
  const { t } = await getTranslations();
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = requestUrl.searchParams.get("next") || "/account";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(
    new URL(
      `/auth/error?message=${encodeURIComponent(
        t("auth.error.confirmEmailFailure"),
      )}`,
      request.url,
    ),
  );
}
