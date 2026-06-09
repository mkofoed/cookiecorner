import styles from "../_components/page-section.module.css";

const products = [
  {
    name: "Hyggefis Mini",
    summary: "A small starter version for impulse buys and gifts.",
  },
  {
    name: "Hyggefis Classic",
    summary: "The main product for the CookieCorner launch assortment.",
  },
  {
    name: "Hyggefis Giant",
    summary: "A premium statement product for seasonal campaigns.",
  },
];

export default function ProductsPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Products</span>
        <h1>First product overview for the CookieCorner storefront.</h1>
        <p>
          This rudimentary page gives us a first browseable catalog surface. It
          can later be backed by the API product endpoints and real pricing data.
        </p>
      </section>

      <section className={styles.grid}>
        {products.map((product) => (
          <article key={product.name} className={styles.card}>
            <h2>{product.name}</h2>
            <p>{product.summary}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
