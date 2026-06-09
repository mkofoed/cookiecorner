export type Product = {
  id: number;
  name: string;
  description: string | null;
  size: string | null;
  color: string | null;
  price: number;
  stockQuantity: number;
  isAvailable: boolean;
  createdAt: string;
};

export type CartItem = {
  cartItemId: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stockQuantity: number | null;
  size: string | null;
  color: string | null;
  configurationSummary?: string[];
};

export type Order = {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  country: string;
  status: string;
  notes: string | null;
  shippingAddress: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: number;
    productId: number;
    productName: string;
    productSize: string | null;
    productColor: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};
