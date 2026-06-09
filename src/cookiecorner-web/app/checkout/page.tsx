import styles from "../_components/page-section.module.css";

const checkoutSections = [
  "Customer details",
  "Delivery address",
  "Payment",
  "Order confirmation",
];

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

      <section className={styles.grid}>
        {checkoutSections.map((section) => (
          <article key={section} className={styles.card}>
            <h2>{section}</h2>
            <p>Placeholder panel for the first implementation of this step.</p>
          </article>
        ))}
      </section>
    </div>
  );
}
