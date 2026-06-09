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
    return JSON.parse(rawCart) as CartItem[];
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
  const existingItem = cart.find((item) => item.productId === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      size: product.size,
      color: product.color,
    });
  }

  writeCart(cart);
}

export function updateCartItemQuantity(productId: number, quantity: number) {
  const cart = readCart()
    .map((item) => (item.productId === productId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  writeCart(cart);
}

export function removeCartItem(productId: number) {
  const cart = readCart().filter((item) => item.productId !== productId);
  writeCart(cart);
}

export function clearCart() {
  writeCart([]);
}

export function subscribeToCartUpdates(callback: () => void) {
  window.addEventListener(cartUpdatedEvent, callback);
  return () => window.removeEventListener(cartUpdatedEvent, callback);
}
