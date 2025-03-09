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
import { FaHome } from "react-icons/fa";
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
    if (!order.paymentStatus?.adminConfirmed) {
      return {
        color: "yellow",
        text: "Payment Pending Verification",
      };
    }

    if (order.tracking?.isDelivered) {
      return {
        color: "green",
        text: "Delivered",
      };
    }

    return {
      color: "blue",
      text: "Delivery Pending",
    };
  };

  const renderOrderStatus = (order: any) => {
    const { color, text } = getStatusDisplay(order);
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm bg-${color}-100 text-${color}-800`}
      >
        {text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-bg1/50 to-white">
      <Navbar />
      {/* Navigation Controls */}
      <div className="bg-[#f9f9f9] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <IoArrowBack size={20} />
            <span>Back</span>
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <FaHome size={20} />
            <span>Home</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            User Profile
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto"
          >
            Logout
          </button>
        </div>

        {/* User Info Section */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 transition-all hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium break-words">
                {userData?.firstName} {userData?.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium break-words">{userData?.email}</p>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 transition-all hover:shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Delivery Address</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-800"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="Street Address"
                    className={`border p-2 rounded w-full ${
                      fieldErrors.street ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.street && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.street}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    Example: #01-01, 123 Smith Street, Singapore
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    placeholder="Phone Number"
                    className={`border p-2 rounded w-full ${
                      fieldErrors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.phone}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    Singapore mobile number only
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="Region"
                    className="border p-2 rounded w-full"
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="postalCode"
                    value={address.postalCode}
                    onChange={handleAddressChange}
                    placeholder="Postal Code"
                    className={`border p-2 rounded w-full ${
                      fieldErrors.postalCode ? "border-red-500" : ""
                    }`}
                  />
                  {fieldErrors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.postalCode}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    6-digit Singapore postal code
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-1">
              <p className="text-gray-700">{address.street}</p>
              <p className="text-gray-700">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-gray-700">Phone: {address.phone}</p>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Orders</h2>
        <div className="space-y-4">
          {enrichedOrders.length > 0 ? (
            enrichedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row justify-between mb-4">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-gray-600 text-sm">
                      {order.createdAt.toDate().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    {renderOrderStatus(order)}
                    <p className="font-medium mt-2">Total: ${order.total}</p>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
                      >
                        {item.image && (
                          <Link href={`/product/${item.productId}`}>
                            <div className="cursor-pointer transform hover:scale-105 transition-transform duration-200">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg hover:shadow-md"
                              />
                            </div>
                          </Link>
                        )}
                        <div>
                          <Link href={`/product/${item.productId}`}>
                            <p className="font-medium text-gray-800 hover:text-purple-600 cursor-pointer">
                              {item.name}
                            </p>
                          </Link>
                          <p className="text-gray-600">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {order.tracking?.isShipped && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-purple-800 font-medium">
                        Tracking Number: {order.tracking.trackingNumber}
                      </p>
                      {order.tracking.shippedAt && (
                        <p className="text-purple-600">
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
            <div className="text-center flex items-center flex-col bg-white rounded-xl shadow-md p-8">
              <div className="text-gray-500">No orders found</div>
              <button
                onClick={() => router.push("/products")}
                className="mt-4 flex flex-row items-center justify-center gap-2 bg-headline/90 font-semibold font-mont text-white px-6 py-3 rounded-lg hover:bg-headline transition-colors"
              >
                Start Shopping
                <BsArrowUpRightCircleFill size={30} />
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
