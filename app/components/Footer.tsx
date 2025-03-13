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
  const [footerLogoBody1, setFooterLogoBody1] = useState(
    "Unwrapping Happiness,"
  );
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
    <footer className="bg-gradient-to-b overflow-clip from-bg3/40 to-white text-gray-700 w-full relative">
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
      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-4 md:pb-6 font-semibold">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 ">
          {/* Brand Section */}
          <div className="space-y-2 md:space-y-4 flex flex-row">
            <Link href="/" className="block">
              <Image
                src="/images/logo.jpg"
                alt="The Gifting Affair Logo"
                width={120}
                height={120}
                className="mx-auto md:mx-0 rounded-md"
              />
            </Link>
            <div className="pl-6">
              <div className="font-macondo font-bold text-2xl text-bg3 text-center md:text-left">
                The Gifting Affair
              </div>
              <div>
                <p className="text-sm mt-8 md:mt-4 font-mont font-semibold text-bg4">
                  {footerLogoBody1}
                </p>
                <p className="text-sm font-mont font-semibold text-bg4">
                  {footerLogoBody2}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2 md:space-y-4">
            <h3 className="font-semibold mb-2 md:mb-5 text-xl text-headline">
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
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm hover:text-bg3 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-2 md:space-y-4">
            <h3 className="font-semibold text-xl mb-2 md:mb-5 text-headline">
              Get in Touch
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:thegiftingaffair24@gmail.com"
                className="flex items-center gap-2 text-sm hover:text-bg3 transition-colors"
              >
                <Mail size={16} />
                thegiftingaffair24@gmail.com
              </a>
              <a
                href="tel:+6587430520"
                className="flex items-center gap-2 text-sm hover:text-bg3 transition-colors"
              >
                <Phone size={16} />
                +65 87430520
              </a>
            </div>

            {/* Social Media */}
            <div className="space-y-2">
              <h4 className="font-semibold text-headline">Follow Us</h4>
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
                    className="hover:text-bg3 transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-bg4/50 mt-6 pt-4 md:pt-8 text-center text-xs md:text-sm">
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
