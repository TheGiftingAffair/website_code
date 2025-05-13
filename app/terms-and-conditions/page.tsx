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
            <h1 className="text-3xl font-bold text-headline">
              Terms and Conditions
            </h1>
            <Link href="/" className="text-bg4 hidden md:block hover:text-bg3">
              Back to Home
            </Link>
          </div>

          <div className="prose max-w-none text-justify">
            <h2 className="text-xl font-semibold mb-4 text-headline">
              1. Introduction
            </h2>
            <p className="mb-4">
              www.thegiftingaffair.com website is operated by The Gifting
              Affair. Throughout the site, the terms "we", "us" and "our" refer
              to The Gifting Affair. We are registered in Singapore under the
              Business Registration Number 53487618L and registered office
              address is 12 Woodlands Square #13-79 Woods Square, Singapore
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

            <h2 className="text-xl font-semibold mb-4 text-headline">
              2. Definitions
            </h2>
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

            <h2 className="text-xl font-semibold mb-4 text-headline">
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

            <h2 className="text-xl font-semibold mb-4 text-headline">
              4. Product Descriptions and Availability
            </h2>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">
                <strong>Product Descriptions:</strong> While we strive to ensure
                that product descriptions, images, and prices do match as
                displayed on the website, some variations may occur due to
                packaging changes, product availability or any other unforeseen
                reasons. We will try our best to notify you of any major change
                done in your hamper.
              </li>
              <li className="mb-2">
                <strong>Availability:</strong> While we attempt to keep our
                website up-to-date, products may become unavailable or go out of
                stock. If an item you ordered goes out of stock, we will inform
                you, offer alternatives or arrange for a refund. Refund, if any,
                will require 5 to 10days time to process and will be made to the
                original payment mode.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-headline">
              5. Purchase of Alcohol
            </h2>
            <p className="mb-4">
              It is an offence to supply alcohol to or obtain alcohol on behalf
              of a person under the age of 18 years. While we take all measures
              to abide by the rules, it's your responsibility to declare your
              eligibility for any purchase containing alcohol.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-headline">
              6. Shipping and Delivery
            </h2>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">
                <strong>Delivery Areas:</strong> We currently deliver to all
                areas in Singapore. All delivery timings are subjected to
                traffic and weather conditions and any other unforeseen
                situation.
              </li>
              <li className="mb-2">
                <strong>Delivery Schedule:</strong> Deliveries are made between
                9 AM to 9 PM on the selected delivery date. We will try our best
                to accommodate specific timing requests but we cannot guarantee
                exact delivery timings.
              </li>
              <li className="mb-2">
                <strong>Delivery Charges:</strong> Standard delivery fees apply
                for all orders. Additional charges may apply for urgent
                deliveries or specific time slot requests.
              </li>
              <li className="mb-2">
                <strong>Undelivered Items:</strong> If no one is available to
                receive the delivery at the provided address, we will attempt to
                contact the recipient. A redelivery fee may apply for subsequent
                delivery attempts.
              </li>
              <li className="mb-2">
                <strong>Shipping Policy:</strong> We ship to Singapore only.
                Delivery times may vary depending on the shipping address. You
                will be provided with an estimated delivery date at checkout. We
                will make reasonable efforts to meet delivery deadlines, but
                some delays may occur due to unforeseen circumstances.
              </li>
              <li className="mb-2">
                <strong>Shipping Charges:</strong> Most of our hampers come with
                free delivery where no shipping charges are applied. However, in
                case of hampers having shipping charges, shipping costs will be
                calculated during checkout and will be added to the total price
                of your order. You will see the applicable charges before
                finalizing your purchase.
              </li>
              <li>
                <strong>Risk of Loss:</strong> Once the product is delivered to
                the shipping address, the risk of any loss passes to the
                customer. We are not responsible for any lost, stolen, or
                damaged items once they are delivered.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-headline">
              7. Returns, Refunds, and Cancellations
            </h2>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">
                <strong>Return Policy:</strong> Your purchase is final and
                non-refundable. Subject to the other Term and Conditions, no
                product or service may be refundable.
              </li>
              <li className="mb-2">
                <strong>Damaged/Defective Products:</strong> Incase your hamper
                or its contents arrive damaged or faulty, we accept returns only
                within 3 days of receipt of the hamper. We will require
                photos/videos so that we can better understand the extent of the
                damage or issues with the product.
              </li>
              <li className="mb-2">
                Please contact our customer support team @ +65 87430520 to
                initiate a return. You'll also need the receipt or proof of
                purchase. To start a return, you can contact us at
                info@thegiftingaffair.com. If your return is accepted, we'll
                send instructions on how and where to send your package.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-headline">
              8. Refund Policy
            </h2>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">
                Refunds will only be processed for damaged items or orders
                cancelled before processing begins.
              </li>
              <li className="mb-2">
                Refunds will be processed through the original payment method
                and may take 5-10 business days to reflect.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-headline">
              9. Order Cancellation
            </h2>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">
                Orders can be cancelled free of charge only if the order has not
                been processed.
              </li>
              <li className="mb-2">
                For orders that have begun processing, cancellation charges may
                apply.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4 text-headline">
              10. Privacy and Data Protection
            </h2>
            <p className="mb-4">
              Your privacy is important to us. Please refer to our Privacy
              Policy for details on how we collect, use, and protect your
              personal information.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-headline">
              11. Intellectual Property
            </h2>
            <p className="mb-4">
              All content on this website, including images, text, logos, and
              designs, is the intellectual property of The Gifting Affair and
              protected by copyright laws.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-headline">
              12. Limitation of Liability
            </h2>
            <p className="mb-4">
              The Gifting Affair shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting
              from your use of our services.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-headline">
              13. Governing Law and Jurisdiction
            </h2>
            <p className="mb-4">
              These terms and conditions shall be governed by and construed in
              accordance with the laws of Singapore. Any disputes shall be
              subject to the exclusive jurisdiction of the courts of Singapore.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-headline">
              14. Modifications to Terms
            </h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting on the website.
              Continued use of our services constitutes acceptance of the
              modified terms.
            </p>

            <h2 className="text-xl font-semibold mb-4 text-headline">
              15. Contact Information
            </h2>
            <p className="mb-4">
              For any questions, concerns, or inquiries regarding these Terms
              and Conditions, please contact us at:
            </p>
            <p className="mb-4 font-semibold">
              Email: info@thegiftingaffair.com
              <br />
              Phone: +65 87430520
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
