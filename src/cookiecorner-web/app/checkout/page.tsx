import { CheckoutPageClient } from "../_components/checkout-page-client";
import styles from "../_components/page-section.module.css";

export default function CheckoutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Checkout</span>
        <h1>Initial checkout structure for the CookieCorner MVP.</h1>
        <p>
          This page outlines the main checkout sections so we can evolve the flow
          incrementally without redesigning the full route structure later.
        </p>
      </section>

      <CheckoutPageClient />
    </div>
  );
}
