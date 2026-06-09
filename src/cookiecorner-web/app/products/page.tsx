import { connection } from "next/server";
import { AddToCartButton } from "../_components/add-to-cart-button";
import styles from "../_components/page-section.module.css";
import { Product } from "../_components/storefront-types";

type ProductResult =
  | { products: Product[]; error: null }
  | { products: []; error: string };

async function getProducts(): Promise<ProductResult> {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://api:8080";

  try {
    const response = await fetch(`${apiBaseUrl}/api/products`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      return {
        products: [],
        error: `Product retrieval failed with status ${response.status}. ${detail}`,
      };
    }

    return {
      products: (await response.json()) as Product[],
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      products: [],
      error: `Product retrieval failed before the response was returned. ${message}`,
    };
  }
}

export default async function ProductsPage() {
  await connection();
  const { products, error } = await getProducts();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Products</span>
        <h1>First product overview for the CookieCorner storefront.</h1>
        <p>
          This page now reads products through the local API, which proxies the
          HyggeFrame product endpoints with the configured API key.
        </p>
      </section>

      {error ? (
        <section className={styles.noticeCard}>
          <h2>Products are not available yet</h2>
          <p>{error}</p>
        </section>
      ) : (
        <section className={styles.grid}>
          {products.map((product) => (
            <article key={product.id} className={styles.card}>
              <h2>{product.name}</h2>
              <p>{product.description ?? "No description is available yet."}</p>
              <p>
                Size: {product.size ?? "Unknown"}
                <br />
                Color: {product.color ?? "Unknown"}
                <br />
                Price: {product.price.toFixed(2)}
                <br />
                Stock: {product.stockQuantity}
                <br />
                Availability: {product.isAvailable ? "Available" : "Unavailable"}
              </p>
              <AddToCartButton className={styles.primaryButton} product={product} />
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
