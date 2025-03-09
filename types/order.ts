export interface OrderItem {
  productId: string;  // Document ID of the product
  name: string;      // Product name for quick reference
  quantity: number;
  price: number;
  giftMessage?: string;
  specialRequest?: string;  // Add this field
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  specialInstructions?: string;
  deliveryDate: Date | string;  // Only at order level
  coupon?: {
    code: string;
    type: 'direct' | 'percentage';
    value: number;
    discount: number;
    name?: string; // Add this field
  };
  subtotal: number; // Add this
  total: number;
  paymentStatus: {
    userConfirmed: boolean;
    adminConfirmed: boolean;
    confirmedAt?: Date;
  };
  tracking: {
    isDelivered: boolean;
    deliveredAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
