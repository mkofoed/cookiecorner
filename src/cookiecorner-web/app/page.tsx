import { connection } from "next/server";
import styles from "./page.module.css";

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
      <main className={styles.main}>
        <section className={styles.hero}>
          <span className={styles.eyebrow}>CookieCorner local stack</span>
          <h1>Next.js storefront and .NET 10 API running in Docker Compose.</h1>
          <p>
            This is the local starting point for the CookieCorner launch of
            Hyggefis. The web app is rendered with the App Router and reads API
            status from the backend at request time.
          </p>
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2>Frontend</h2>
            <p>Next.js 16 App Router with TypeScript.</p>
          </article>
          <article className={styles.card}>
            <h2>Backend</h2>
            <p>{apiStatus.framework} Web API with OpenAPI enabled in development.</p>
          </article>
          <article className={styles.card}>
            <h2>Containers</h2>
            <p>Docker Compose starts the web and API services together.</p>
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
      </main>
    </div>
  );
}
