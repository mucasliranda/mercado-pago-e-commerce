"use server";

import { TAGS } from "lib/constants";
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

function getCheckoutLoginRedirect(referer: string | null) {
  const fallbackPath = "/";

  if (!referer) {
    return "/login?message=Entre+para+continuar+com+a+compra.&next=%2F";
  }

  try {
    const refererUrl = new URL(referer);
    const nextPath = `${refererUrl.pathname}${refererUrl.search}`;
    const params = new URLSearchParams({
      message: "Entre para continuar com a compra.",
      next: nextPath || fallbackPath,
    });

    return `/login?${params.toString()}`;
  } catch {
    return "/login?message=Entre+para+continuar+com+a+compra.&next=%2F";
  }
}

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    updateTag(TAGS.cart);
  } catch (e) {
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      updateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
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
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(getCheckoutLoginRedirect((await headers()).get("referer")));
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
