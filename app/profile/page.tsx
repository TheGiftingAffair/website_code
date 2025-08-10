"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData, updateUserData } from "@/utils/userService";
import { UserData } from "@/types/user";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { getOrdersByUser } from "@/utils/orderService";
import { getProductById } from "@/utils/productService";
import { IoArrowBack } from "react-icons/io5";
import {
  FaHome,
  FaEdit,
  FaUser,
  FaMapMarkerAlt,
  FaShoppingBag,
} from "react-icons/fa";
import Navbar from "../components/Ṇavbar/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import {
  validateField,
  validateAllFields,
  ValidationErrors,
} from "@/utils/validationUtils";

interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [enrichedOrders, setEnrichedOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
    if (user) {
      fetchUserData();
    }
  }, [user, loading]);

  const fetchUserData = async () => {
    if (user) {
      const data = await getUserData(user.uid);
      if (data) {
        setUserData(data);
        setAddress({
          street: data.shippingAddress?.street || "",
          city: data.shippingAddress?.city || "",
          state: data.shippingAddress?.state || "",
          postalCode: data.shippingAddress?.postalCode || "",
          phone: data.phoneNumber || "",
        });

        // Fetch orders and enrich with product details
        const userOrders = await getOrdersByUser(user.uid);
        const enriched = await Promise.all(
          userOrders.map(async (order) => {
            const enrichedItems = await Promise.all(
              order.items.map(async (item) => {
                const product = await getProductById(item.productId);
                return {
                  ...item,
                  price: product?.price || 0,
                  image: product?.image, // Remove placeholder fallback
                };
              })
            );
            return { ...order, items: enrichedItems };
          })
        );
        setEnrichedOrders(enriched);
      }
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field
    if (["street", "phone", "postalCode"].includes(name)) {
      const error = validateField(name, value);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const errors = validateAllFields({
      street: address.street,
      phone: address.phone,
      postalCode: address.postalCode,
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (user) {
      await updateUserData(user.uid, {
        phoneNumber: address.phone,
        shippingAddress: {
          street: address.street,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
        },
      });
      setIsEditing(false);
      await fetchUserData();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getStatusDisplay = (order: any) => {
    // If order is cancelled
    if (order.orderCancelled) {
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        text: "Cancelled",
      };
    }

    // If order is delivered
    if (order.tracking?.isDelivered) {
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        text: "Delivered",
      };
    }

    // If both payment and order are confirmed
    if (order.orderStatus?.adminConfirmed && order.orderStatus?.userConfirmed) {
      return {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        text: "Order Processing",
      };
    }

    // If payment is confirmed but order is not yet confirmed by admin
    if (
      order.paymentStatus?.adminConfirmed &&
      order.paymentStatus?.userConfirmed &&
      !order.orderStatus?.adminConfirmed
    ) {
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        text: "Payment Confirmed, Order Processing",
      };
    }

    // If payment is not yet confirmed by admin
    if (!order.paymentStatus?.adminConfirmed) {
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Order Confirmation Pending",
      };
    }

    // Default status
    return {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      text: "Delivery Pending",
    };
  };

  const renderOrderStatus = (order: any) => {
    const { color, text } = getStatusDisplay(order);
    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-medium border ${color}`}
      >
        {text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg1/30 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-headline/20 border-t-headline"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg1/30 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-r from-headline to-purple-600 rounded-2xl shadow-lg">
              <FaUser className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 font-mont">
                Hi! {userData?.firstName || "User"}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account and orders
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full lg:w-auto"
          >
            Logout
          </button>
        </div>

        {/* Enhanced User Info Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-headline/10 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <FaUser className="text-headline text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">
              Account Information
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-gray-500 font-medium uppercase text-xs tracking-wide">
                Full Name
              </p>
              <p className="text-xl font-semibold text-gray-800 break-words">
                {userData?.firstName} {userData?.lastName}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-500 font-medium uppercase text-xs tracking-wide">
                Email Address
              </p>
              <p className="text-xl font-semibold text-gray-800 break-words">
                {userData?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Address Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-headline/10 hover:shadow-2xl transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-headline text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">
                Delivery Address
              </h2>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 text-headline hover:text-purple-700 transition-colors bg-headline/10 hover:bg-headline/20 px-4 py-2 rounded-lg"
            >
              <FaEdit size={16} />
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="Street Address"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-headline/50 ${
                      fieldErrors.street
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-headline"
                    }`}
                  />
                  {fieldErrors.street && (
                    <p className="text-red-500 text-sm font-medium">
                      {fieldErrors.street}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">
                    Example: #01-01, 123 Smith Street, Singapore
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    placeholder="Phone Number"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-headline/50 ${
                      fieldErrors.phone
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-headline"
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-sm font-medium">
                      {fieldErrors.phone}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">
                    Singapore mobile number only
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-headline/50 focus:border-headline transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-700 font-medium">Region</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="Region"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-headline/50 focus:border-headline transition-all duration-300"
                  />
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <label className="text-gray-700 font-medium">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleAddressChange}
                    placeholder="Postal Code"
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-headline/50 ${
                      fieldErrors.postalCode
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-headline"
                    }`}
                  />
                  {fieldErrors.postalCode && (
                    <p className="text-red-500 text-sm font-medium">
                      {fieldErrors.postalCode}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">
                    6-digit Singapore postal code
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-headline to-purple-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-purple-600 hover:to-headline transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <p className="text-gray-800 text-lg font-medium">
                {address.street}
              </p>
              <p className="text-gray-700">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-gray-700">Phone: {address.phone}</p>
            </div>
          )}
        </div>

        {/* Enhanced Orders Section */}
        <div className="flex items-center gap-3 mb-8">
          <FaShoppingBag className="text-headline text-2xl" />
          <h2 className="text-3xl font-bold text-gray-800">Your Orders</h2>
        </div>

        <div className="space-y-6">
          {enrichedOrders.length > 0 ? (
            enrichedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-headline/10 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-gray-800">
                      Order #{order.id}
                    </p>
                    <p className="text-gray-600">
                      {order.createdAt.toDate().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    {renderOrderStatus(order)}
                    <p className="text-2xl font-bold text-headline">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all duration-300"
                      >
                        {item.image && (
                          <Link href={`/product/${item.productId}`}>
                            <div className="cursor-pointer transform hover:scale-110 transition-transform duration-300 group">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-xl shadow-md group-hover:shadow-lg"
                              />
                            </div>
                          </Link>
                        )}
                        <div className="flex-1">
                          <Link href={`/product/${item.productId}`}>
                            <p className="font-semibold text-gray-800 hover:text-headline cursor-pointer transition-colors line-clamp-2">
                              {item.name}
                            </p>
                          </Link>
                          <p className="text-gray-600 font-medium">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.tracking?.isShipped && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="bg-gradient-to-r from-purple-50 to-headline/10 rounded-xl p-6 border border-headline/20">
                      <p className="text-headline font-bold text-lg mb-2">
                        Tracking Number: {order.tracking.trackingNumber}
                      </p>
                      {order.tracking.shippedAt && (
                        <p className="text-purple-700 font-medium">
                          Shipped on:{" "}
                          {order.tracking.shippedAt
                            .toDate()
                            .toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-headline/10">
              <div className="text-gray-500 text-lg mb-6">No orders found</div>
              <button
                onClick={() => router.push("/products")}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-headline to-purple-600 font-bold text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-headline transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Shopping
                <BsArrowUpRightCircleFill size={24} />
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
