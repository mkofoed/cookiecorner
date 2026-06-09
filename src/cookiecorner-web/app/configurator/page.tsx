import { connection } from "next/server";
import { ConfiguratorWizard } from "../_components/configurator-wizard";
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
        error: `Configurator product retrieval failed with status ${response.status}. ${detail}`,
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
      error: `Configurator product retrieval failed before the response was returned. ${message}`,
    };
  }
}

export default async function ConfiguratorPage() {
  await connection();
  const { products, error } = await getProducts();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Configurator</span>
        <h1>Customize your Hyggefis like a signature CookieCorner recipe.</h1>
        <p>
          The configurator now feels like a cookie workshop: choose the shape,
          color, and final wrapping one step at a time before sending the custom
          creation to your cart.
        </p>
      </section>

      {error ? (
        <section className={styles.noticeCard}>
          <h2>Configurator is not available yet</h2>
          <p>{error}</p>
        </section>
      ) : (
        <ConfiguratorWizard products={products} />
      )}
    </div>
  );
}
