"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  Gift,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const Footer = () => {
  const [footerLogoBody1, setFooterLogoBody1] = useState("Unwrap Happiness,");
  const [footerLogoBody2, setFooterLogoBody2] = useState("One Gift at a Time!");

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const textIds = ["FooterLogoBody1", "FooterLogoBody2"];
        const texts = await Promise.all(
          textIds.map((id) => getDoc(doc(db, "variables", id)))
        );

        texts.forEach((doc) => {
          if (doc.exists()) {
            switch (doc.id) {
              case "FooterLogoBody1":
                setFooterLogoBody1(doc.data().value);
                break;
              case "FooterLogoBody2":
                setFooterLogoBody2(doc.data().value);
                break;
            }
          }
        });
      } catch (error) {
        console.error("Error fetching texts:", error);
      }
    };

    fetchTexts();
  }, []);

  return (
    <footer className="bg-gradient-to-b overflow-clip from-blue-950 to-blue-900/90 text-gray-700 w-full relative">
      {/* Footer Images */}
      {/* <div className="absolute -bottom-5 -left-4 w-60 h-36 z-20 drop-shadow-lg opacity-85">
        <Image
          src="/images/hampers/footer1.png"
          alt="Footer decoration 1"
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute -bottom-5 -right-4 w-72 h-44 z-20 drop-shadow-lg opacity-85">
        <Image
          src="/images/hampers/footer2.png"
          alt="Footer decoration 2"
          fill
          className="object-contain"
        />
      </div> */}

      {/* Main Content with higher z-index */}
      <div className="relative z-10 max-w-8xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 pt-8 md:pt-12 pb-4 md:pb-6 font-semibold">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 ">
          {/* Brand Section */}
          <div className="space-y-0 md:space-y-2 flex flex-col items-center text-center">
            <Link href="/" className="block">
              <Image
                src="/images/logo4.png"
                alt="The Gifting Affair Logo"
                width={180}
                height={180}
                className="mx-auto md:mx-0 rounded-md brightness-110"
              />
            </Link>
            <div className="">
              {/* <div className="font-macondo font-bold text-2xl 2xl:text-3xl text-bg2 text-center md:text-left">
                The Gifting Affair
              </div> */}
              <div>
                <p className="text-sm font-mont font-semibold text-bg1">
                  {footerLogoBody1} {footerLogoBody2}
                </p>
                {/* <p className="text-sm font-mont font-semibold text-bg1">
                  {footerLogoBody2}
                </p> */}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2 md:space-y-4">
            <h3 className="font-semibold mb-2 md:mb-5 text-xl 2xl:text-2xl text-bg3 ">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Hampers", href: "/products" },
                {
                  name: "Terms & Conditions",
                  href: "/terms-and-conditions",
                },
                {
                  name: "Return & Refund Policy",
                  href: "/return-refund-policy",
                },
                {
                  name: "Privacy Policy",
                  href: "/privacy-policy",
                },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-[#f9f9f9] 2xl:text-base hover:text-bg2 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-2 md:space-y-4">
            <h3 className="font-semibold text-xl 2xl:text-2xl mb-2 md:mb-5 text-bg3 ">
              Get in Touch
            </h3>
            <div className="space-y-2 text-[#f9f9f9]">
              <a
                href="mailto:thegiftingaffair24@gmail.com"
                className="flex items-center gap-2 text-sm 2xl:text-base hover:text-bg2 transition-colors"
              >
                <Mail size={16} className="2xl:w-5 2xl:h-5" />
                thegiftingaffair24@gmail.com
              </a>
              <a
                href="tel:+6587430520"
                className="flex items-center gap-2 text-sm 2xl:text-base hover:text-bg2 transition-colors"
              >
                <Phone size={16} className="2xl:w-5 2xl:h-5" />
                +65 87430520
              </a>
            </div>

            {/* Social Media */}
            <div className="space-y-2">
              <h4 className="font-semibold text-bg3">Follow Us</h4>
              <div className="flex gap-4">
                {[
                  {
                    Icon: Facebook,
                    href: "https://www.facebook.com/thegiftingaffair?mibextid=LQQJ4d",
                  },
                  {
                    Icon: Instagram,
                    href: "https://www.instagram.com/the_gifting_affair",
                  },
                ].map(({ Icon, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f9f9f9] hover:text-bg2 transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-bg1/50 text-bg1 mt-6 pt-4 md:pt-8 text-center text-xs 2xl:text-sm">
          <p>
            © {new Date().getFullYear()} The Gifting Affair. All rights
            reserved.
          </p>
          <p className="italic">
            Designed & Developed by{" "}
            <a href="https://www.linkedin.com/in/parthratra11" target="_blank">
              Parth Ratra
            </a>{" "}
            &{" "}
            <a
              href="https://www.linkedin.com/in/pranay-rajvanshi"
              target="_blank"
            >
              Pranay Rajvanshi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
