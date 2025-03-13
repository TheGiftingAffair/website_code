"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import Toast from "../ui/Toast";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import OfferSlider from "./OfferSlider";
import CartSidebar from "./CartSidebar";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [cartCount, setCartCount] = useState(0); // Add this line
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { items } = useCart(); // Change this line to destructure items instead of cart
  const [festiveHampers, setFestiveHampers] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [specialNav, setSpecialNav] = useState("Special");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (href: string, section: string) => {
    setIsMenuOpen(false);
    setActiveDropdown(null);

    const currentPath = window.location.pathname;
    const [path, hash] = href.split("#");

    if (currentPath === "/products") {
      // Already on products page, just update hash and let scroll handler work
      window.location.hash = hash;
    } else {
      // Store target section and navigate to products page
      sessionStorage.setItem("scrollTarget", `#${hash}`);
      window.location.href = `/products#${hash}`;
    }
  };

  const categories = [
    {
      name: "For Him/Her",
      href: "/products#shop-by-categories?category=for-him-her",
      section: "shop-by-categories",
    },
    {
      name: "Chocolate & Cookies",
      href: "/products#shop-by-categories?category=chocolate-cookies",
      section: "shop-by-categories",
    },
    {
      name: "Tea & Coffee",
      href: "/products#shop-by-categories?category=tea-coffee",
      section: "shop-by-categories",
    },
    {
      name: "Wine & Whiskey",
      href: "/products#shop-by-categories?category=wine-whiskey",
      section: "shop-by-categories",
    },
    {
      name: "Fruits",
      href: "/products#shop-by-categories?category=fruits",
      section: "shop-by-categories",
    },
    {
      name: "Beauty",
      href: "/products#shop-by-categories?category=beauty",
      section: "shop-by-categories",
    },
    {
      name: "Baby",
      href: "/products#shop-by-categories?category=baby",
      section: "shop-by-categories",
    },
    {
      name: "Halal",
      href: "/products#shop-by-categories?category=halal",
      section: "shop-by-categories",
    },
    {
      name: "Wellness",
      href: "/products#shop-by-categories?category=wellness",
      section: "shop-by-categories",
    },
    {
      name: "Evergreen",
      href: "/products#shop-by-categories?category=evergreen",
      section: "shop-by-categories",
    },
  ];

  const occasions = [
    {
      name: "Birthday",
      href: "/products#shop-by-occasion?occasion=birthday",
      section: "shop-by-occasion",
    },
    {
      name: "Anniversary",
      href: "/products#shop-by-occasion?occasion=anniversary",
      section: "shop-by-occasion",
    },
    {
      name: "Farewell",
      href: "/products#shop-by-occasion?occasion=farewell",
      section: "shop-by-occasion",
    },
    {
      name: "Congratulations",
      href: "/products#shop-by-occasion?occasion=congratulations",
      section: "shop-by-occasion",
    },
    {
      name: "Housewarming",
      href: "/products#shop-by-occasion?occasion=housewarming",
      section: "shop-by-occasion",
    },
    {
      name: "Graduation",
      href: "/products#shop-by-occasion?occasion=graduation",
      section: "shop-by-occasion",
    },
    {
      name: "Special Day",
      href: "/products#shop-by-occasion?occasion=special-day",
      section: "shop-by-occasion",
    },
    {
      name: "Get Well Soon",
      href: "/products#shop-by-occasion?occasion=get-well-soon",
      section: "shop-by-occasion",
    },
  ];

  const priceRanges = [
    {
      name: "Below $100",
      href: "/products#shop-by-price?price=below100",
      section: "shop-by-price",
    },
    {
      name: "$100 - $150",
      href: "/products#shop-by-price?price=100to150",
      section: "shop-by-price",
    },
    {
      name: "$150 - $200",
      href: "/products#shop-by-price?price=150to200",
      section: "shop-by-price",
    },
    {
      name: "$200 & Above",
      href: "/products#shop-by-price?price=above200",
      section: "shop-by-price",
    },
  ];

  const special = [
    {
      name: "Valentine",
      href: "/products",
      section: "shop-by-category",
    },
  ];

  // Update cart count when cart changes
  useEffect(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);
  }, [items]); // Change dependency to items

  // Listen for cart updates from storage events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cartAdded") {
        setShowToast(true);
        setToastMessage(e.newValue || "Item added to cart");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Add useEffect to fetch festive hampers
  useEffect(() => {
    const fetchFestiveHampers = async () => {
      try {
        const q = query(
          collection(db, "Products"),
          where("festive", "==", true),
          where("visibility", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const hampers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setFestiveHampers(hampers);
      } catch (error) {
        console.error("Error fetching festive hampers:", error);
      }
    };

    fetchFestiveHampers();
  }, []);

  // Update useEffect that fetches text content
  useEffect(() => {
    const fetchTexts = async () => {
      try {
        const textIds = [
          "specialNav", // Add this new ID
        ];
        const texts = await Promise.all(
          textIds.map((id) => getDoc(doc(db, "variables", id)))
        );

        texts.forEach((doc) => {
          if (doc.exists()) {
            switch (doc.id) {
              case "specialNav":
                setSpecialNav(doc.data().value);
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
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-200 ${
          isScrolled ? "shadow-md" : ""
        } bg-[#f9f9f9]`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 font-semibold font-mont">
          <div className="flex items-center justify-between h-14">
            {/* Logo and Brand Name */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="font-macondo font-bold text-xl text-bg3 hover:text-bg4 transition-colors">
                The Gifting Affair
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 text-sm">
              <div className="flex flex-row gap-8">
                {/* Special Dropdown - Only show if there are festive hampers */}
                {festiveHampers.length > 0 && (
                  <div className="relative group">
                    <button
                      className="flex items-center space-x-1 hover:text-bg3 transition-colors"
                      onMouseEnter={() => setActiveDropdown("special")}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <span>{specialNav}</span>
                      <ChevronDown size={16} />
                    </button>
                    <div
                      className={`absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 transition-all duration-200 ${
                        activeDropdown === "special"
                          ? "opacity-100 visible"
                          : "opacity-0 invisible"
                      }`}
                      onMouseEnter={() => setActiveDropdown("special")}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {festiveHampers.map((hamper) => (
                        <Link
                          key={hamper.id}
                          href={`/product/${hamper.id}`}
                          className="block px-4 py-2 hover:bg-bg1 hover:text-bg3 transition-colors"
                        >
                          {hamper.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Shop By Category Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-1 hover:text-bg3 transition-colors"
                  onMouseEnter={() => setActiveDropdown("category")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span>Shop By Category</span>
                  <ChevronDown size={16} />
                </button>
                <div
                  className={`absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 transition-all duration-200 ${
                    activeDropdown === "category"
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                  onMouseEnter={() => setActiveDropdown("category")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(category.href, category.section);
                      }}
                      className="block px-4 py-2 hover:bg-bg1 hover:text-bg3 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Shop By Occasion Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-1 hover:text-bg3 transition-colors"
                  onMouseEnter={() => setActiveDropdown("occasion")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span>Shop By Occasion</span>
                  <ChevronDown size={16} />
                </button>
                <div
                  className={`absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 transition-all duration-200 ${
                    activeDropdown === "occasion"
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                  onMouseEnter={() => setActiveDropdown("occasion")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {occasions.map((occasion) => (
                    <Link
                      key={occasion.name}
                      href={occasion.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(occasion.href, occasion.section);
                      }}
                      className="block px-4 py-2 hover:bg-bg1 hover:text-bg3 transition-colors"
                    >
                      {occasion.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Shop By Price Dropdown */}
              <div className="relative group">
                <button
                  className="flex items-center space-x-1 hover:text-bg3 transition-colors"
                  onMouseEnter={() => setActiveDropdown("price")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span>Shop By Price</span>
                  <ChevronDown size={16} />
                </button>
                <div
                  className={`absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 transition-all duration-200 ${
                    activeDropdown === "price"
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                  onMouseEnter={() => setActiveDropdown("price")}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {priceRanges.map((range) => (
                    <Link
                      key={range.name}
                      href={range.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigation(range.href, range.section);
                      }}
                      className="block px-4 py-2 hover:bg-bg1 hover:text-bg3 transition-colors"
                    >
                      {range.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* <Link href="/about" className="hover:text-bg3 transition-colors">
                About Us
              </Link> */}

              <Link
                href="/profile"
                className="hover:text-bg3 transition-colors"
              >
                <User size={24} />
              </Link>

              <button
                className="hover:text-bg3 transition-colors relative"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-bg3 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <div className="flex flex-row gap-4">
                <Link
                  href="/profile"
                  className="hover:text-bg3 transition-colors"
                >
                  <User size={24} />
                </Link>
                <button
                  className="hover:text-bg3 transition-colors relative"
                  onClick={() => setIsCartOpen(!isCartOpen)}
                >
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-bg3 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  {/* Special Mobile Dropdown - Only show if there are festive hampers */}
                  {festiveHampers.length > 0 && (
                    <div>
                      <button
                        className="flex items-center justify-between w-full px-4 py-2 hover:bg-bg2 rounded-md transition-colors border border-bg2"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === "special" ? null : "special"
                          )
                        }
                      >
                        <span>{specialNav}</span>
                        {activeDropdown === "special" ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                      {activeDropdown === "special" && (
                        <div className="mx-2 space-y-2 mt-2">
                          {festiveHampers.map((hamper) => (
                            <Link
                              key={hamper.id}
                              href={`/product/${hamper.id}`}
                              className="flex items-center py-2 hover:text-bg3 transition-colors border-b border-bg2/50"
                            >
                              <ChevronRight size={14} className="mx-2" />
                              {hamper.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Shop By Category */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-4 py-2 hover:bg-bg2 rounded-md transition-colors border border-bg2"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === "category" ? null : "category"
                        )
                      }
                    >
                      <span>Shop By Category</span>
                      {activeDropdown === "category" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    {activeDropdown === "category" && (
                      <div className="mx-2 space-y-2 mt-2">
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(category.href, category.section);
                            }}
                            className="flex items-center py-2 hover:text-bg3 transition-colors border-b border-bg2/50"
                          >
                            <ChevronRight size={14} className="mx-2" />
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Shop By Occasion */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-4 py-2 hover:bg-bg2 rounded-md transition-colors border border-bg2"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === "occasion" ? null : "occasion"
                        )
                      }
                    >
                      <span>Shop By Occasion</span>
                      {activeDropdown === "occasion" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    {activeDropdown === "occasion" && (
                      <div className="mx-2 space-y-2 mt-2">
                        {occasions.map((occasion) => (
                          <Link
                            key={occasion.name}
                            href={occasion.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(occasion.href, occasion.section);
                            }}
                            className="flex items-center py-2 hover:text-bg3 transition-colors border-b border-bg2/50"
                          >
                            <ChevronRight size={14} className="mx-2" />
                            {occasion.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Shop By Price */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-4 py-2 hover:bg-bg2 rounded-md transition-colors border border-bg2"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === "price" ? null : "price"
                        )
                      }
                    >
                      <span>Shop By Price</span>
                      {activeDropdown === "price" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    {activeDropdown === "price" && (
                      <div className="mx-2 space-y-2 mt-2">
                        {priceRanges.map((range) => (
                          <Link
                            key={range.name}
                            href={range.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigation(range.href, range.section);
                            }}
                            className="flex items-center py-2 hover:text-bg3 transition-colors border-b border-bg2/50"
                          >
                            <ChevronRight size={14} className="mx-2" />
                            {range.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onHide={() => setShowToast(false)}
      />

      <div className="mt-14">
        <OfferSlider />
      </div>
    </>
  );
};

export default Navbar;
