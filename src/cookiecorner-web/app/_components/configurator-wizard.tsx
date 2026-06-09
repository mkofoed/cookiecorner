"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { addConfiguredToCart } from "./cart-storage";
import styles from "./page-section.module.css";
import { Product } from "./storefront-types";

const sizeOptions = ["Mini", "Small", "Medium", "Large", "Giant"];
const colorOptions = ["Brown", "Cream", "Blue", "Rose"];
const wrapOptions = [
  { label: "No gift wrap", value: false },
  { label: "Add gift wrap", value: true },
];

type ConfiguratorWizardProps = {
  products: Product[];
};

export function ConfiguratorWizard({ products }: ConfiguratorWizardProps) {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    products[0]?.id ?? null,
  );
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [selectedColor, setSelectedColor] = useState("Brown");
  const [giftWrap, setGiftWrap] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );

  const canGoNext =
    (stepIndex === 0 && selectedProduct !== null) ||
    stepIndex === 1 ||
    stepIndex === 2 ||
    stepIndex === 3;

  function addConfiguredProduct() {
    if (!selectedProduct) {
      return;
    }

    addConfiguredToCart(selectedProduct, {
      color: selectedColor,
      giftWrap,
      size: selectedSize,
    });

    setIsAdded(true);
  }

  return (
    <div className={styles.page}>
      <section className={styles.noticeCard}>
        <h2>Configurator wizard</h2>
        <p>
          Customize one feature at a time, then add the configured Hyggefis to
          your cart.
        </p>
      </section>

      <section className={styles.wizardSteps}>
        {["Product", "Size", "Color", "Gift wrap", "Review"].map((step, index) => (
          <div
            key={step}
            className={`${styles.stepBadge} ${index === stepIndex ? styles.stepBadgeActive : ""}`}
          >
            {index + 1}. {step}
          </div>
        ))}
      </section>

      {stepIndex === 0 ? (
        <section className={styles.grid}>
          {products.map((product) => (
            <button
              key={product.id}
              className={`${styles.optionCard} ${
                selectedProductId === product.id ? styles.optionCardSelected : ""
              }`}
              onClick={() => {
                setSelectedProductId(product.id);
                setIsAdded(false);
              }}
              type="button"
            >
              <strong>{product.name}</strong>
              <span>{product.description ?? "No description available."}</span>
              <span>Base price: {product.price.toFixed(2)}</span>
            </button>
          ))}
        </section>
      ) : null}

      {stepIndex === 1 ? (
        <section className={styles.optionGrid}>
          {sizeOptions.map((size) => (
            <button
              key={size}
              className={`${styles.optionCard} ${
                selectedSize === size ? styles.optionCardSelected : ""
              }`}
              onClick={() => {
                setSelectedSize(size);
                setIsAdded(false);
              }}
              type="button"
            >
              <strong>{size}</strong>
              <span>Choose the overall bear size for your configuration.</span>
            </button>
          ))}
        </section>
      ) : null}

      {stepIndex === 2 ? (
        <section className={styles.optionGrid}>
          {colorOptions.map((color) => (
            <button
              key={color}
              className={`${styles.optionCard} ${
                selectedColor === color ? styles.optionCardSelected : ""
              }`}
              onClick={() => {
                setSelectedColor(color);
                setIsAdded(false);
              }}
              type="button"
            >
              <strong>{color}</strong>
              <span>Pick the main color for the Hyggefis finish.</span>
            </button>
          ))}
        </section>
      ) : null}

      {stepIndex === 3 ? (
        <section className={styles.optionGrid}>
          {wrapOptions.map((option) => (
            <button
              key={option.label}
              className={`${styles.optionCard} ${
                giftWrap === option.value ? styles.optionCardSelected : ""
              }`}
              onClick={() => {
                setGiftWrap(option.value);
                setIsAdded(false);
              }}
              type="button"
            >
              <strong>{option.label}</strong>
              <span>Decide whether the item should arrive ready to gift.</span>
            </button>
          ))}
        </section>
      ) : null}

      {stepIndex === 4 && selectedProduct ? (
        <section className={styles.twoColumn}>
          <section className={styles.formPanel}>
            <h2>Your configured Hyggefis</h2>
            <p>Base product: {selectedProduct.name}</p>
            <p>Size: {selectedSize}</p>
            <p>Color: {selectedColor}</p>
            <p>Gift wrap: {giftWrap ? "Yes" : "No"}</p>
            <p>Price: {selectedProduct.price.toFixed(2)}</p>
            <button className={styles.primaryButton} onClick={addConfiguredProduct} type="button">
              Add configured Hyggefis to cart
            </button>
            {isAdded ? (
              <p className={styles.successText}>
                Added to cart. <Link href="/cart">Open cart</Link>
              </p>
            ) : null}
          </section>

          <aside className={styles.noticeCard}>
            <h2>How it works</h2>
            <p>
              The wizard stores your chosen configuration with the cart item so it
              remains visible through cart and checkout.
            </p>
          </aside>
        </section>
      ) : null}

      <section className={styles.wizardActions}>
        <button
          className={styles.secondaryButton}
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((current) => current - 1)}
          type="button"
        >
          Back
        </button>
        <button
          className={styles.primaryButton}
          disabled={!canGoNext}
          onClick={() => setStepIndex((current) => current + 1)}
          type="button"
        >
          Next
        </button>
      </section>
    </div>
  );
}
