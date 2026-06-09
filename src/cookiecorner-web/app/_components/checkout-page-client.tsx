"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { clearCart, getCartItems, subscribeToCartUpdates } from "./cart-storage";
import { formatDkk } from "./currency";
import { CartItem, Order } from "./storefront-types";
import styles from "./page-section.module.css";

type CheckoutFormState = {
  city: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  shippingAddress: string;
};

const initialFormState: CheckoutFormState = {
  city: "",
  customerEmail: "",
  customerName: "",
  customerPhone: "",
  notes: "",
  shippingAddress: "",
};

export function CheckoutPageClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState<CheckoutFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const syncCart = () => setItems(getCartItems());

    syncCart();
    return subscribeToCartUpdates(syncCart);
  }, []);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const configurationNotes = items
        .filter((item) => item.configurationSummary?.length)
        .map(
          (item) =>
            `${item.name}: ${(item.configurationSummary ?? []).join(", ")}`,
        );

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          customerPhone: form.customerPhone || null,
          notes:
            [form.notes, ...configurationNotes].filter(Boolean).join(" | ") || null,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail);
      }

      const order = (await response.json()) as Order;
      setSubmittedOrder(order);
      clearCart();
      setForm(initialFormState);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Order submission failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submittedOrder) {
    return (
      <section className={styles.noticeCard}>
        <h2>Order placed</h2>
        <p>
          Your order <strong>{submittedOrder.orderNumber}</strong> has been created
          with status <strong>{submittedOrder.status}</strong>.
        </p>
        <p>Total amount: {formatDkk(submittedOrder.totalAmount)}</p>
        <p>You can review previously placed orders and their statuses in the order history.</p>
        <Link href="/orders">Open order history</Link>
        <br />
        <Link href="/configurator">Create another Hyggefis</Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className={styles.noticeCard}>
        <h2>No items ready for checkout</h2>
        <p>Add a custom Hyggefis to your cart before placing an order.</p>
        <Link href="/configurator">Open customizer</Link>
      </section>
    );
  }

  return (
    <div className={styles.twoColumn}>
      <form className={styles.formPanel} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <label className={styles.fieldLabel}>
            Name
            <input
              className={styles.textInput}
              onChange={(event) => setForm({ ...form, customerName: event.target.value })}
              required
              type="text"
              value={form.customerName}
            />
          </label>
          <label className={styles.fieldLabel}>
            Email
            <input
              className={styles.textInput}
              onChange={(event) => setForm({ ...form, customerEmail: event.target.value })}
              required
              type="email"
              value={form.customerEmail}
            />
          </label>
          <label className={styles.fieldLabel}>
            Phone
            <input
              className={styles.textInput}
              onChange={(event) => setForm({ ...form, customerPhone: event.target.value })}
              type="tel"
              value={form.customerPhone}
            />
          </label>
          <label className={styles.fieldLabel}>
            City
            <input
              className={styles.textInput}
              onChange={(event) => setForm({ ...form, city: event.target.value })}
              required
              type="text"
              value={form.city}
            />
          </label>
          <label className={styles.fieldLabelFull}>
            Shipping address
            <input
              className={styles.textInput}
              onChange={(event) => setForm({ ...form, shippingAddress: event.target.value })}
              required
              type="text"
              value={form.shippingAddress}
            />
          </label>
          <label className={styles.fieldLabelFull}>
            Notes
            <textarea
              className={styles.textArea}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              rows={4}
              value={form.notes}
            />
          </label>
        </div>

        {error ? <p className={styles.errorText}>{error}</p> : null}

        <button className={styles.primaryButton} disabled={isSubmitting} type="submit">
          {isSubmitting ? "Placing order..." : "Place order"}
        </button>
      </form>

      <aside className={styles.noticeCard}>
        <h2>Order summary</h2>
        {items.map((item) => (
          <p key={item.cartItemId}>
            {item.name} x {item.quantity} — {formatDkk(item.price * item.quantity)}
          </p>
        ))}
        <p>
          <strong>Total: {formatDkk(totalAmount)}</strong>
        </p>
      </aside>
    </div>
  );
}
