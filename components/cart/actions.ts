"use server";

import { TAGS } from "lib/constants";
import { getTranslations } from "lib/i18n/server";
import {
  addToCart,
  createMercadoPagoCheckout,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/shopify";
import { createClient } from "lib/supabase/server";
import { updateTag } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

function getCheckoutLoginRedirect(referer: string | null, message: string) {
  const fallbackPath = "/";

  if (!referer) {
    return `/login?message=${encodeURIComponent(message)}&next=%2F`;
  }

  try {
    const refererUrl = new URL(referer);
    const nextPath = `${refererUrl.pathname}${refererUrl.search}`;
    const params = new URLSearchParams({
      message,
      next: nextPath || fallbackPath,
    });

    return `/login?${params.toString()}`;
  } catch {
    return `/login?message=${encodeURIComponent(message)}&next=%2F`;
  }
}

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
) {
  const { t } = await getTranslations();

  if (!selectedVariantId) {
    return t("cart.errors.add");
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    updateTag(TAGS.cart);
  } catch (e) {
    return t("cart.errors.add");
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  const { t } = await getTranslations();

  try {
    const cart = await getCart();

    if (!cart) {
      return t("cart.errors.fetch");
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      updateTag(TAGS.cart);
    } else {
      return t("cart.errors.itemNotFound");
    }
  } catch (e) {
    return t("cart.errors.remove");
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  const { t } = await getTranslations();
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return t("cart.errors.fetch");
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    updateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return t("cart.errors.update");
  }
}

export async function redirectToCheckout() {
  const { t } = await getTranslations();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      getCheckoutLoginRedirect(
        (await headers()).get("referer"),
        t("auth.validation.continueCheckout"),
      ),
    );
  }

  const cart = await getCart();

  if (!cart || cart.lines.length === 0) {
    redirect("/search");
  }

  const checkout = await createMercadoPagoCheckout(cart);
  redirect(checkout.url);
}

export async function createCartAndSetCookie() {
  const cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
