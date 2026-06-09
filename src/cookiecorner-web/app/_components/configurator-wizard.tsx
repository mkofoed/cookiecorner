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

export function ConfiguratorWizard({ products }: ConfiguratorWizardProps) {
  const sizeOptions = useMemo(
    () =>
      Array.from(
        new Set(products.map((product) => product.size).filter(Boolean)),
      ) as string[],
    [products],
  );
  const colorOptions = useMemo(
    () => {
      const options = new Map<string, ColorOption>();

      for (const product of products) {
        const option = resolveColorOption(product.color);
        options.set(option.key, option);
      }

      return Array.from(options.values());
    },
    [products],
  );
  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] ?? "Medium");
  const [selectedColorKey, setSelectedColorKey] = useState(
    colorOptions[0]?.key ?? defaultColorOption.key,
  );
  const [giftWrap, setGiftWrap] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const selectedProduct = useMemo(() => {
    const availableProducts = products.filter((product) => product.isAvailable);
    const exactMatch = availableProducts.find(
      (product) =>
        product.size?.toLowerCase() === selectedSize.toLowerCase() &&
        normalizeColorKey(product.color) === selectedColorKey,
    );

    if (exactMatch) {
      return exactMatch;
    }

    const sizeMatch = availableProducts.find(
      (product) => product.size?.toLowerCase() === selectedSize.toLowerCase(),
    );

    return sizeMatch ?? availableProducts[0] ?? null;
  }, [products, selectedColorKey, selectedSize]);

  const selectedColorOption =
    colorOptions.find((option) => option.key === selectedColorKey) ?? defaultColorOption;

  function addConfiguredProduct() {
    if (!selectedProduct) {
      return;
    }

    addConfiguredToCart(selectedProduct, {
      color: selectedColorOption.label,
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
            <p className={styles.productPrice}>D{selectedProduct?.price.toFixed(2) ?? "45.00"}</p>
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
            {colorOptions.map((colorOption) => (
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

function resolveColorOption(color: string | null) {
  const normalizedColor = normalizeColorKey(color);

  switch (normalizedColor) {
    case "blue":
      return {
        key: "blue",
        label: "Blue",
        swatch: "#213a63",
        textColor: "#ffffff",
      };
    case "brown":
      return {
        key: "brown",
        label: "Brown",
        swatch: "#7a4a2f",
        textColor: "#ffffff",
      };
    case "cream":
      return {
        key: "cream",
        label: "Cream",
        swatch: "#f2deb9",
        textColor: "#6b3a1e",
      };
    case "pink":
      return {
        key: "pink",
        label: "Pink",
        swatch: "#ff5aa5",
        textColor: "#ffffff",
      };
    case "green":
      return {
        key: "green",
        label: "Green",
        swatch: "#5e9d60",
        textColor: "#ffffff",
      };
    case "yellow":
      return {
        key: "yellow",
        label: "Yellow",
        swatch: "#f2c230",
        textColor: "#6b3a1e",
      };
    default:
      return defaultColorOption;
  }
}

function normalizeColorKey(color: string | null) {
  const normalized = normalizeValue(color);

  switch (normalized) {
    case "bla":
    case "blue":
      return "blue";
    case "brown":
    case "brun":
      return "brown";
    case "cream":
    case "creme":
      return "cream";
    case "green":
    case "gron":
      return "green";
    case "gul":
    case "yellow":
      return "yellow";
    case "pink":
    case "rose":
    case "rosa":
      return "pink";
    default:
      return normalized || defaultColorOption.key;
  }
}

function normalizeValue(value: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
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
