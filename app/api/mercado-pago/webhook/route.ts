import { persistMercadoPagoWebhook } from "lib/shopify";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as Record<string, unknown>;
    await persistMercadoPagoWebhook(payload);
  } catch (error) {
    console.error("Mercado Pago webhook error", error);
  }

  return NextResponse.json({ received: true });
}
