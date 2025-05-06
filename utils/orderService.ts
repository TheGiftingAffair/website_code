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
    specialRequest: item.specialRequest || null
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
  
  const timestamp = date.getMilliseconds().toString().padStart(4, '0');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomPart = '';
  
  for (let i = 0; i < 3; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  const orderId = `TGA${datePart}${timestamp}${randomPart}`;
  
  const orderRef = doc(db, 'orders', orderId);
  const orderDoc = await getDoc(orderRef);
  
  if (orderDoc.exists()) {
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
      items: cleanItemsData(orderData.items),
      deliveryDate,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      coupon: orderData.coupon ? {
        code: orderData.coupon.code,
        type: orderData.coupon.type,
        value: orderData.coupon.value,
        discount: orderData.coupon.discount,
        name: orderData.coupon.name,
      } : null,
      subtotal: Number(orderData.subtotal) || 0,
      total: Number(orderData.total) || 0,
      orderCancelled: false,
      specialInstructions: orderData.specialInstructions || null,
      orderStatus: {
        userConfirmed: false,
        adminConfirmed: false,
        paymentStatus: 'pending'
      },
      tracking: {
        isDelivered: false
      },
      createdAt: now,
      updatedAt: now,
    });

    const orderRef = doc(db, 'orders', orderId);
    await setDoc(orderRef, orderDoc);

    if (orderData.userId && orderData.userId !== 'guest') {
      const userData = await getUserData(orderData.userId);
      if (userData) {
        await updateUserData(orderData.userId, {
          orderIds: [...(userData.orderIds || []), orderId]
        });
      }
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
      customerType: 'guest',
      items: cleanItemsData(orderData.items),
      deliveryDate,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      coupon: orderData.coupon ? {
        code: orderData.coupon.code,
        type: orderData.coupon.type,
        value: orderData.coupon.value,
        discount: orderData.coupon.discount,
        name: orderData.coupon.name,
      } : null,
      subtotal: Number(orderData.subtotal) || 0,
      total: Number(orderData.total) || 0,
      orderCancelled: false,
      specialInstructions: orderData.specialInstructions || null,
      orderStatus: {
        userConfirmed: false,
        adminConfirmed: false,
        paymentStatus: 'pending'
      },
      tracking: {
        isDelivered: false
      },
      createdAt: now,
      updatedAt: now,
    });

    const orderRef = doc(db, 'orders', customOrderId);
    await setDoc(orderRef, orderDoc);
    
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

export const confirmPayment = async (orderId: string, paymentId?: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }

    const updateData: any = {
      'orderStatus.userConfirmed': true,
      'orderStatus.paymentStatus': 'completed',
      'orderStatus.confirmedAt': getSingaporeTime(),
      updatedAt: getSingaporeTime()
    };
    
    // Add payment reference if provided
    if (paymentId) {
      updateData['orderStatus.hitpayReference'] = paymentId;
    }

    await updateDoc(orderRef, updateData);
    console.log(`Payment confirmed for order: ${orderId}`);

    return true;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

export const updateOrderPaymentReference = async (orderId: string, paymentId: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }

    await updateDoc(orderRef, {
      'orderStatus.hitpayReference': paymentId,
      updatedAt: getSingaporeTime()
    });

    console.log(`Updated order ${orderId} with payment reference ${paymentId}`);
    return true;
  } catch (error) {
    console.error('Error updating payment reference:', error);
    throw error;
  }
};

export const cleanupAbandonedOrders = async () => {
  try {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);
    
    const ordersQuery = query(
      collection(db, 'orders'),
      where('orderStatus.paymentStatus', '==', 'pending'),
      where('createdAt', '<', cutoffTime)
    );
    
    const pendingOrders = await getDocs(ordersQuery);
    
    const batch = db.batch();
    pendingOrders.forEach(doc => {
      const orderRef = doc.ref;
      batch.update(orderRef, { 
        'orderStatus.paymentStatus': 'abandoned',
        'orderCancelled': true,
        updatedAt: getSingaporeTime()
      });
    });
    
    await batch.commit();
    console.log(`Marked ${pendingOrders.size} orders as abandoned`);
  } catch (error) {
    console.error('Error cleaning up abandoned orders:', error);
  }
};
