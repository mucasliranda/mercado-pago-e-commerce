import { persistMercadoPagoWebhook } from "lib/shopify";
import { NextRequest, NextResponse } from "next/server";

async function parseMercadoPagoWebhook(req: NextRequest) {
  const queryPayload = Object.fromEntries(req.nextUrl.searchParams.entries());
  const rawBody = await req.text();

  console.log("queryPayload", queryPayload);
  console.log("rawBody", rawBody);

  if (!rawBody.trim()) {
    return normalizeMercadoPagoWebhookPayload(queryPayload);
  }

  try {
    const body = JSON.parse(rawBody) as Record<string, unknown>;
    return normalizeMercadoPagoWebhookPayload({
      ...queryPayload,
      ...body,
    });
  } catch {
    return normalizeMercadoPagoWebhookPayload({
      ...queryPayload,
      raw_body: rawBody,
    });
  }
}

function normalizeMercadoPagoWebhookPayload(payload: Record<string, unknown>) {
  const normalizedPayload = { ...payload };
  const queryPaymentId =
    reqString(payload["data.id"]) ||
    reqString(payload.id) ||
    reqString(payload.payment_id) ||
    reqString(payload.collection_id);

  if (queryPaymentId && !normalizedPayload.data) {
    normalizedPayload.data = { id: queryPaymentId };
  }

  return normalizedPayload;
}

function reqString(value: unknown) {
  return typeof value === "string" && value.length ? value : null;
}

async function handleWebhook(req: NextRequest) {
  try {
    const payload = await parseMercadoPagoWebhook(req);
    await persistMercadoPagoWebhook(payload);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Mercado Pago webhook error", error);
    return NextResponse.json({ received: false }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return handleWebhook(req);
}

export async function GET(req: NextRequest) {
  return handleWebhook(req);
}
