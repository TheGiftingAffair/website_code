import React from "react";
import Link from "next/link";
import Navbar from "../components/Ṇavbar/Navbar";
import Footer from "../components/Footer";

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Terms and Conditions
            </h1>
            <Link href="/" className="text-bg4 hover:text-bg3">
              Back to Home
            </Link>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="mb-4">
              www.thegiftingaffair.com website is operated by The Gifting
              Affair. Throughout the site, the terms "we", "us" and "our" refer
              to The Gifting Affair. We are registered in Singapore under the
              Business Registration Number 53487618L and registered office
              address is 12Woodlands Square #13-79 Woods Square, Singapore
              737715.
            </p>
            <p className="mb-4">
              By accessing or placing an order using our website at
              www.thegiftingaffair.com, you agree to comply with and be bound by
              these Terms and Conditions. These Terms govern the use of our
              website and services, including the purchase of hampers and
              related products. If you do not agree with these Terms and
              conditions of this agreement, then you may not be able to purchase
              from the website or use any of our services.
            </p>

            <h2 className="text-xl font-semibold mb-4">2. Definitions</h2>
            <ul className="list-disc pl-5 mb-4">
              <li>
                "Customer" refers to any individual or entity who purchases
                products from The Gifting Affair.
              </li>
              <li>
                "Products" means the hampers, items, or goods offered for sale
                on our website.
              </li>
              <li>
                "Services" refers to the various services we provide, including
                ordering, payment processing, delivery, and customer support.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">
              3. Ordering and Payment
            </h2>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">
                <strong>Order Process:</strong> To place an order, you must
                follow the checkout process on our website. Once your order is
                placed, you will receive an order confirmation email. Please
                ensure all details including shipping address, payment method,
                and product choices are accurate.
              </li>
              <li className="mb-2">
                <strong>Pricing:</strong> All prices displayed on our website
                are in Singapore dollars and are inclusive of any applicable
                taxes, unless otherwise stated. Prices may change at any time
                without notice, but the price at the time of purchase is the
                price you will be charged.
              </li>
              <li className="mb-2">
                <strong>Payment:</strong> All payments are processed securely
                through Hit Pay payment gateway. You agree to provide accurate
                payment information when making a purchase. We reserve the right
                to refuse or cancel any order if payment is declined or fraud is
                suspected.
              </li>
              <li>
                <strong>Order Confirmation:</strong> A confirmation email will
                be sent once your payment is successfully processed, signifying
                that your order has been received and is being processed. Please
                note that an order confirmation does not guarantee product
                availability.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">
              4. Order and Delivery
            </h2>
            <ul className="list-disc pl-5 mb-4">
              <li>
                All orders are subject to availability and confirmation of the
                order price.
              </li>
              <li>Delivery times shown are estimates and not guaranteed.</li>
              <li>
                We reserve the right to refuse or cancel any orders at our
                discretion.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">
              5. Pricing and Payment
            </h2>
            <p className="mb-4">
              All prices are in Singapore Dollars (SGD) and include GST where
              applicable. Payment must be received in full before orders are
              processed.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              6. Cancellation and Refunds
            </h2>
            <p className="mb-4">
              Orders can be cancelled up to 24 hours before the scheduled
              delivery date. Refunds will be processed according to our refund
              policy.
            </p>

            <h2 className="text-xl font-semibold mb-4">7. Privacy Policy</h2>
            <p className="mb-4">
              Your personal information will be handled according to our privacy
              policy. We protect your data and only use it for order processing
              and delivery.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              8. Contact Information
            </h2>
            <p className="mb-4">
              For any questions or concerns regarding these terms, please
              contact us at:
              <br />
              Email: support@thegiftingaffair.com
              <br />
              Phone: +65 XXXX XXXX
            </p>

            <div className="mt-8 text-sm text-gray-600">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
