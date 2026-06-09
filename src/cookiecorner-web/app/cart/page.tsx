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

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Cart items</h2>
          <p>No persisted cart yet. This will later show chosen configurations.</p>
        </article>
        <article className={styles.card}>
          <h2>Order summary</h2>
          <p>Subtotal, shipping, and promotions will live here.</p>
        </article>
        <article className={styles.card}>
          <h2>Next action</h2>
          <p>Continue to checkout once the cart API and state management exist.</p>
        </article>
      </section>
    </div>
  );
}
