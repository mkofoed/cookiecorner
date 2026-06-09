import { connection } from "next/server";
import Link from "next/link";
import { formatDkk } from "../_components/currency";
import styles from "../_components/page-section.module.css";
import { Order } from "../_components/storefront-types";

type OrderResult =
  | { orders: Order[]; error: null }
  | { orders: []; error: string };

async function getOrders(): Promise<OrderResult> {
  const apiBaseUrl = process.env.API_BASE_URL ?? "http://api:8080";

  try {
    const response = await fetch(`${apiBaseUrl}/api/orders`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      return {
        orders: [],
        error: `Order retrieval failed with status ${response.status}. ${detail}`,
      };
    }

    return {
      orders: (await response.json()) as Order[],
      error: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      orders: [],
      error: `Order retrieval failed before the response was returned. ${message}`,
    };
  }
}

export default async function OrdersPage() {
  await connection();
  const { orders, error } = await getOrders();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>Orders</span>
        <h1>CookieCorner order history.</h1>
        <p>
          Previous orders are now saved in Redis so the storefront can show what
          has been placed and which status each order currently has.
        </p>
      </section>

      {error ? (
        <section className={styles.noticeCard}>
          <h2>Order history is not available yet</h2>
          <p>{error}</p>
        </section>
      ) : orders.length === 0 ? (
        <section className={styles.noticeCard}>
          <h2>No orders stored yet</h2>
          <p>Place a CookieCorner order to see it appear in the Redis-backed history.</p>
          <Link href="/configurator">Open customizer</Link>
        </section>
      ) : (
        <section className={styles.listPanel}>
          {orders.map((order) => (
            <article key={order.orderNumber} className={styles.lineItem}>
              <div>
                <h2>{order.orderNumber}</h2>
                <p>
                  Status: <strong>{order.status}</strong>
                </p>
                <p>Customer: {order.customerName}</p>
                <p>Email: {order.customerEmail}</p>
                <p>Total: {formatDkk(order.totalAmount)}</p>
                <p>Created: {new Date(order.createdAt).toLocaleString("en-US")}</p>
                <ul className={styles.list}>
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.productName} x {item.quantity} - {formatDkk(item.lineTotal)}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
