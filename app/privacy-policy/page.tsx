import React from "react";
import Link from "next/link";
import Navbar from "../components/Ṇavbar/Navbar";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <Link href="/" className="text-bg4 hover:text-bg3">
              Back to Home
            </Link>
          </div>

          <div className="prose max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              Effective Date: 14/03/2025
            </p>

            <p className="mb-4">
              At The Gifting Affair ("we," "our," or "us"), we value your
              privacy and are committed to protecting the personal information
              you share with us. This Privacy Policy outlines how we collect,
              use, disclose, and protect your information when you visit our
              website www.thegiftingaffair.com or make a purchase from our
              online store. By using our website or services, you agree to the
              terms of this Privacy Policy.
            </p>
            <p className="mb-4">
              This Privacy Policy is in compliance with the Personal Data
              Protection Act (PDPA) of Singapore.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">
                <strong>Personal Information:</strong> When you make a purchase
                or sign up for our newsletter, we may collect your name, email
                address, mailing address, phone number, payment information, and
                other details necessary to process your order.
              </li>
              <li className="mb-2">
                <strong>Non-Personal Information:</strong> We may collect
                non-personal information about your use of our website, such as
                IP addresses, browser type, operating system, and browsing
                activity.
              </li>
              <li>
                <strong>Cookies and Tracking Technologies:</strong> We use
                cookies and similar technologies to enhance your experience on
                our website.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 mb-4">
              <li>
                To process and fulfill your orders, including payment processing
                and shipping.
              </li>
              <li>
                To communicate with you regarding your order, updates,
                promotions, and customer support.
              </li>
              <li>
                To personalize your experience on our website and offer
                recommendations.
              </li>
              <li>
                To improve our website and services through analytics and
                feedback.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">
              3. How We Protect Your Information
            </h2>
            <p className="mb-4">
              We take the security of your personal information seriously. We
              implement industry-standard security measures to protect against
              unauthorized access, disclosure, alteration, or destruction of
              your personal information. This includes using secure encryption
              methods for payment transactions.
            </p>
            <p className="mb-4">
              However, please note that no method of data transmission over the
              internet or electronic storage is 100% secure, and we cannot
              guarantee absolute security.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              4. Sharing Your Information
            </h2>
            <p className="mb-4">
              We do not sell or rent your personal information to third parties.
              However, we may share your information with third parties in the
              following circumstances:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">
                <strong>Service Providers:</strong> We may share your
                information with trusted service providers who help us fulfill
                orders, process payments, or perform other necessary functions,
                such as shipping carriers and payment processors. These
                providers are obligated to protect your information and use it
                only for the purpose of providing services to us.
              </li>
              <li>
                <strong>Legal Compliance:</strong> We may disclose your
                information if required by law, such as to comply with a
                subpoena, legal request, or regulation, or to protect the
                rights, property, and safety of The Gifting Affair, our
                customers, or others.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">
              5. Your Rights and Choices
            </h2>
            <ul className="list-disc pl-5 mb-4">
              <li className="mb-2">
                <strong>Access and Correction:</strong> You have the right to
                access and update your personal information at any time. If you
                would like to review or correct the personal information we have
                collected about you, please contact us at
                info@thegiftingaffair.com.
              </li>
              <li className="mb-2">
                <strong>Opt-Out of Marketing Communications:</strong> You can
                opt-out of receiving promotional emails from us by following the
                unsubscribe instructions in our emails or by contacting us
                directly.
              </li>
              <li>
                <strong>Data Deletion:</strong> You can request the deletion of
                your personal data by contacting us. Please note that we may
                need to retain certain information for legal or business
                purposes.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mb-4">6. Third-Party Links</h2>
            <p className="mb-4">
              Our website may contain links to third-party websites that are not
              operated by us. We are not responsible for the privacy practices
              of these third-party websites. We encourage you to review the
              privacy policies of any third-party websites you visit.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              7. Children's Privacy
            </h2>
            <p className="mb-4">
              Our website is not intended for use by children under the age of
              13. We do not knowingly collect personal information from
              children. If you believe that we have inadvertently collected
              information from a child under 13, please contact us immediately,
              and we will take steps to delete such information.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              8. Changes to This Privacy Policy
            </h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. We will post any
              changes on this page and update the effective date at the top. We
              encourage you to review this Privacy Policy periodically.
            </p>

            <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about this Privacy Policy or
              how we handle your personal information, please contact us at:
            </p>
            <p className="mb-4">
              Name: Monika Bansal
              <br />
              Email: info@thegiftingaffair.com
              <br />
              Contact Number: +65 87430520
            </p>

            <p className="mt-4">
              By using our website and services, you consent to the practices
              described in this Privacy Policy.
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

export default PrivacyPolicy;
