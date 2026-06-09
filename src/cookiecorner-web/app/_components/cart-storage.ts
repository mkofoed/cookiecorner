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
      quantity: normalizeQuantity(item.quantity),
      stockQuantity:
        typeof item.stockQuantity === "number" ? item.stockQuantity : null,
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
  const maxQuantityForItem = getRemainingStock(
    cart,
    product.id,
    product.stockQuantity,
    existingItem?.cartItemId,
  );

  if (existingItem && maxQuantityForItem > 0) {
    existingItem.quantity = Math.min(
      normalizeQuantity(existingItem.quantity + 1),
      maxQuantityForItem,
    );
  } else if (maxQuantityForItem > 0) {
    cart.push({
      cartItemId: `${product.id}-${crypto.randomUUID()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: normalizeQuantity(1),
      stockQuantity: product.stockQuantity,
      size: product.size,
      color: product.color,
      configurationSummary: [],
    });
  } else {
    return;
  }

  writeCart(cart);
}

type ConfiguredCartOptions = {
  color: string;
  price: number;
  quantity: number;
  size: string;
};

export function addConfiguredToCart(product: Product, options: ConfiguredCartOptions) {
  const cart = readCart();
  const remainingStock = getRemainingStock(cart, product.id, product.stockQuantity);
  const nextQuantity = Math.min(normalizeQuantity(options.quantity), remainingStock);

  if (nextQuantity <= 0) {
    return;
  }

  cart.push({
    cartItemId: `${product.id}-${crypto.randomUUID()}`,
    productId: product.id,
    name: "Custom Hyggefis",
    price: options.price,
    quantity: nextQuantity,
    stockQuantity: product.stockQuantity,
    size: options.size,
    color: options.color,
    configurationSummary: [
      `Configured size: ${options.size}`,
      `Configured color: ${options.color}`,
      `Quantity: ${nextQuantity}`,
    ],
  });

  writeCart(cart);
}

export function updateCartItemQuantity(cartItemId: string, quantity: number) {
  const cart = readCart();
  const existingItem = cart.find((item) => item.cartItemId === cartItemId);

  if (!existingItem) {
    return;
  }

  const nextQuantity = Math.min(
    normalizeQuantity(quantity),
    getRemainingStock(
      cart,
      existingItem.productId,
      existingItem.stockQuantity ?? Number.MAX_SAFE_INTEGER,
      cartItemId,
    ),
  );

  const updatedCart = cart
    .map((item) =>
      item.cartItemId === cartItemId
        ? { ...item, quantity: nextQuantity }
        : item,
    )
    .filter((item) => item.quantity > 0);

  writeCart(updatedCart);
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

function normalizeQuantity(quantity: number | null | undefined) {
  if (!Number.isFinite(quantity) || quantity === undefined || quantity === null) {
    return 1;
  }

  return Math.max(0, Math.floor(quantity));
}

function getRemainingStock(
  cart: CartItem[],
  productId: number,
  stockQuantity: number,
  excludedCartItemId?: string,
) {
  const reservedQuantity = cart
    .filter(
      (item) =>
        item.productId === productId && item.cartItemId !== excludedCartItemId,
    )
    .reduce((total, item) => total + item.quantity, 0);

  return Math.max(0, stockQuantity - reservedQuantity);
}
