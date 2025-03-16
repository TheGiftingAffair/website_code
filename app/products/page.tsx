"use client";
import React, { useEffect } from "react";
import Navbar from "../components/Ṇavbar/Navbar";
import ShopByCategories from "../components/ShopByCategories/ShopByCategories";
import ShopByOccasion from "../components/ShopByOccasion/ShopByOccasion";
import ShopByPrice from "../components/ShopByPrice/ShopByPrice";
import ShopBySpecial from "../components/ShopBySpecial/ShopBySpecial";
import Footer from "../components/Footer";
import WhatsappRedirect from "../components/WhatsappRedirect";
import { imageCache } from "@/utils/imageCache";

const ProductsPage = () => {
  useEffect(() => {
    // Preload and cache all product images when the page loads
    const preloadImages = async () => {
      try {
        // Get all product cards on the page
        const imageElements = document.querySelectorAll(
          'img[data-product-image="true"]'
        );

        // Cache each image
        const cachePromises = Array.from(imageElements).map(
          async (img: HTMLImageElement) => {
            if (img.src) {
              await imageCache.getImage(img.src);
            }
          }
        );

        await Promise.all(cachePromises);
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    };

    const handleScroll = () => {
      // Get hash and params from URL
      const hash = window.location.hash;
      if (!hash) return;

      const [sectionId, paramString] = hash.split("?");
      const targetSection = sectionId.replace("#", "");

      // Function to perform scroll
      const scrollToSection = () => {
        const element = document.getElementById(targetSection);
        if (element) {
          // Use a more reliable scrolling method
          const navbarHeight = 80; // Height of your navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Dispatch event for section components after scroll
          window.dispatchEvent(
            new CustomEvent("urlParamsChanged", {
              detail: {
                section: targetSection,
                params: new URLSearchParams(paramString),
              },
            })
          );
        }
      };

      // Add a delay to ensure components are mounted
      setTimeout(scrollToSection, 1000);
    };

    // Initial load
    preloadImages();

    // Handle both initial load and hash changes
    handleScroll();
    window.addEventListener("hashchange", handleScroll);

    // Check for stored navigation target
    const storedTarget = sessionStorage.getItem("scrollTarget");
    if (storedTarget) {
      sessionStorage.removeItem("scrollTarget");
      window.location.hash = storedTarget;
    }

    return () => {
      window.removeEventListener("hashchange", handleScroll);
    };
  }, []);

  return (
    <>
      <div>
        <Navbar />
        <ShopByCategories />
        <ShopByOccasion />
        <ShopByPrice />
        <ShopBySpecial />
        <Footer />
      </div>
      <WhatsappRedirect />
    </>
  );
};

export default ProductsPage;
