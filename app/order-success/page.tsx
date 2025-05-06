"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOrderById } from "@/utils/orderService";
import { getProductById } from "@/utils/productService";
import { Order } from "@/types/order";
import { db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

interface OrderWithProductDetails extends Order {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
    giftMessage?: string;
    productDetails?: {
      image: string;
      name: string;
      // Add other product details as needed
    };
  }>;
}

const OrderSuccessPage = () => {
  const [order, setOrder] = useState<OrderWithProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const BrandLogo = () => (
    <Link href="/" className="flex items-center justify-center space-x-3 mb-8">
      <div className="w-16 h-16 2xl:w-24 2xl:h-24 rounded-full overflow-hidden">
        <Image
          // src="/images/logo.jpg"
          src="/images/logo4.png"
          alt="Logo"
          width={120}
          height={120}
          className="object-cover brightness-110"
        />
      </div>
      {/* <span className="font-macondo font-bold text-2xl text-bg3 hover:text-bg4 transition-colors">
        The Gifting Affair
      </span> */}
    </Link>
  );

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const fetchOrderAndProducts = async () => {
      try {
        const orderData = await getOrderById(orderId);

        // Fetch product details for each item
        const itemsWithProducts = await Promise.all(
          orderData.items.map(async (item) => {
            const productDetails = await getProductById(item.productId);
            return {
              ...item,
              productDetails: productDetails || undefined,
            };
          })
        );

        const orderWithProducts = {
          ...orderData,
          items: itemsWithProducts,
        };

        setOrder(orderWithProducts);

        // Send admin notification email directly from here
        try {
          // Only send if payment is confirmed
          if (orderData.orderStatus?.paymentStatus === "completed") {
            const adminEmail = "pranay.rajvanshi@gmail.com";

            // Create admin email content
            const emailHtml = `
              <div style="font-family: Arial, sans-serif;">
                <h1>New Order Received - Payment Confirmed</h1>
                <p><strong>Order ID:</strong> ${orderData.id}</p>
                <p><strong>Customer:</strong> ${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}</p>
                <p><strong>Email:</strong> ${orderData.shippingAddress.email}</p>
                <p><strong>Phone:</strong> ${orderData.shippingAddress.phone}</p>
                <p><strong>Delivery Date:</strong> ${new Date(orderData.deliveryDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> $${orderData.total.toFixed(2)}</p>
                
                <h2>Items Ordered</h2>
                <ul>
                  ${orderData.items
                    .map(
                      (item) => `
                    <li>
                      ${item.name} - Qty: ${item.quantity} - $${item.price.toFixed(2)}
                      ${
                        item.giftMessage
                          ? `<br><strong>Gift Message:</strong> ${item.giftMessage}`
                          : ""
                      }
                      ${
                        item.specialRequest
                          ? `<br><strong>Special Request:</strong> ${item.specialRequest}`
                          : ""
                      }
                    </li>
                  `
                    )
                    .join("")}
                </ul>
                
                <h2>Shipping Address</h2>
                <p>${orderData.shippingAddress.address}</p>
                <p>${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.pincode}</p>
                
                ${
                  orderData.specialInstructions
                    ? `
                  <h2>Special Instructions</h2>
                  <p>${orderData.specialInstructions}</p>
                `
                    : ""
                }
              </div>
            `;

            // Add email document directly to mail collection
            await addDoc(collection(db, "mail"), {
              to: adminEmail,
              message: {
                subject: `New Order: ${orderData.id} - Payment Confirmed`,
                html: emailHtml,
              },
            });
            console.log("Admin notification email sent for order:", orderData.id);
          }
        } catch (emailError) {
          console.error("Failed to send admin notification:", emailError);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndProducts();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BrandLogo />
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bg4 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BrandLogo />
          <h1 className="text-2xl font-bold text-red-600">Order not found</h1>
          <p className="mt-2 text-gray-600">
            We couldn't find the order you're looking for.
          </p>
          <Link href="/" className="mt-4 inline-block text-bg4 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <BrandLogo />
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold">{order.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order Total:</span>
              <span className="font-semibold">${order.total.toFixed(2)}</span>
            </div>
            {order.shippingMethod && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Method:</span>
                <span className="font-semibold">
                  {order.shippingMethod.name}
                </span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-3">Delivery Address</h2>
            <div className="text-gray-600">
              <p>
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.pincode}
              </p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-semibold text-lg mb-3">Order Summary</h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {item.productDetails?.image ? (
                      <img
                        src={item.productDetails.image}
                        alt={item.productDetails.name || item.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.png";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {item.productDetails?.name || item.name}
                      </p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                      {item.giftMessage && (
                        <p className="text-sm text-gray-500">
                          Gift Message: {item.giftMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">
                $
                {order.items
                  .reduce(
                    (sum, item) =>
                      sum + (item.price || 0) * (item.quantity || 1),
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-semibold">
                ${(order.shippingMethod?.price || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Add this section for discount details */}
          <div className="border-t pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${order.subtotal?.toFixed(2)}</span>
            </div>

            {order.coupon && (
              <div className="flex justify-between text-green-600">
                <span>
                  Discount {order.coupon.name && `(${order.coupon.name})`}:
                </span>
                <span>-${order.coupon.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Shipping:</span>
              <span className="text-green-600">Free</span>
            </div>

            <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
              <span>Total:</span>
              <span>${order.total?.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="bg-bg4 text-white px-6 py-2 rounded hover:bg-bg4/90 text-center"
            >
              View Orders
            </Link>
            <Link
              href="/"
              className="border border-bg4 text-bg4 px-6 py-2 rounded hover:bg-gray-50 text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
