import { db } from '@/firebaseConfig';
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy, setDoc } from 'firebase/firestore';
import { Order } from '@/types/order';
import { updateUserData, getUserData } from './userService';

// Add utility functions for date handling
const isValidDate = (date: any): boolean => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

const parseDate = (date: any): Date | null => {
  if (date instanceof Date) return date;
  if (typeof date === 'string' || typeof date === 'number') {
    const parsedDate = new Date(date);
    return isValidDate(parsedDate) ? parsedDate : null;
  }
  return null;
};

// Add utility function to clean data for Firestore
const cleanDataForFirestore = (data: any) => {
  if (data === undefined || data === null) return null;
  if (data instanceof Date) return isValidDate(data) ? data : null;
  if (Array.isArray(data)) return data.map(cleanDataForFirestore);
  if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: cleanDataForFirestore(value),
    }), {});
  }
  return data;
};

const cleanItemsData = (items: any[]) => {
  return items.map(item => ({
    productId: item.productId,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    giftMessage: item.giftMessage || null,
    specialRequest: item.specialRequest || null  // Ensure this is included
  }));
};

const getSingaporeTime = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));
};

export const generateOrderId = async (): Promise<string> => {
  const date = getSingaporeTime();
  const datePart = date.getDate().toString().padStart(2, '0') +
                   (date.getMonth() + 1).toString().padStart(2, '0') +
                   date.getFullYear().toString().slice(-2);
  
  // Use milliseconds for unique timestamp (last 4 digits)
  const timestamp = date.getMilliseconds().toString().padStart(4, '0');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomPart = '';
  
  // Generate exactly 3 random letters
  for (let i = 0; i < 3; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const orderId = `TGA${datePart}${timestamp}${randomPart}`;
  
  // Ensure uniqueness by checking database
  const orderRef = doc(db, 'orders', orderId);
  const orderDoc = await getDoc(orderRef);
  
  if (orderDoc.exists()) {
    // If exists, recursively try again with small delay
    await new Promise(resolve => setTimeout(resolve, 10));
    return generateOrderId();
  }
  
  return orderId;
};

export const getOrdersByIds = async (orderIds: string[]) => {
  try {
    const orders = await Promise.all(
      orderIds.map(async (id) => {
        const orderRef = doc(db, 'orders', id);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          return {
            id: orderSnap.id,
            ...orderSnap.data()
          };
        }
        return null;
      })
    );

    return orders.filter((order): order is NonNullable<typeof order> => order !== null);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const deliveryDate = parseDate(orderData.deliveryDate);
    if (!deliveryDate) {
      throw new Error('Invalid delivery date format');
    }

    const now = getSingaporeTime();
    const orderId = await generateOrderId();
    
    const orderDoc = cleanDataForFirestore({
      userId: orderData.userId,
      items: cleanItemsData(orderData.items), // Use cleanItemsData function
      deliveryDate,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      coupon: orderData.coupon ? {
        code: orderData.coupon.code,
        type: orderData.coupon.type,
        value: orderData.coupon.value,
        discount: orderData.coupon.discount,
        name: orderData.coupon.name, // Add this line
      } : null,
      subtotal: Number(orderData.subtotal) || 0,
      total: Number(orderData.total) || 0,
      orderCancelled : false ,
      specialInstructions: orderData.specialInstructions || null,

      paymentStatus: {
        userConfirmed: true,
        adminConfirmed: true,
      },
      tracking: {
        isDelivered: false
      },
      createdAt: now,
      updatedAt: now,
    });

    const orderRef = doc(db, 'orders', orderId);
    await setDoc(orderRef, orderDoc);

    // Update user's orderIds
    const userData = await getUserData(orderData.userId);
    if (userData) {
      await updateUserData(orderData.userId, {
        orderIds: [...(userData.orderIds || []), orderId]
      });
    }

    // Send admin notification email
    try {
      await fetch('/api/send-admin-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          total: orderData.total,
          subtotal: orderData.subtotal,
          customerName: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
          customerEmail: orderData.shippingAddress.email,
          items: orderData.items,
          deliveryDate: orderData.deliveryDate,
          shippingAddress: orderData.shippingAddress,
          specialInstructions: orderData.specialInstructions
        }),
      });
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      // Don't throw error as order is already created
    }

    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const createGuestOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
  try {
    const deliveryDate = parseDate(orderData.deliveryDate);
    if (!deliveryDate) {
      throw new Error('Invalid delivery date format');
    }

    const now = getSingaporeTime();
    const customOrderId = await generateOrderId();
    
    const orderDoc = cleanDataForFirestore({
      userId: 'guest',
      customerType: 'guest', // Add this field to identify guest orders
      items: cleanItemsData(orderData.items),
      deliveryDate,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      coupon: orderData.coupon ? {
        code: orderData.coupon.code,
        type: orderData.coupon.type,
        value: orderData.coupon.value,
        discount: orderData.coupon.discount,
        name: orderData.coupon.name, // Add this line
      } : null,
      subtotal: Number(orderData.subtotal) || 0,
      total: Number(orderData.total) || 0,
      orderCancelled : false ,
      specialInstructions: orderData.specialInstructions || null,
      paymentStatus: {
        userConfirmed: true,
        adminConfirmed: true,
      },
      tracking: {
        isDelivered: false
      },
      createdAt: now,
      updatedAt: now,
    });

    const orderRef = doc(db, 'orders', customOrderId);
    await setDoc(orderRef, orderDoc);
    
    // Send admin notification email
    try {
      await fetch('/api/send-admin-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: customOrderId,
          total: orderData.total,
          subtotal: orderData.subtotal,
          customerName: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
          customerEmail: orderData.shippingAddress.email,
          items: orderData.items,
          deliveryDate: orderData.deliveryDate,
          shippingAddress: orderData.shippingAddress,
          specialInstructions: orderData.specialInstructions
        }),
      });
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      // Don't throw error as order is already created
    }

    return customOrderId;
  } catch (error) {
    console.error('Error creating guest order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return {
        id: orderSnap.id,
        ...orderSnap.data()
      } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  try {
    if (!userId) {
      console.error('userId is required for getOrdersByUser');
      return [];
    }

    // First try with the indexed query
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const orderSnap = await getDocs(ordersQuery);
      return orderSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error: any) {
      // If index doesn't exist yet, fallback to simple query
      if (error.code === 'failed-precondition') {
        console.warn('Index not ready yet, falling back to simple query');
        const simpleQuery = query(
          collection(db, 'orders'),
          where('userId', '==', userId)
        );
        const orderSnap = await getDocs(simpleQuery);
        return orderSnap.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Order))
          .sort((a, b) => {
            // Client-side sorting as fallback
            const dateA = (a.createdAt as any)?.toDate?.() || new Date(a.createdAt);
            const dateB = (b.createdAt as any)?.toDate?.() || new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status'],
  tracking?: Partial<Order['tracking']>
) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      ...(tracking && { tracking: tracking }),
      updatedAt: getSingaporeTime()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const confirmPayment = async (orderId: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }

    const orderData = orderDoc.data();

    await updateDoc(orderRef, {
      'paymentStatus.adminConfirmed': true,
      'paymentStatus.confirmedAt': getSingaporeTime(),
      status: 'processing',
      updatedAt: getSingaporeTime()
    });

    // Send admin notification about payment confirmation
    try {
      await fetch('/api/send-admin-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          total: orderData.total,
          subtotal: orderData.subtotal,
          customerName: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
          customerEmail: orderData.shippingAddress.email,
          items: orderData.items,
          deliveryDate: orderData.deliveryDate,
          shippingAddress: orderData.shippingAddress,
          specialInstructions: orderData.specialInstructions,
          paymentStatus: 'Payment Confirmed'
        }),
      });
    } catch (error) {
      console.error('Failed to send admin payment confirmation notification:', error);
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};
