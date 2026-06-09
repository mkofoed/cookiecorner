import { CartPageClient } from "../_components/cart-page-client";
import styles from "../_components/page-section.module.css";

export default function CartPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Cart</span>
        <h1>Your CookieCorner basket.</h1>
        <p>
          Review the custom Hyggefis creations from the cookie lab before sending
          them to checkout.
        </p>
      </section>

      <CartPageClient />
    </div>
  );
}
