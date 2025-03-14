import { db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Coupon } from '@/types/coupon';

export const validateCoupon = async (
  code: string, 
  cartTotal: number, 
  userEmail?: string
): Promise<{
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

    // Check if coupon is active
    if (!couponData.Active) {
      return { isValid: false, discount: 0, message: 'This coupon is no longer active' };
    }

    // Check minimum order value
    if (cartTotal < couponData.minordervalue) {
      return {
        isValid: false,
        discount: 0,
        message: `Minimum order value should be $${couponData.minordervalue}`,
      };
    }

    // Check if user cap is reached - This limits total number of users
    if (couponData.usersused.filter(email => email !== "").length >= couponData.Userscap) {
      return {
        isValid: false,
        discount: 0,
        message: 'This coupon has reached its maximum usage limit',
      };
    }

    // Check if user email is provided
    if (userEmail) {
      // Only check limitedToUsers if there are actual email addresses in the array
      const hasLimitedUsers = couponData.limitedToUsers.some(email => email.trim() !== "");
      
      if (hasLimitedUsers && !couponData.limitedToUsers.includes(userEmail)) {
        return {
          isValid: false,
          discount: 0,
          message: 'This coupon is not valid for your account',
        };
      }

      // Check individual user usage limit
      const userUseCount = couponData.usersused.filter(
        email => email === userEmail
      ).length;

      if (userUseCount >= couponData.maxUses) {
        return {
          isValid: false,
          discount: 0,
          message: `You have reached the maximum uses (${couponData.maxUses}) for this coupon`,
        };
      }
    }

    // Calculate discount
    const discount = couponData.type === 'Flat' 
      ? couponData.discountvalue 
      : (cartTotal * couponData.discountvalue) / 100;

    return {
      isValid: true,
      discount,
      couponDetails: couponData,
    };
  } catch (error) {
    return { isValid: false, discount: 0, message: 'Error validating coupon' };
  }
};

export const applyCoupon = async (code: string, userEmail: string) => {
  try {
    const couponRef = doc(db, 'coupons', code.toUpperCase());
    await updateDoc(couponRef, {
      usersused: arrayUnion(userEmail)
    });
  } catch (error) {
    throw new Error('Error applying coupon');
  }
};
