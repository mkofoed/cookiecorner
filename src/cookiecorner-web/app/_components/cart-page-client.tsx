"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCartItems, removeCartItem, subscribeToCartUpdates, updateCartItemQuantity } from "./cart-storage";
import { formatDkk } from "./currency";
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
        <p>Add a custom Hyggefis from the cookie lab to begin checkout.</p>
        <Link href="/configurator">Open customizer</Link>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <section className={styles.listPanel}>
        {items.map((item) => (
          <article key={item.cartItemId} className={styles.lineItem}>
            <div>
              <h2>{item.name}</h2>
              <p>
                Size: {item.size ?? "Unknown"} | Color: {item.color ?? "Unknown"}
              </p>
              {item.configurationSummary?.length ? (
                <ul className={styles.list}>
                  {item.configurationSummary.map((summaryLine) => (
                    <li key={summaryLine}>{summaryLine}</li>
                  ))}
                </ul>
              ) : null}
              <p>Unit price: {formatDkk(item.price)}</p>
            </div>

            <div className={styles.lineItemActions}>
              <label className={styles.fieldLabel}>
                Quantity
                <input
                  className={styles.numberInput}
                  max={item.stockQuantity ?? undefined}
                  min={1}
                  onChange={(event) =>
                    updateCartItemQuantity(item.cartItemId, Number(event.target.value))
                  }
                  type="number"
                  value={item.quantity}
                />
              </label>
              <button
                className={styles.secondaryButton}
                onClick={() => removeCartItem(item.cartItemId)}
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
        <p>Total amount: {formatDkk(totalAmount)}</p>
        <Link href="/checkout">Proceed to checkout</Link>
      </section>
    </section>
  );
}
