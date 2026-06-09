import { CheckoutPageClient } from "../_components/checkout-page-client";
import styles from "../_components/page-section.module.css";

export default function CheckoutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Checkout</span>
        <h1>Review and place your order.</h1>
      </section>

      <CheckoutPageClient />
    </div>
  );
}
