import React from "react";
import Link from "next/link";
import Navbar from "../components/Ṇavbar/Navbar";
import Footer from "../components/Footer";

const ReturnRefundPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-headline">
              Returns, Refunds, and Cancellations
            </h1>
            <Link href="/" className="text-bg4 hover:text-bg3">
              Back to Home
            </Link>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-lg font-medium mb-2 text-headline">
              Return Policy:
            </h3>
            <p className="mb-4">
              Your purchase is final and non-refundable. Subject to the other
              Term and Conditions, no product or service may be refundable.
            </p>

            <h3 className="text-lg font-medium mb-2">
              Damaged/Defective Products
            </h3>
            <p className="mb-4">
              Incase your hamper or its contents arrive damaged or faulty, we
              accept returns only within 3 days of receipt of the hamper. We
              will require photos/videos so that we can better understand the
              extent of the damage or issues with the product.
            </p>
            <p className="mb-4">
              Please contact our customer support team @ +65 87430520 to
              initiate a return. You'll also need the receipt or proof of
              purchase.
            </p>
            <p className="mb-4">
              To start a return, you can contact us at
              info@thegiftingaffair.com. If your return is accepted, we'll send
              instructions on how and where to send your package. Items sent
              back to us without first requesting a return will not be accepted.
            </p>

            <h3 className="text-lg font-medium mb-2 text-headline">
              Refund Policy:
            </h3>
            <p className="mb-2">
              We are not responsible and do not guarantee refund for cases
              where:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>
                Hampers delivered to incorrect addresses supplied by the
                customer.
              </li>
              <li>
                Unsuccessful deliveries due to the recipient not being present
                at the address and day of delivery.
              </li>
              <li>Hampers returned due to an incorrect delivery address.</li>
              <li>
                Improper handling or damage caused to the hamper by the
                recipient.
              </li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-headline">
              Cancellations:
            </h3>
            <p className="mb-4">
              Orders can be cancelled up to 48 hours before the scheduled
              delivery date. Please contact customer support as soon as possible
              to cancel.
            </p>

            {/* <div className="mt-8 text-sm text-gray-600">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ReturnRefundPolicy;
