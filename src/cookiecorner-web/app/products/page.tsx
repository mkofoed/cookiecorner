import { connection } from "next/server";
import Link from "next/link";
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
        <span className={styles.eyebrow}>Store</span>
        <h1>Fresh from the oven: build your Hyggefis in the cookie customizer.</h1>
        <p>
          The storefront now uses the HyggeFrame catalog behind the scenes, but
          customers start by configuring a Hyggefis from scratch instead of
          choosing from an existing stock list.
        </p>
      </section>

      {error ? (
        <section className={styles.noticeCard}>
          <h2>Products are not available yet</h2>
          <p>{error}</p>
        </section>
      ) : (
        <>
          <section className={styles.grid}>
            <article className={styles.card}>
              <h2>Choose your size</h2>
              <p>
                CookieCorner sizes currently available in the bakery:{" "}
                {Array.from(
                  new Set(products.map((product) => product.size).filter(Boolean)),
                ).join(", ")}
              </p>
            </article>
            <article className={styles.card}>
              <h2>Pick your color</h2>
              <p>
                Frosting colors currently supported:{" "}
                {Array.from(
                  new Set(products.map((product) => product.color).filter(Boolean)),
                ).join(", ")}
              </p>
            </article>
            <article className={styles.card}>
              <h2>Finish your cookie-order ritual</h2>
              <p>
                Review your choices one step at a time and add the configured item
                to your cart.
              </p>
              <Link href="/configurator">Open customizer</Link>
            </article>
          </section>

          <section className={styles.noticeCard}>
            <h2>No stock list shown</h2>
            <p>
              Product inventory stays hidden from the storefront. The API catalog is
              only used to power valid size and color choices behind the scenes.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
