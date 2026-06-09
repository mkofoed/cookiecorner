"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { addConfiguredToCart } from "./cart-storage";
import styles from "./page-section.module.css";
import { Product } from "./storefront-types";

const wrapOptions = [
  { label: "No gift wrap", value: false },
  { label: "Add gift wrap", value: true },
];

type ConfiguratorWizardProps = {
  products: Product[];
};

export function ConfiguratorWizard({ products }: ConfiguratorWizardProps) {
  const sizeOptions = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.size).filter(Boolean)),
      ) as string[],
    [products],
  );
  const colorOptions = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.color).filter(Boolean)),
      ) as string[],
    [products],
  );
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] ?? "Medium");
  const [selectedColor, setSelectedColor] = useState(colorOptions[0] ?? "Brown");
  const [giftWrap, setGiftWrap] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const selectedProduct = useMemo(() => {
    const availableProducts = products.filter((product) => product.isAvailable);
    const exactMatch = availableProducts.find(
      (product) =>
        product.size?.toLowerCase() === selectedSize.toLowerCase() &&
        product.color?.toLowerCase() === selectedColor.toLowerCase(),
    );

    if (exactMatch) {
      return exactMatch;
    }

    const sizeMatch = availableProducts.find(
      (product) => product.size?.toLowerCase() === selectedSize.toLowerCase(),
    );

    return sizeMatch ?? availableProducts[0] ?? null;
  }, [products, selectedColor, selectedSize]);

  function addConfiguredProduct() {
    if (!selectedProduct) {
      return;
    }

    addConfiguredToCart(selectedProduct, {
      color: selectedColor,
      giftWrap,
      quantity,
      size: selectedSize,
    });

    setIsAdded(true);
  }

  const productDescription =
    selectedProduct?.description ??
    "Hyggefis is built for warm hugs, playful comfort, and a big bakery-window smile.";
  const previewCards = colorOptions.slice(0, 3);
  const accentColor = getColorValue(selectedColor);
  const accentTextColor = selectedColor.toLowerCase() === "cream" ? "#6b3a1e" : "#ffffff";

  return (
    <section className={styles.productLayout}>
      <section className={styles.productVisualPanel}>
        <div className={styles.collectionBadge}>CookieCorner Collection</div>

        <div className={styles.productHeader}>
          <div>
            <p className={styles.collectionLabel}>Hyggefis collection</p>
            <h1 className={styles.productTitle}>HYGGEBEAR</h1>
            <p className={styles.productPrice}>D{selectedProduct?.price.toFixed(2) ?? "45.00"}</p>
          </div>
        </div>

        <div className={styles.heroShowcase}>
          <div className={styles.productMascot} style={{ ["--hoodie-color" as string]: accentColor }}>
            <div className={styles.productMascotEarLeft} />
            <div className={styles.productMascotEarRight} />
            <div className={styles.productMascotHead}>
              <div className={styles.productMascotFace}>
                <div className={styles.productMascotEyes}>
                  <span />
                  <span />
                </div>
                <div className={styles.productMascotNose} />
                <div className={styles.productMascotSmile} />
              </div>
            </div>
            <div className={styles.productMascotBody}>
              <span className={styles.productMascotWordmark} style={{ color: accentTextColor }}>
                Hygge
              </span>
            </div>
          </div>
        </div>

        <div className={styles.thumbnailRow}>
          {previewCards.map((color) => (
            <button
              key={color}
              className={`${styles.thumbnailCard} ${
                selectedColor === color ? styles.thumbnailCardActive : ""
              }`}
              onClick={() => {
                setSelectedColor(color);
                setIsAdded(false);
              }}
              type="button"
            >
              <div
                className={styles.thumbnailMascot}
                style={{ ["--hoodie-color" as string]: getColorValue(color) }}
              />
              <span>{color}</span>
            </button>
          ))}
        </div>
      </section>

      <aside className={styles.productSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.iconBadge}>◎</div>
          <div className={styles.iconBadge}>🧺</div>
        </div>

        <section className={styles.sidebarSection}>
          <h2>Description</h2>
          <p>{productDescription}</p>
          <p>
            Choose your favorite hoodie color and size, then let this little
            bundle of coziness move straight into your cart.
          </p>
        </section>

        <section className={styles.sidebarSection}>
          <h2>Select size</h2>
          <div className={styles.selectorRow}>
            {sizeOptions.map((size) => (
              <button
                key={size}
                className={`${styles.selectorSquare} ${
                  selectedSize === size ? styles.selectorSquareActive : ""
                }`}
                onClick={() => {
                  setSelectedSize(size);
                  setIsAdded(false);
                }}
                type="button"
              >
                {getSizeLabel(size)}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.sidebarSection}>
          <h2>Color</h2>
          <div className={styles.selectorRow}>
            {colorOptions.map((color) => (
              <button
                key={color}
                aria-label={color}
                className={`${styles.colorSwatch} ${
                  selectedColor === color ? styles.colorSwatchActive : ""
                }`}
                onClick={() => {
                  setSelectedColor(color);
                  setIsAdded(false);
                }}
                style={{
                  ["--swatch-color" as string]: getColorValue(color),
                  ["--swatch-text" as string]:
                    color.toLowerCase() === "cream" ? "#6b3a1e" : "#ffffff",
                }}
                type="button"
              >
                {getColorLabel(color)}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.sidebarSection}>
          <h2>Wrapping</h2>
          <div className={styles.selectorRow}>
            {wrapOptions.map((option) => (
              <button
                key={option.label}
                className={`${styles.selectorWide} ${
                  giftWrap === option.value ? styles.selectorWideActive : ""
                }`}
                onClick={() => {
                  setGiftWrap(option.value);
                  setIsAdded(false);
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.purchaseRow}>
          <label className={styles.quantityPicker}>
            <span>Qty</span>
            <select
              className={styles.quantitySelect}
              onChange={(event) => {
                setQuantity(Number(event.target.value));
                setIsAdded(false);
              }}
              value={quantity}
            >
              {[1, 2, 3, 4, 5].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button className={styles.ctaButton} onClick={addConfiguredProduct} type="button">
            Add to basket
          </button>
        </section>

        <section className={styles.recipeSummary}>
          <p>Selected size: {selectedSize}</p>
          <p>Selected color: {selectedColor}</p>
          <p>Gift wrap: {giftWrap ? "Yes" : "No"}</p>
          <p>Fulfilment item: {selectedProduct?.name ?? "Not available"}</p>
          {isAdded ? (
            <p className={styles.successText}>
              Freshly added. <Link href="/cart">Open cart</Link>
            </p>
          ) : null}
        </section>
      </aside>
    </section>
  );
}

function getColorValue(color: string) {
  switch (color.toLowerCase()) {
    case "blue":
      return "#213a63";
    case "brown":
      return "#7a4a2f";
    case "cream":
      return "#f2deb9";
    case "rose":
      return "#ff5aa5";
    case "green":
      return "#5e9d60";
    case "yellow":
      return "#f2c230";
    default:
      return "#213a63";
  }
}

function getColorLabel(color: string) {
  return color.slice(0, 1).toUpperCase();
}

function getSizeLabel(size: string) {
  switch (size.toLowerCase()) {
    case "small":
      return "S";
    case "medium":
      return "M";
    case "large":
      return "L";
    case "giant":
      return "XL";
    default:
      return size.slice(0, 4).toUpperCase();
  }
}
