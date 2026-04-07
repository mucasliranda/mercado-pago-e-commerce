import "server-only";

import type { Cart } from "lib/shopify/types";
import { baseUrl } from "lib/utils";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

function normalizeEnvValue(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function getPublicSiteUrl(siteUrl: string) {
  try {
    const parsedUrl = new URL(siteUrl);
    const hostname = parsedUrl.hostname.toLowerCase();
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.endsWith(".local");

    if (isLocalhost) {
      return null;
    }

    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

function resolveMercadoPagoPublicUrl() {
  const explicitPublicUrl = normalizeEnvValue(
    process.env.MERCADO_PAGO_PUBLIC_BASE_URL,
  );

  if (explicitPublicUrl) {
    return getPublicSiteUrl(explicitPublicUrl);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || baseUrl;
  return getPublicSiteUrl(siteUrl);
}

function getMercadoPagoClient() {
  if (!accessToken) {
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN is not set");
  }

  return new MercadoPagoConfig({
    accessToken,
    options: {
      timeout: 5000,
    },
  });
}

export async function getMercadoPagoPayment(paymentId: string | number) {
  const payment = new Payment(getMercadoPagoClient());
  return payment.get({
    id: paymentId,
  });
}

export async function createCheckoutPreference({
  cart,
  externalReference,
  payer,
  titlePrefix,
}: {
  cart: Cart;
  externalReference: string;
  payer?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
  titlePrefix?: string;
}): Promise<{ id: string; init_point: string }> {
  const preference = new Preference(getMercadoPagoClient());
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || baseUrl;
  const publicSiteUrl = resolveMercadoPagoPublicUrl();
  const notificationUrl =
    process.env.MERCADO_PAGO_NOTIFICATION_URL ||
    (publicSiteUrl
      ? `${publicSiteUrl}/api/mercado-pago/webhook`
      : `${siteUrl}/api/mercado-pago/webhook`);

  const response = await preference.create({
    body: {
      external_reference: externalReference,
      statement_descriptor: titlePrefix?.slice(0, 13),
      notification_url: notificationUrl,
      ...(publicSiteUrl
        ? {
            back_urls: {
              success: `${publicSiteUrl}/checkout/success`,
              pending: `${publicSiteUrl}/checkout/pending`,
              failure: `${publicSiteUrl}/checkout/failure`,
            },
            auto_return: "approved" as const,
          }
        : {}),
      // payer,
      items: cart.lines.map((line) => ({
        id: line.merchandise.id,
        title: [titlePrefix, line.merchandise.product.title]
          .filter(Boolean)
          .join(" - ")
          .slice(0, 255),
        description: line.merchandise.product.description?.slice(0, 255),
        quantity: line.quantity,
        currency_id: line.cost.totalAmount.currencyCode,
        unit_price:
          Number(line.cost.totalAmount.amount) / Math.max(line.quantity, 1),
      })),
    },
  });

  if (!response.init_point) {
    throw new Error("Mercado Pago did not return init_point");
  }

  return {
    id: response.id!,
    init_point: response.init_point,
  };
}
