"use client";

import { CartItem, Product } from "./storefront-types";

const storageKey = "cookiecorner-cart";
const cartUpdatedEvent = "cookiecorner-cart-updated";

function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawCart = window.localStorage.getItem(storageKey);
  if (!rawCart) {
    return [];
  }

  try {
    return (JSON.parse(rawCart) as Array<Partial<CartItem>>).map((item) => ({
      cartItemId:
        item.cartItemId ??
        `${item.productId ?? "unknown"}-${crypto.randomUUID()}`,
      productId: item.productId ?? 0,
      name: item.name ?? "Unnamed Hyggefis",
      price: item.price ?? 0,
      quantity: item.quantity ?? 1,
      size: item.size ?? null,
      color: item.color ?? null,
      configurationSummary: item.configurationSummary ?? [],
    }));
  } catch {
    return [];
  }
}

function writeCart(cart: CartItem[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(cart));
  window.dispatchEvent(new Event(cartUpdatedEvent));
}

export function getCartItems(): CartItem[] {
  return readCart();
}

export function addToCart(product: Product) {
  const cart = readCart();
  const existingItem = cart.find(
    (item) =>
      item.productId === product.id &&
      (item.configurationSummary?.length ?? 0) === 0,
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      cartItemId: `${product.id}-${crypto.randomUUID()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: product.size,
      color: product.color,
      configurationSummary: [],
    });
  }

  writeCart(cart);
}

type ConfiguredCartOptions = {
  color: string;
  giftWrap: boolean;
  price: number;
  quantity: number;
  size: string;
};

export function addConfiguredToCart(product: Product, options: ConfiguredCartOptions) {
  const cart = readCart();

  cart.push({
    cartItemId: `${product.id}-${crypto.randomUUID()}`,
    productId: product.id,
    name: "Custom Hyggefis",
    price: options.price,
    quantity: options.quantity,
    size: options.size,
    color: options.color,
    configurationSummary: [
      `Configured size: ${options.size}`,
      `Configured color: ${options.color}`,
      `Quantity: ${options.quantity}`,
      `Gift wrap: ${options.giftWrap ? "Yes" : "No"}`,
    ],
  });

  writeCart(cart);
}

export function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const cart = readCart()
    .map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  writeCart(cart);
}

export function removeCartItem(cartItemId: string) {
  const cart = readCart().filter((item) => item.cartItemId !== cartItemId);
  writeCart(cart);
}

export function clearCart() {
  writeCart([]);
}

export function subscribeToCartUpdates(callback: () => void) {
  window.addEventListener(cartUpdatedEvent, callback);
  return () => window.removeEventListener(cartUpdatedEvent, callback);
}
