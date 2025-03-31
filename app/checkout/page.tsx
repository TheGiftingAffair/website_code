"use client";
import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData } from "@/utils/userService";
import { getProductById } from "@/utils/productService";
import { getPlaceholderImage } from "@/utils/placeholderService";
import { validateCoupon, applyCoupon } from "@/utils/couponService";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import DeliveryDateModal from "@/app/components/ui/DeliveryDateModal";

interface ShippingDetails {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface BillingDetails extends ShippingDetails {
  sameAsShipping: boolean;
}

interface ValidationErrors {
  email: string;
  phone: string;
  pincode: string;
  address: string;
}

const CheckoutPage = () => {
  const { items, getSubtotal, clearCart, deliveryDate, setDeliveryDate } =
    useCart();
  const router = useRouter();
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    sameAsShipping: true,
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [specialRequest, setSpecialRequest] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrichedItems, setEnrichedItems] = useState([]);
  const [errors, setErrors] = useState<ValidationErrors>({
    email: "",
    phone: "",
    pincode: "",
    address: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "Flat" | "Percentage";
    value: number;
    discount: number;
    name: string;
  } | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);

  const fetchUserData = async () => {
    if (user) {
      try {
        const userData = await getUserData(user.uid);
        if (userData) {
          setShippingDetails({
            email: userData.email || "",
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            address: userData.shippingAddress?.street || "",
            city: userData.shippingAddress?.city || "",
            state: userData.shippingAddress?.state || "",
            pincode: userData.shippingAddress?.postalCode || "",
            phone: userData.phoneNumber || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  // Effect to check empty cart
  useEffect(() => {
    if (!isSubmitting) {
      setIsLoading(false);
    }
  }, [isSubmitting]);

  // User data effect
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Other existing effects and functions
  useEffect(() => {
    const enrichItems = async () => {
      try {
        const enriched = await Promise.all(
          items.map(async (item) => {
            const product = await getProductById(item.productId);
            return {
              ...item,
              price: product?.price || 0,
              image: product?.image,
            };
          })
        );
        setEnrichedItems(enriched);
      } catch (error) {
        console.error("Error enriching items:", error);
        setEnrichedItems(items);
      }
    };
    enrichItems();
  }, [items]);

  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setBillingDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "email":
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "phone":
        const phoneRegex = /^[689]\d{7}$/;
        if (!phoneRegex.test(value)) {
          error =
            "Please enter a valid Singapore phone number (8 digits starting with 6, 8, or 9)";
        }
        break;

      case "pincode":
        const postalCodeRegex = /^\d{6}$/;
        if (!postalCodeRegex.test(value)) {
          error = "Please enter a valid Singapore postal code (6 digits)";
        }
        break;

      case "address":
        if (value.trim().length < 10) {
          error =
            "Please enter complete address with block/unit number and street name";
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
    if (["email", "phone", "pincode", "address"].includes(name)) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all fields
      const isEmailValid = validateField("email", shippingDetails.email);
      const isPhoneValid = validateField("phone", shippingDetails.phone);
      const isPincodeValid = validateField("pincode", shippingDetails.pincode);
      const isAddressValid = validateField("address", shippingDetails.address);

      if (
        !isEmailValid ||
        !isPhoneValid ||
        !isPincodeValid ||
        !isAddressValid
      ) {
        setIsSubmitting(false);
        return;
      }

      if (!deliveryDate) {
        alert("Please select a delivery date in your cart");
        setIsSubmitting(false);
        return;
      }

      const orderData = {
        userId: user?.uid, // Add userId if user is logged in
        customerType: user ? "registered" : "guest",
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          giftMessage: item.giftMessage || null,
          specialRequest: item.specialRequest || null,
        })),
        deliveryDate,
        shippingAddress: {
          firstName: shippingDetails.firstName,
          lastName: shippingDetails.lastName,
          email: shippingDetails.email,
          phone: shippingDetails.phone,
          address: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          pincode: shippingDetails.pincode,
        },
        billingAddress: billingDetails.sameAsShipping
          ? {
              firstName: shippingDetails.firstName,
              lastName: shippingDetails.lastName,
              email: shippingDetails.email,
              phone: shippingDetails.phone,
              address: shippingDetails.address,
              city: shippingDetails.city,
              state: shippingDetails.state,
              pincode: shippingDetails.pincode,
            }
          : {
              firstName: billingDetails.firstName,
              lastName: billingDetails.lastName,
              email: billingDetails.email,
              phone: billingDetails.phone,
              address: billingDetails.address,
              city: billingDetails.city,
              state: billingDetails.state,
              pincode: billingDetails.pincode,
            },
        specialInstructions: specialRequest.trim() || null,
        subtotal: subtotal,
        total: total,
        coupon: appliedCoupon
          ? {
              code: appliedCoupon.code,
              type: appliedCoupon.type,
              value: appliedCoupon.value,
              discount: appliedCoupon.discount,
              name: appliedCoupon.name, // Make sure to include the coupon name
            }
          : null,
        subtotal: subtotal,
        total: total,
      };

      // Store order data temporarily
      const storageData = JSON.stringify({ orderData });
      localStorage.setItem("pendingOrderData", storageData);
      sessionStorage.setItem("pendingOrderData", storageData);

      // Create payment with HitPay
      try {
        const paymentResponse = await fetch("/api/create-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: total,
            currency: "SGD",
            email: shippingDetails.email,
            name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
            orderData: orderData,
          }),
        });

        if (!paymentResponse.ok) {
          throw new Error("Payment request failed");
        }

        const paymentData = await paymentResponse.json();

        if (!paymentData.url) {
          throw new Error("Payment URL not received in response");
        }

        // Clear cart before redirecting
        clearCart();

        // Redirect to HitPay checkout
        window.location.href = paymentData.url;
      } catch (error) {
        console.error("Payment creation failed:", error);
        toast.error("Failed to initiate payment. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (appliedCoupon) {
      toast.error("You can only apply one coupon at a time");
      return;
    }

    try {
      const result = await validateCoupon(
        couponCode,
        subtotal,
        shippingDetails.email || user?.email
      );

      if (result.isValid && result.couponDetails) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discount: result.discount,
          type: result.couponDetails.type,
          value: result.couponDetails.discountvalue,
          name: result.couponDetails.name,
        });
        setCouponError("");
        toast.success("Coupon applied successfully!");
      } else {
        setCouponError(result.message || "Invalid coupon");
        setAppliedCoupon(null);
        toast.error(result.message || "Invalid coupon");
      }
    } catch (error) {
      setCouponError("Error applying coupon");
      setAppliedCoupon(null);
      toast.error("Error applying coupon");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  };

  const handleDateConfirm = (date: string) => {
    setDeliveryDate(date);
    setShowDateModal(false);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = appliedCoupon?.discount || 0;
  const total = subtotal - discount;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bg4"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold font-alegreya">
            Checkout
          </h1>
          <Link href="/" className="flex items-center space-x-3">
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
            <span className="font-macondo font-bold text-xl text-bg3 hover:text-bg4 transition-colors">
              The Gifting Affair
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Login Section */}
            {!user && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">
                  Want to save your details for future orders?
                </p>
                <button
                  onClick={() => router.push("/auth")}
                  className="text-bg4 font-semibold hover:underline"
                >
                  Login or create an account
                </button>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Contact Information
              </h2>
              <input
                type="email"
                name="email"
                placeholder="Email address (for order confirmation)"
                value={shippingDetails.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
                required
              />
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={shippingDetails.firstName}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={shippingDetails.lastName}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  placeholder="Block/Unit No., Building Name, Street Address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded mt-4 ${
                    errors.address ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Example: #01-01, 123 Smith Street, Singapore
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="Region"
                  value={shippingDetails.state}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Mobile number"
                    value={shippingDetails.phone}
                    onChange={handleInputChange}
                    className={`p-2 border rounded w-full ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    Singapore mobile number only
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Postal Code"
                    value={shippingDetails.pincode}
                    onChange={handleInputChange}
                    className={`p-2 border rounded w-full ${
                      errors.pincode ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.pincode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pincode}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">
                    6-digit Singapore postal code
                  </p>
                </div>
              </div>
            </div>

            {/* Special Request */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Special Request (Optional)
              </h2>
              <textarea
                name="specialRequest"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                className="w-full p-2 border rounded min-h-[100px]"
              />
            </div>

            {/* Billing Address */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Billing Address</h2>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="sameAsShipping"
                    checked={billingDetails.sameAsShipping}
                    onChange={handleBillingInputChange}
                    className="form-checkbox"
                  />
                  <span className="text-sm text-gray-600">
                    Same as shipping address
                  </span>
                </label>
              </div>

              {!billingDetails.sameAsShipping && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={billingDetails.firstName}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={billingDetails.lastName}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={billingDetails.address}
                    onChange={handleBillingInputChange}
                    className="w-full p-2 border rounded mt-4"
                  />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input
                      type="text"
                      name="city"
                      value={billingDetails.city}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="state"
                      value={billingDetails.state}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input
                      type="text"
                      name="pincode"
                      value={billingDetails.pincode}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={billingDetails.phone}
                      onChange={handleBillingInputChange}
                      className="p-2 border rounded"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Add Delivery Date Section */}
              <div className="mb-6 border-b pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-700">
                      Delivery Date
                    </h3>
                    <p className="text-gray-600">
                      {deliveryDate || "No date selected"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDateModal(true)}
                    className="px-3 py-1 text-sm bg-bg3 text-white rounded hover:bg-bg4 transition-colors"
                  >
                    {deliveryDate ? "Change" : "Select"} Date
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-4">
                {enrichedItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {/* Coupon Section */}
                <div className="flex flex-col sm:flex-row gap-2 my-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter coupon code"
                    className="p-2 border rounded w-full sm:w-2/3 uppercase"
                    disabled={appliedCoupon !== null}
                  />
                  {appliedCoupon ? (
                    <button
                      onClick={handleRemoveCoupon}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors w-full sm:w-1/3"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-bg3 text-white rounded hover:bg-bg4 transition-colors w-full sm:w-1/3"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {couponError && (
                  <p className="text-red-500 text-sm break-words">
                    {couponError}
                  </p>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 flex-wrap gap-1">
                    <span className="break-all">
                      {appliedCoupon.code} 
                      ({appliedCoupon.type === 'Flat' 
                        ? `$${appliedCoupon.value}` 
                        : `${appliedCoupon.value}%`} off)
                    </span>
                    <span>-${appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Section */}
              <div className="mt-6">
                {/* Terms and Conditions Checkbox */}
                <div className="w-full flex items-start gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 form-checkbox h-4 w-4 text-green-600 rounded border-gray-300"
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm text-gray-600 flex-1"
                  >
                    I have read and agree to the{" "}
                    <Link
                      href="/terms-and-conditions"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Terms and Conditions
                    </Link>
                  </label>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || !termsAccepted}
                  className={`w-full py-3 rounded-md font-semibold ${
                    !isSubmitting && termsAccepted
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gray-300 cursor-not-allowed text-gray-500"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeliveryDateModal
        isOpen={showDateModal}
        onClose={() => setShowDateModal(false)}
        onConfirm={handleDateConfirm}
      />
    </div>
  );
};

export default CheckoutPage;
