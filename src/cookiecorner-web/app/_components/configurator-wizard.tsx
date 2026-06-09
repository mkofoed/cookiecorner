"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addConfiguredToCart, getCartItems, subscribeToCartUpdates } from "./cart-storage";
import { formatDkk } from "./currency";
import styles from "./page-section.module.css";
import { CartItem, Product } from "./storefront-types";

const sizeOptions = ["Mini", "Small", "Medium", "Large", "Giant"];

const teddyImageSrc = "/images/configurator/teddy-bear-source.png";
const teddySweaterMaskSrc = "/images/configurator/teddy-bear-sweater-mask.png";

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const selectedColorOption =
   customColorOptions.find((option) => option.key === selectedColorKey) ?? defaultColorOption;
  const { isExactColorMatch, product: selectedProduct } = useMemo(
   () => getSelectedProduct(products, selectedSize, selectedColorOption.label),
   [products, selectedColorOption.label, selectedSize],
  );
  const mostPopularSize = useMemo(() => getMostPopularSize(products), [products]);
  const cartTotal = useMemo(
   () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
   [cartItems],
  );
  const reservedQuantity = useMemo(
   () => getReservedQuantityForProduct(cartItems, selectedProduct?.id ?? null),
   [cartItems, selectedProduct?.id],
  );
  const remainingStock = selectedProduct && isExactColorMatch
   ? Math.max(0, selectedProduct.stockQuantity - reservedQuantity)
   : 0;
  const effectiveQuantity = remainingStock > 0 ? Math.min(quantity, remainingStock) : 1;
  const stockMessage = getStockMessage(
   selectedProduct,
   selectedSize,
   selectedColorOption.label,
   isExactColorMatch,
   remainingStock,
  );
  const canAddToCart = Boolean(
   isExactColorMatch && selectedProduct?.isAvailable && remainingStock > 0,
  );

  useEffect(() => {
   const syncCart = () => setCartItems(getCartItems());

   syncCart();
   return subscribeToCartUpdates(syncCart);
  }, []);

  function addConfiguredProduct() {
   if (!selectedProduct || !canAddToCart) {
     return;
   }

   addConfiguredToCart(selectedProduct, {
     color: selectedColorOption.label,
     price: selectedProduct.price,
     quantity: effectiveQuantity,
     size: selectedSize,
   });

   setIsCartDrawerOpen(true);
  }

  const productDescription =
   "Hyggefis are soft, cozy teddy bears made for gifting, collecting, and bringing a little extra hygge into everyday life.";
  const accentColor = selectedColorOption.swatch;
  const bearScale = getBearScale(selectedSize);

  return (
    <section className={styles.productLayout}>
      <section className={styles.productVisualPanel}>
        <div className={styles.productHeader}>
          <div>
            <p className={styles.collectionLabel}>Hyggefis collection</p>
            <h1 className={styles.productTitle}>HYGGEFIS</h1>
            <p className={styles.productPrice}>
              {formatDkk(selectedProduct?.price ?? 45)}
            </p>
          </div>
        </div>

        <div className={styles.heroShowcase}>
          <div
            className={styles.productMascot}
            style={{
              ["--bear-scale" as string]: bearScale.toString(),
              ["--hoodie-color" as string]: accentColor,
            }}
          >
            <TeddyPreview alt="Configured Hyggefis preview" color={accentColor} priority />
          </div>
        </div>
      </section>

      <aside className={styles.productSidebar}>
        <section className={styles.sidebarSection}>
          <h2>Description</h2>
          <p>{productDescription}</p>
          <p>
            Choose your favorite hoodie color and size, then add your Hyggefis to the
            basket when the selected teddy is ready to ship.
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
                onClick={() => setSelectedSize(size)}
                type="button"
              >
                <span className={styles.selectorSquareLabel}>{getSizeLabel(size)}</span>
                {mostPopularSize === size ? (
                  <span className={styles.selectorBadge}>Most popular</span>
                ) : null}
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
                onClick={() => setSelectedColorKey(colorOption.key)}
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

        <section className={styles.purchaseRow}>
          <label className={styles.quantityPicker}>
            <span>Qty</span>
            <input
              className={styles.quantitySelect}
              onChange={(event) => {
                const nextQuantity = Number(event.target.value);

                if (Number.isFinite(nextQuantity) && nextQuantity >= 1) {
                  setQuantity(Math.min(Math.floor(nextQuantity), Math.max(remainingStock, 1)));
                }
              }}
              max={Math.max(remainingStock, 1)}
              min={1}
              step={1}
              type="number"
              value={effectiveQuantity}
            />
          </label>

          <button
            aria-label="Add to basket"
            className={styles.ctaButton}
            disabled={!canAddToCart}
            onClick={addConfiguredProduct}
            title="Add to basket"
            type="button"
          >
            +
          </button>

          <p
            className={`${styles.purchaseMessage} ${
              canAddToCart ? styles.availabilityText : styles.availabilityWarning
            }`}
          >
            {stockMessage}
          </p>
        </section>
      </aside>

      {isCartDrawerOpen && cartItems.length > 0 ? (
        <aside aria-label="Current basket" className={styles.cartDrawer}>
          <div className={styles.cartDrawerHeader}>
            <div>
              <p className={styles.collectionLabel}>Basket</p>
              <h2 className={styles.cartDrawerTitle}>Current selection</h2>
            </div>
            <button
              aria-label="Close basket overview"
              className={styles.cartDrawerClose}
              onClick={() => setIsCartDrawerOpen(false)}
              type="button"
            >
              x
            </button>
          </div>

          <div className={styles.cartDrawerBody}>
            {cartItems.map((item) => (
              <article key={item.cartItemId} className={styles.cartDrawerItem}>
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    Size: {item.size ?? "Unknown"} | Color: {item.color ?? "Unknown"}
                  </p>
                </div>
                <div className={styles.cartDrawerItemMeta}>
                  <span>x{item.quantity}</span>
                  <strong>{formatDkk(item.price * item.quantity)}</strong>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.cartDrawerFooter}>
            <p>
              <strong>Total: {formatDkk(cartTotal)}</strong>
            </p>
            <Link className={styles.primaryButton} href="/checkout">
              Go to checkout
            </Link>
          </div>
        </aside>
      ) : null}
    </section>
  );
}

type TeddyPreviewProps = {
  alt: string;
  color: string;
  priority?: boolean;
};

function TeddyPreview({ alt, color, priority = false }: TeddyPreviewProps) {
  return (
    <div className={styles.teddyPreviewFrame}>
      <Image
        alt={alt}
        className={styles.teddyPreviewImage}
        fill
        priority={priority}
        sizes="(max-width: 820px) 380px, 560px"
        src={teddyImageSrc}
      />
      <div
        className={styles.teddyPreviewSweater}
        style={{
          ["--hoodie-color" as string]: color,
          ["--sweater-mask" as string]: `url("${teddySweaterMaskSrc}")`,
        }}
      />
    </div>
  );
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

function getBearScale(size: string) {
  switch (size.toLowerCase()) {
    case "mini":
      return 0.82;
    case "small":
      return 0.96;
    case "medium":
      return 1.1;
    case "large":
      return 1.28;
    case "giant":
      return 1.52;
    default:
      return 1.1;
  }
}

function getSelectedProduct(products: Product[], selectedSize: string, selectedColor: string) {
  const sizeMatches = products.filter(
    (product) => normalizeValue(product.size) === normalizeValue(selectedSize),
  );
  const exactColorMatches = sizeMatches.filter(
    (product) => normalizeValue(product.color) === normalizeValue(selectedColor),
  );

  if (exactColorMatches.length > 0) {
    return {
      isExactColorMatch: true,
      product: getPreferredProduct(exactColorMatches),
    };
  }

  if (sizeMatches.length > 0) {
    return {
      isExactColorMatch: false,
      product: getPreferredProduct(sizeMatches),
    };
  }

  return {
    isExactColorMatch: false,
    product: null,
  };
}

function getMostPopularSize(products: Product[]) {
  const stockBySize = new Map<string, number>();

  for (const product of products) {
    if (!product.isAvailable || !product.size) {
      continue;
    }

    const matchingSize =
      sizeOptions.find((size) => size.toLowerCase() === product.size?.toLowerCase()) ?? null;

    if (!matchingSize) {
      continue;
    }

    const currentStock = stockBySize.get(matchingSize) ?? 0;
    stockBySize.set(matchingSize, currentStock + Math.max(product.stockQuantity, 0));
  }

  return sizeOptions.reduce((mostPopular, size) => {
    const currentStock = stockBySize.get(size) ?? 0;
    const mostPopularStock = stockBySize.get(mostPopular) ?? -1;

    return currentStock > mostPopularStock ? size : mostPopular;
  }, sizeOptions[0] ?? "Medium");
}

function getStockMessage(
  product: Product | null,
  selectedSize: string,
  selectedColor: string,
  isExactColorMatch: boolean,
  remainingStock: number,
) {
  if (!product) {
    return `${selectedSize} is not available in the current Hyggefis assortment.`;
  }

  if (!isExactColorMatch) {
    return `${selectedColor} ${selectedSize.toLowerCase()} is not available right now. Please choose another color.`;
  }

  if (!product.isAvailable || product.stockQuantity <= 0) {
    return `${selectedColor} ${selectedSize.toLowerCase()} is currently out of stock. Please choose another color or size.`;
  }

  if (remainingStock <= 0) {
    return `You already added all available ${selectedColor.toLowerCase()} ${selectedSize.toLowerCase()} Hyggefis to your basket.`;
  }

  if (remainingStock === 1) {
    return `Only 1 ${selectedColor.toLowerCase()} ${selectedSize.toLowerCase()} Hyggefis is left in stock.`;
  }

  if (remainingStock < product.stockQuantity) {
    return `${remainingStock} ${selectedColor.toLowerCase()} ${selectedSize.toLowerCase()} Hyggefis are still available after the ones already in your basket.`;
  }

  return `${remainingStock} ${selectedColor.toLowerCase()} ${selectedSize.toLowerCase()} Hyggefis are ready for checkout.`;
}

function getPreferredProduct(products: Product[]) {
  return products.reduce((preferredProduct, currentProduct) => {
    if (preferredProduct.isAvailable !== currentProduct.isAvailable) {
      return currentProduct.isAvailable ? currentProduct : preferredProduct;
    }

    return currentProduct.price < preferredProduct.price ? currentProduct : preferredProduct;
  });
}

function normalizeValue(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function getReservedQuantityForProduct(cartItems: CartItem[], productId: number | null) {
  if (productId === null) {
    return 0;
  }

  return cartItems
    .filter((item) => item.productId === productId)
    .reduce((total, item) => total + item.quantity, 0);
}
