"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCartItems, subscribeToCartUpdates } from "./cart-storage";
import styles from "./site-shell.module.css";

export function BasketNavLink() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const syncCartCount = () => {
      const cartItems = getCartItems();
      setItemCount(cartItems.reduce((total, item) => total + item.quantity, 0));
    };

    syncCartCount();
    return subscribeToCartUpdates(syncCartCount);
  }, []);

  const ariaLabel = useMemo(
    () => `Basket with ${itemCount} item${itemCount === 1 ? "" : "s"}`,
    [itemCount],
  );

  return (
    <Link aria-label={ariaLabel} className={styles.navLink} href="/checkout" title={ariaLabel}>
      <span aria-hidden="true" className={styles.navIcon}>
        🧺
      </span>
      <span className={styles.navCount}>{itemCount}</span>
    </Link>
  );
}
