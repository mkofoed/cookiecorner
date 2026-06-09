import { CartPageClient } from "../_components/cart-page-client";
import styles from "../_components/page-section.module.css";

export default function CartPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Cart</span>
        <h1>Initial cart page for selected Hyggefis products.</h1>
        <p>
          This page is the first placeholder for cart state, quantities, price
          totals, and checkout entry.
        </p>
      </section>

      <CartPageClient />
    </div>
  );
}
