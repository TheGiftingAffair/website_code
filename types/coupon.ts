export interface Coupon {
  Active: boolean;  // Changed from 'active' to 'Active'
  Userscap: number; // Changed from 'userscap' to 'Userscap'
  discountvalue: number;
  limitedToUsers: string[];
  maxUses: number;
  minordervalue: number;
  name: string;
  type: "Flat" | "Percentage";
  usersused: string[];
  product?: string[]; // Add product array for product-specific coupons
}
