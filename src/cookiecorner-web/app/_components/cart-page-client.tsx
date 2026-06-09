"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCartItems, removeCartItem, subscribeToCartUpdates, updateCartItemQuantity } from "./cart-storage";
import { CartItem } from "./storefront-types";
import styles from "./page-section.module.css";

export function CartPageClient() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const syncCart = () => setItems(getCartItems());

    syncCart();
    return subscribeToCartUpdates(syncCart);
  }, []);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  if (items.length === 0) {
    return (
      <section className={styles.noticeCard}>
        <h2>Your cart is empty</h2>
        <p>Add a Hyggefis from the products page to begin checkout.</p>
        <Link href="/products">Browse products</Link>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <section className={styles.listPanel}>
        {items.map((item) => (
          <article key={item.productId} className={styles.lineItem}>
            <div>
              <h2>{item.name}</h2>
              <p>
                Size: {item.size ?? "Unknown"} | Color: {item.color ?? "Unknown"}
              </p>
              <p>Unit price: {item.price.toFixed(2)}</p>
            </div>

            <div className={styles.lineItemActions}>
              <label className={styles.fieldLabel}>
                Quantity
                <input
                  className={styles.numberInput}
                  min={1}
                  onChange={(event) =>
                    updateCartItemQuantity(item.productId, Number(event.target.value))
                  }
                  type="number"
                  value={item.quantity}
                />
              </label>
              <button
                className={styles.secondaryButton}
                onClick={() => removeCartItem(item.productId)}
                type="button"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.noticeCard}>
        <h2>Order summary</h2>
        <p>Total items: {items.reduce((sum, item) => sum + item.quantity, 0)}</p>
        <p>Total amount: {totalAmount.toFixed(2)}</p>
        <Link href="/checkout">Proceed to checkout</Link>
      </section>
    </section>
  );
}
