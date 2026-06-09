import { connection } from "next/server";
import Link from "next/link";
import styles from "./_components/page-section.module.css";

type ApiStatus = {
  framework: string;
  hasApiKey: boolean;
  service: string;
  status: string;
};

async function getApiStatus(): Promise<ApiStatus> {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://api:8080";
  const response = await fetch(`${apiBaseUrl}/api/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API health request failed with status ${response.status}.`);
  }

  return (await response.json()) as ApiStatus;
}

export default async function Home() {
  await connection();
  const apiStatus = await getApiStatus();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>CookieCorner local stack</span>
        <h1>The first rudimentary storefront pages are now in place.</h1>
        <p>
          This gives the project a navigable starting point for product browsing,
          configuration, cart, and checkout while keeping the API integration and
          Docker-based local setup intact.
        </p>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Products</h2>
          <p>First browseable catalog route for Hyggefis variants.</p>
          <Link href="/products">Open products</Link>
        </article>
        <article className={styles.card}>
          <h2>Configurator</h2>
          <p>Placeholder journey for future structured product options.</p>
          <Link href="/configurator">Open configurator</Link>
        </article>
        <article className={styles.card}>
          <h2>Checkout flow</h2>
          <p>Basic cart and checkout pages for the initial purchase flow.</p>
          <Link href="/checkout">Open checkout</Link>
        </article>
      </section>

      <section className={styles.statusPanel}>
        <div>
          <span className={styles.statusLabel}>API service</span>
          <strong>{apiStatus.service}</strong>
        </div>
        <div>
          <span className={styles.statusLabel}>Status</span>
          <strong>{apiStatus.status}</strong>
        </div>
        <div>
          <span className={styles.statusLabel}>Local API key</span>
          <strong>{apiStatus.hasApiKey ? "Loaded" : "Missing"}</strong>
        </div>
      </section>
    </div>
  );
}
