import { db } from '@/firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Coupon } from '@/types/coupon';

export const validateCoupon = async (
  code: string, 
  cartTotal: number, 
  userEmail?: string,
  productIds?: string[] // New parameter for product-specific coupons
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

    // Fix: Check if user cap is reached - Count UNIQUE emails, not total usage
    if (couponData.usersused && couponData.usersused.length > 0) {
      // Get unique emails that have used this coupon
      const uniqueUsersUsed = [...new Set(couponData.usersused)];
      
      if (uniqueUsersUsed.length >= couponData.Userscap) {
        // If user is already in the list, they can still use it up to maxUses
        if (userEmail && uniqueUsersUsed.includes(userEmail)) {
          // Continue to the next checks - will check individual usage limit below
        } else {
          // New user trying to use the coupon when user cap is reached
          return {
            isValid: false,
            discount: 0,
            message: 'This coupon has reached its maximum number of unique users',
          };
        }
      }
    }

    // Check if coupon is limited to specific products
    if (productIds && couponData.product && couponData.product.length > 0) {
      // Check if any of the cart items match the allowed products
      const hasValidProduct = productIds.some(id => 
        couponData.product.includes(id)
      );
      
      if (!hasValidProduct) {
        return {
          isValid: false,
          discount: 0,
          message: 'This coupon is only valid for specific products',
        };
      }
    }

    // Check if user email is provided
    if (userEmail) {
      // Only check limitedToUsers if there are actual email addresses in the array
      const hasLimitedUsers = couponData.limitedToUsers && 
                             couponData.limitedToUsers.some(email => email.trim() !== "");
      
      if (hasLimitedUsers && !couponData.limitedToUsers.includes(userEmail)) {
        return {
          isValid: false,
          discount: 0,
          message: 'This coupon is not valid for your account',
        };
      }

      // Check individual user usage limit
      const userUseCount = couponData.usersused ? 
        couponData.usersused.filter(email => email === userEmail).length : 0;

      if (userUseCount >= couponData.maxUses) {
        return {
          isValid: false,
          discount: 0,
          message: `You have reached the maximum uses (${couponData.maxUses}) for this coupon`,
        };
      }
    }

    // Calculate discount based on coupon type
    let discount = 0;
    if (couponData.type === 'Flat') {
      // For flat discount, use the direct value
      discount = Math.min(couponData.discountvalue, cartTotal); // Ensure discount doesn't exceed cart total
    } else if (couponData.type === 'Percentage') {
      // For percentage discount, calculate the percentage of cart total
      discount = Math.min((cartTotal * couponData.discountvalue) / 100, cartTotal);
    }

    // Round discount to 2 decimal places
    discount = Math.round(discount * 100) / 100;

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

// This function will be handled by the applyCouponUsage in orderService.ts now
export const applyCoupon = async (code: string, userEmail: string) => {
  try {
    const couponRef = doc(db, 'coupons', code.toUpperCase());
    await updateDoc(couponRef, {
      usersused: arrayUnion(userEmail)
    });
  } catch (error) {
    console.error('Error applying coupon:', error);
    throw new Error('Error applying coupon');
  }
};
