export interface Coupon {
  Active: boolean;  // Changed from 'active' to 'Active'
  Userscap: number; // Changed from 'userscap' to 'Userscap'
  discountvalue: number;
  limitedToUsers: string[];
  maxUses: number;
  minordervalue: number;
  name: string;
  type: string;  // Changed from union type to string
  usersused: string[];
}
