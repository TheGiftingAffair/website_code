export interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  orderIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
