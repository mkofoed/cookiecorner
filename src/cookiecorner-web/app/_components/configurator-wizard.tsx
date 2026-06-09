"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { addConfiguredToCart } from "./cart-storage";
import { formatDkk } from "./currency";
import styles from "./page-section.module.css";
import { Product } from "./storefront-types";

const wrapOptions = [
  { label: "No gift wrap", value: false },
  { label: "Add gift wrap", value: true },
];

const sizeOptions = ["Mini", "Small", "Medium", "Large", "Giant"];

type ConfiguratorWizardProps = {
  products: Product[];
};

type ColorOption = {
  key: string;
  label: string;
  swatch: string;
  textColor: string;
};

const defaultColorOption: ColorOption = {
  key: "brown",
  label: "Brown",
  swatch: "#7a4a2f",
  textColor: "#ffffff",
};

const customColorOptions: ColorOption[] = [
  defaultColorOption,
  {
    key: "blue",
    label: "Blue",
    swatch: "#213a63",
    textColor: "#ffffff",
  },
  {
    key: "cream",
    label: "Cream",
    swatch: "#f2deb9",
    textColor: "#6b3a1e",
  },
  {
    key: "pink",
    label: "Pink",
    swatch: "#ff5aa5",
    textColor: "#ffffff",
  },
  {
    key: "green",
    label: "Green",
    swatch: "#5e9d60",
    textColor: "#ffffff",
  },
  {
    key: "yellow",
    label: "Yellow",
    swatch: "#f2c230",
    textColor: "#6b3a1e",
  },
];

export function ConfiguratorWizard({ products }: ConfiguratorWizardProps) {
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] ?? "Medium");
  const [selectedColorKey, setSelectedColorKey] = useState(
    customColorOptions[0]?.key ?? defaultColorOption.key,
  );
  const [giftWrap, setGiftWrap] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const checkoutReferenceProduct = useMemo(
    () => products.find((product) => product.isAvailable) ?? products[0] ?? null,
    [products],
  );

  const selectedColorOption =
    customColorOptions.find((option) => option.key === selectedColorKey) ?? defaultColorOption;

  function addConfiguredProduct() {
    if (!checkoutReferenceProduct) {
      return;
    }

    addConfiguredToCart(checkoutReferenceProduct, {
      color: selectedColorOption.label,
      giftWrap,
      quantity,
      size: selectedSize,
    });

    setIsAdded(true);
  }

  const productDescription =
    "This custom CookieCorner Hyggefis is configured entirely from your own choices instead of matching an existing catalog model.";
  const previewCards = customColorOptions;
  const accentColor = selectedColorOption.swatch;
  const accentShadow = shadeHex(accentColor, -18);
  const accentTextColor = selectedColorOption.textColor;

  return (
    <section className={styles.productLayout}>
      <section className={styles.productVisualPanel}>
        <div className={styles.collectionBadge}>CookieCorner Collection</div>

        <div className={styles.productHeader}>
          <div>
            <p className={styles.collectionLabel}>Hyggefis collection</p>
            <h1 className={styles.productTitle}>HYGGEBEAR</h1>
            <p className={styles.productPrice}>
              {formatDkk(checkoutReferenceProduct?.price ?? 45)}
            </p>
          </div>
        </div>

        <div className={styles.heroShowcase}>
          <div
            className={styles.productMascot}
            style={{
              ["--hoodie-color" as string]: accentColor,
              ["--hoodie-shadow" as string]: accentShadow,
            }}
          >
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
          {previewCards.map((colorOption) => (
            <button
              key={colorOption.key}
              className={`${styles.thumbnailCard} ${
                selectedColorKey === colorOption.key ? styles.thumbnailCardActive : ""
              }`}
              onClick={() => {
                setSelectedColorKey(colorOption.key);
                setIsAdded(false);
              }}
              type="button"
            >
              <div
                className={styles.thumbnailMascot}
                style={{
                  ["--hoodie-color" as string]: colorOption.swatch,
                  ["--hoodie-shadow" as string]: shadeHex(colorOption.swatch, -18),
                }}
              />
              <span>{colorOption.label}</span>
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
          {customColorOptions.map((colorOption) => (
              <button
                key={colorOption.key}
                aria-label={colorOption.label}
                title={colorOption.label}
                className={`${styles.colorSwatch} ${
                  selectedColorKey === colorOption.key ? styles.colorSwatchActive : ""
                }`}
                onClick={() => {
                  setSelectedColorKey(colorOption.key);
                  setIsAdded(false);
                }}
                style={{
                  ["--swatch-color" as string]: colorOption.swatch,
                  ["--swatch-text" as string]: colorOption.textColor,
                }}
                type="button"
              >
                <span className={styles.colorSwatchLabel}>{colorOption.label}</span>
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
          <p>Selected color: {selectedColorOption.label}</p>
          <p>Gift wrap: {giftWrap ? "Yes" : "No"}</p>
          <p>Configuration type: Custom-built Hyggefis</p>
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

function shadeHex(hex: string, adjustment: number) {
  const normalizedHex = hex.replace("#", "");
  const red = clampHexChannel(parseInt(normalizedHex.slice(0, 2), 16) + adjustment);
  const green = clampHexChannel(parseInt(normalizedHex.slice(2, 4), 16) + adjustment);
  const blue = clampHexChannel(parseInt(normalizedHex.slice(4, 6), 16) + adjustment);

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

function clampHexChannel(value: number) {
  return Math.max(0, Math.min(255, value));
}

function toHex(value: number) {
  return value.toString(16).padStart(2, "0");
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
