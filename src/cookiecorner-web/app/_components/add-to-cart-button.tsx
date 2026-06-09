"use client";

import { useState } from "react";
import { addToCart } from "./cart-storage";
import { Product } from "./storefront-types";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
};

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const [label, setLabel] = useState("Add to cart");

  return (
    <button
      className={className}
      disabled={!product.isAvailable}
      onClick={() => {
        addToCart(product);
        setLabel("Added");
        window.setTimeout(() => setLabel("Add to cart"), 1500);
      }}
      type="button"
    >
      {product.isAvailable ? label : "Unavailable"}
    </button>
  );
}
