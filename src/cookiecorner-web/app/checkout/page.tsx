import { CheckoutPageClient } from "../_components/checkout-page-client";
import styles from "../_components/page-section.module.css";

export default function CheckoutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Checkout</span>
        <h1>Finish the bakery order.</h1>
        <p>
          Add delivery details, review the basket, and place the CookieCorner
          order through HyggeFrame.
        </p>
      </section>

      <CheckoutPageClient />
    </div>
  );
}
