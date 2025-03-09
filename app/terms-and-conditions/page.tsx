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
            <h2 className="text-xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing and placing an order with The Gifting Affair, you
              confirm that you agree to be bound by these Terms and Conditions.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              2. Order and Delivery
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
              3. Pricing and Payment
            </h2>
            <p className="mb-4">
              All prices are in Singapore Dollars (SGD) and include GST where
              applicable. Payment must be received in full before orders are
              processed.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              4. Cancellation and Refunds
            </h2>
            <p className="mb-4">
              Orders can be cancelled up to 24 hours before the scheduled
              delivery date. Refunds will be processed according to our refund
              policy.
            </p>

            <h2 className="text-xl font-semibold mb-4">5. Privacy Policy</h2>
            <p className="mb-4">
              Your personal information will be handled according to our privacy
              policy. We protect your data and only use it for order processing
              and delivery.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              6. Contact Information
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
