import { db } from '@/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export interface Coupon {
  type: 'direct' | 'percentage';
  value: number;
  minValue: number;
}

export const validateCoupon = async (code: string, cartTotal: number): Promise<{
  isValid: boolean;
  discount: number;
  message?: string;
  couponDetails?: Coupon;
}> => {
  try {
    const couponRef = doc(db, 'coupons', code.toUpperCase());
    const couponSnap = await getDoc(couponRef);

    if (!couponSnap.exists()) {
      return { isValid: false, discount: 0, message: 'Invalid coupon code' };
    }

    const couponData = couponSnap.data() as Coupon;

    if (cartTotal < couponData.minValue) {
      return {
        isValid: false,
        discount: 0,
        message: `Minimum order value should be $${couponData.minValue}`,
      };
    }

    const discount = couponData.type === 'direct' 
      ? couponData.value 
      : (cartTotal * couponData.value) / 100;

    return {
      isValid: true,
      discount,
      couponDetails: couponData,
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return { isValid: false, discount: 0, message: 'Error validating coupon' };
  }
};
