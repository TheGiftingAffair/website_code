"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // Ensure this path matches your Firebase config file location
import Image from "next/image";
import Link from "next/link";
import ConfettiBackground from "./heroBg";
import TypeWriter from "./TypeWriter";

interface ImageData {
  link: string;
  visibility: boolean;
}

interface Coupon {
  Active: boolean;
  public: boolean;
  name: string;
  description: string;
}

export default function Hero() {
  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [showFirstLine, setShowFirstLine] = useState(true);
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [mainTitle, setMainTitle] = useState("Welcome to The Gifting Affair");
  const [subTitle, setSubTitle] = useState("Unwrap Happiness!");
  const [bodyText1, setBodyText1] = useState(
    "Discover thoughtfully curated hampers for every occasion,"
  );
  const [bodyText2, setBodyText2] = useState(
    "handcrafted with love and delivered with care."
  );
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentCoupon, setCurrentCoupon] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "PlaceHolderImages")
        );
        const filteredImages = querySnapshot.docs
          .filter(
            (doc) =>
              doc.id.startsWith("HeroSection") && doc.data().visibility === true
          )
          .map((doc) => doc.data().link);

        console.log("Filtered Hero images:", filteredImages);
        setImages(filteredImages);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const textIds = [
          "HeroSectionTitle",
          "HeroSectionSubTitle",
          "HeroSectionBody1",
          "HeroSectionBody2",
        ];
        const texts = await Promise.all(
          textIds.map((id) => getDoc(doc(db, "variables", id)))
        );

        texts.forEach((doc) => {
          if (doc.exists()) {
            switch (doc.id) {
              case "HeroSectionTitle":
                setMainTitle(doc.data().value);
                break;
              case "HeroSectionSubTitle":
                setSubTitle(doc.data().value);
                break;
              case "HeroSectionBody1":
                setBodyText1(doc.data().value);
                break;
              case "HeroSectionBody2":
                setBodyText2(doc.data().value);
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

  useEffect(() => {
    if (images.length <= 1) return; // Don't start timer if there's only one or no images

    const imageTimer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(imageTimer);
  }, [images.length]); // Depend on images.length instead of images array

  useEffect(() => {
    const typewriterTimer = setInterval(() => {
      setShowFirstLine(false);
      setShowSecondLine(false);
      // Small delay before starting the animation again
      setTimeout(() => {
        setShowFirstLine(true);
      }, 100);
    }, 15000);

    return () => {
      clearInterval(typewriterTimer);
    };
  }, []);

  useEffect(() => {
    // Fetch and filter coupons from Firestore
    const fetchCoupons = async () => {
      try {
        const couponsCollection = collection(db, "coupons");
        const querySnapshot = await getDocs(couponsCollection);
        const activeCoupons = querySnapshot.docs
          .filter((doc) => {
            const data = doc.data() as Coupon;
            return data.Active && data.public;
          })
          .map(
            (doc) =>
              ({
                id: doc.id,
                name: doc.id, // Use document ID as the name
                ...doc.data(),
              } as Coupon)
          );

        console.log("Filtered coupons:", activeCoupons);
        setCoupons(activeCoupons);
      } catch (error) {
        console.error("Error fetching coupons from Firestore:", error);
      }
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    if (coupons.length <= 1) return;

    const couponTimer = setInterval(() => {
      setCurrentCoupon((prev) => (prev + 1) % coupons.length);
    }, 4000);

    return () => clearInterval(couponTimer);
  }, [coupons.length]);

  return (
    <section className="relative w-full overflow-hidden h-[calc(100vh-100px)] 2xl:h-[calc(100vh-135px)]">
      <div className="absolute inset-0">
        <ConfettiBackground />
      </div>

      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {images.length > 0 ? (
          images.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt={`Luxury hamper ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
                unoptimized
              />
              {/* Overlay for each image */}
              <div className="absolute inset-0 bg-black opacity-25" />
            </div>
          ))
        ) : (
          // Fallback when no images are available
          <div className="absolute inset-0 bg-gray-900" />
        )}
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center z-20 text-white">
        <h1 className="mb-4 font-lora text-4xl font-bold md:text-6xl 2xl:text-8xl font-alegreya">
          {mainTitle}
          <br />
          <span className="text-bg2 text-3xl md:text-5xl 2xl:text-7xl">
            {subTitle}
          </span>
        </h1>

        <p className="mb-8 mt-4 font-poppins text-md 2xl:text-2xl font-mont font-semibold text-bg1 min-h-[3rem]">
          {showFirstLine && (
            <TypeWriter
              text={bodyText1}
              onComplete={() => setShowSecondLine(true)}
            />
          )}
          <br />
          {showSecondLine && <TypeWriter text={bodyText2} />}
        </p>

        <div className="flex flex-col gap-4 md:flex-row font-mont">
          <Link
            href="/products"
            className="rounded-full 2xl:text-2xl bg-bg1 text-bg4 px-8 py-3 2xl:py-5 font-bold transition-all hover:scale-105"
          >
            Shop Now
          </Link>

          <a
            href={`https://wa.me/+6587430520?text=${encodeURIComponent(
              "Hello! I'm interested in your hampers."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full text-xs md:text-md 2xl:text-2xl border border-bg1 px-8 py-3 2xl:py-5 font-bold transition-all hover:scale-105"
          >
            Personalized Hampers
          </a>
        </div>

        {/* Coupon Slider */}
        {coupons.length > 0 && (
          <div className="mt-8 h-16 overflow-hidden">
            <div
              className={`transition-opacity duration-500 ${
                coupons.length > 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="text-bg1 font-bold text-xl mb-1">
                Use code: {coupons[currentCoupon]?.name}
              </p>
              <p className="text-white text-sm">
                {coupons[currentCoupon]?.description}
              </p>
            </div>
          </div>
        )}

        {/* Slider Navigation Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-8 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentImage ? "bg-white w-4" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
