"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createOrder, createGuestOrder } from '@/utils/orderService';
import { toast } from 'react-hot-toast';

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processOrder = async () => {
      try {
        const reference = searchParams.get('reference');
        const status = searchParams.get('status');

        console.log('Payment status:', status);
        console.log('Reference:', reference);

        // Get stored order data - try multiple storage keys
        let storedData = localStorage.getItem('pendingOrderData');
        if (!storedData) {
          // Try sessionStorage as fallback
          storedData = sessionStorage.getItem('pendingOrderData');
        }

        console.log('Stored order data:', storedData);

        if (!storedData) {
          console.error('No order data found in storage');
          toast.error('Order data not found');
          router.push('/checkout');
          return;
        }

        const { orderData } = JSON.parse(storedData);

        // Create the order
        let orderId;
        try {
          if (orderData.customerType === 'registered' && orderData.userId) {
            orderId = await createOrder(orderData);
          } else {
            orderId = await createGuestOrder(orderData);
          }

          // Clear both storage locations
          localStorage.removeItem('pendingOrderData');
          sessionStorage.removeItem('pendingOrderData');

          // Send confirmation email
          await fetch('/api/send-order-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId,
              orderData,
            }),
          });

          // Redirect to order success page
          router.push(`/order-success?orderId=${orderId}`);
        } catch (error) {
          console.error('Error creating order:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error processing order:', error);
        toast.error('Failed to process order');
        router.push('/checkout');
      }
    };

    processOrder();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bg4 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing your order...</p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
