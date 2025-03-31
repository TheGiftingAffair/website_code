"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { updateOrderStatus } from '@/utils/orderService';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processOrder = async () => {
      try {
        const reference = searchParams.get('reference');
        const status = searchParams.get('status');

        console.log('Payment callback received:', { reference, status });

        if (status !== 'completed') {
          console.log('Payment was not completed:', status);
          toast.error('Payment was not successful. Please try again.');
          // Clear stored data as payment was not completed
          localStorage.removeItem('pendingOrderData');
          sessionStorage.removeItem('pendingOrderData');
          // Redirect back to checkout
          router.push('/checkout');
          return;
        }

        // Get stored order data
        let storedData = localStorage.getItem('pendingOrderData');
        if (!storedData) {
          storedData = sessionStorage.getItem('pendingOrderData');
        }

        if (!storedData) {
          console.error('No order data found in storage');
          toast.error('Order data not found. Please try again.');
          router.push('/checkout');
          return;
        }

        const { orderData, orderId } = JSON.parse(storedData);

        // Update order with HitPay reference
        try {
          // Update order status and add HitPay reference
          await updateOrderStatus(orderId, 'confirmed', {
            hitpayReference: reference,
            paymentStatus: {
              userConfirmed: true,
              adminConfirmed: true,
              confirmedAt: new Date()
            }
          });

          // Send confirmation email
          await fetch('/api/send-order-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              orderId,
              orderData,
              hitpayReference: reference 
            }),
          });

          // Clear storage after confirmation
          localStorage.removeItem('pendingOrderData');
          sessionStorage.removeItem('pendingOrderData');

          // Redirect to success page with our order ID
          router.push(`/order-success?orderId=${orderId}`);
        } catch (error) {
          console.error('Error updating order:', error);
          throw error;
        }

      } catch (error) {
        console.error('Error processing order:', error);
        toast.error('Failed to process order. Please try again.');
        router.push('/checkout');
      } finally {
        setIsProcessing(false);
      }
    };

    processOrder();
  }, [searchParams, router]);

  // Show different messages based on payment status
  const status = searchParams.get('status');
  if (!isProcessing && status !== 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Payment was not successful</div>
          <p className="text-gray-600 mb-4">Please try your purchase again.</p>
          <Link href="/checkout" className="text-blue-600 hover:underline">
            Return to Checkout
          </Link>
        </div>
      </div>
    );
  }

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
