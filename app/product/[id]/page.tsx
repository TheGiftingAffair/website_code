"use client";
import { useEffect, useState, useRef } from "react";
import { use } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Navbar from "../../components/Ṇavbar/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { useCart } from "@/contexts/CartContext";
import DeliveryDateModal from "@/app/components/ui/DeliveryDateModal";
import LoadingHamper from "@/app/components/ui/LoadingHamper";
import WhatsappRedirect from "@/app/components/WhatsappRedirect";
import {
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoInformationCircleOutline,
  IoShieldCheckmark,
  IoTimeOutline,
} from "react-icons/io5";
import { CachedImage } from "@/components/CachedImage";
import AgeVerificationModal from "@/app/components/ui/AgeVerificationModal";
import { getBlockedDates } from "@/utils/dateService";
import { trackMetaPixelEvent } from "@/utils/metaPixel";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  description: string;
  components: string[];
  stock: boolean;
  image: string;
  category: string[];
  occasion: string[];
  carousel: string[];
  visibility: boolean;
}

const DRAG_SENSITIVITY = 1.5;
const DRAG_BOUNDS_PADDING = 100;

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [giftMessage, setGiftMessage] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [showDateModal, setShowDateModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const maxZoom = 4;
  const minZoom = 1;
  const zoomStep = 0.25;
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const {
    addToCart,
    clearCart,
    setDeliveryDate,
    getTotalQuantity,
    deliveryDate,
  } = useCart();
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [pendingAction, setPendingAction] = useState<"cart" | "buy" | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAlcoholProduct = product?.category?.includes("Wine & Whiskey");

  const handleAgeVerification = () => {
    setShowAgeVerification(false);
    if (pendingAction === "cart") {
      handleAddToCart();
    } else if (pendingAction === "buy") {
      handleBuyNow();
    }
    setPendingAction(null);
  };

  const initiateAddToCart = () => {
    if (isAlcoholProduct) {
      setShowAgeVerification(true);
      setPendingAction("cart");
    } else {
      handleAddToCart();
    }
  };

  const initiateBuyNow = () => {
    if (isAlcoholProduct) {
      setShowAgeVerification(true);
      setPendingAction("buy");
    } else {
      handleBuyNow();
    }
  };

  const wouldExceedLimit = () => {
    const currentTotal = getTotalQuantity();
    return currentTotal + quantity > 25;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "Products", unwrappedParams.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = docSnap.data();
          if (!productData.visibility) {
            alert("This product is not available!");
            router.push("/products");
            return;
          }

          const currentProduct = {
            id: docSnap.id,
            ...productData,
          } as Product;
          setProduct(currentProduct);
          await fetchSimilarProducts(currentProduct);
        } else {
          alert("Product not found!");
          router.push("/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Error loading product. Redirecting to products page.");
        router.push("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [unwrappedParams.id, router]);

  useEffect(() => {
    if (!product) return;

    trackMetaPixelEvent("ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "SGD",
    });
  }, [product]);

  const fetchSimilarProducts = async (currentProduct: Product) => {
    try {
      const productsRef = collection(db, "Products");
      const q = query(
        productsRef,
        where("occasion", "array-contains-any", currentProduct.occasion),
        where("visibility", "==", true),
        limit(4),
      );
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        if (doc.id !== currentProduct.id) {
          products.push({ id: doc.id, ...doc.data() } as Product);
        }
      });

      if (products.length < 3) {
        const categoryQuery = query(
          productsRef,
          where("category", "array-contains-any", currentProduct.category),
          where("visibility", "==", true),
          limit(4),
        );
        const categorySnapshot = await getDocs(categoryQuery);
        categorySnapshot.forEach((doc) => {
          if (
            doc.id !== currentProduct.id &&
            !products.find((p) => p.id === doc.id)
          ) {
            products.push({ id: doc.id, ...doc.data() } as Product);
          }
        });
      }

      setSimilarProducts(products.slice(0, 3));
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  };

  const getStockStatus = (stock: boolean) => {
    return stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      quantity: quantity,
      giftMessage: giftMessage,
      specialRequest: specialRequest,
    });
  };

  const handleBuyNow = () => {
    if (!deliveryDate) {
      setShowDateModal(true);
      return;
    }

    clearCart();

    addToCart({
      productId: product.id,
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      giftMessage,
      specialRequest,
    });

    router.replace("/checkout");
  };

  const handleDateConfirm = (date: string) => {
    setDeliveryDate(date);

    clearCart();

    addToCart({
      productId: product.id,
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      giftMessage,
      specialRequest,
    });

    setShowDateModal(false);
    router.replace("/checkout");
  };

  const nextImage = () => {
    if (product?.carousel) {
      setCurrentImageIndex((prev) =>
        prev === product.carousel.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (product?.carousel) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.carousel.length - 1 : prev - 1,
      );
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + zoomStep, maxZoom));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - zoomStep, minZoom));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - (imagePosition.x || 0),
        y: e.clientY - (imagePosition.y || 0),
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      e.preventDefault();

      const moveX = e.clientX - dragStart.x;
      const moveY = e.clientY - dragStart.y;

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const maxX =
          (rect.width * zoomLevel - rect.width) / 2 + DRAG_BOUNDS_PADDING;
        const maxY =
          (rect.height * zoomLevel - rect.height) / 2 + DRAG_BOUNDS_PADDING;

        const newX = Math.min(Math.max(moveX, -maxX), maxX);
        const newY = Math.min(Math.max(moveY, -maxY), maxY);

        setImagePosition({
          x: newX,
          y: newY,
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [currentImageIndex]);

  interface TouchPoints {
    touches: { clientX: number; clientY: number }[];
  }

  type PinchState = {
    initialDistance: number;
    currentScale: number;
  };

  const [pinchState, setPinchState] = useState<PinchState | null>(null);
  const [touchZoomMode, setTouchZoomMode] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getDistance = (touches: Touch[]) => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY,
    );
  };

  const [touchCenter, setTouchCenter] = useState({ x: 0, y: 0 });

  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [lastTouchPosition, setLastTouchPosition] = useState({ x: 0, y: 0 });
  const [isTwoFingerDrag, setIsTwoFingerDrag] = useState(false);
  const [singleTouchDrag, setSingleTouchDrag] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setIsTwoFingerDrag(true);
      const distance = getDistance(Array.from(e.touches));
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      setTouchStart({ x: centerX, y: centerY });
      setLastTouchPosition({
        x: imagePosition.x,
        y: imagePosition.y,
      });

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setTouchCenter({
          x: (centerX - rect.left) / rect.width,
          y: (centerY - rect.top) / rect.height,
        });
      }

      setPinchState({
        initialDistance: distance,
        currentScale: zoomLevel,
      });
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      setSingleTouchDrag(true);
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
      setLastTouchPosition({
        x: imagePosition.x,
        y: imagePosition.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();

      if (isTwoFingerDrag) {
        const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        const deltaX = (centerX - touchStart.x) * DRAG_SENSITIVITY;
        const deltaY = (centerY - touchStart.y) * DRAG_SENSITIVITY;

        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const maxX =
            (rect.width * zoomLevel - rect.width) / 2 + DRAG_BOUNDS_PADDING;
          const maxY =
            (rect.height * zoomLevel - rect.height) / 2 + DRAG_BOUNDS_PADDING;

          const newX = Math.min(
            Math.max(lastTouchPosition.x + deltaX, -maxX),
            maxX,
          );
          const newY = Math.min(
            Math.max(lastTouchPosition.y + deltaY, -maxY),
            maxY,
          );

          setImagePosition({ x: newX, y: newY });
        }
      }

      if (pinchState) {
        const distance = getDistance(Array.from(e.touches));
        const newScale = Math.min(
          Math.max(
            (distance / pinchState.initialDistance) * pinchState.currentScale,
            minZoom,
          ),
          maxZoom,
        );

        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const offsetX = rect.width * (0.5 - touchCenter.x) * (newScale - 1);
          const offsetY = rect.height * (0.5 - touchCenter.y) * (newScale - 1);

          setImagePosition({ x: offsetX, y: offsetY });
        }

        setZoomLevel(newScale);
      }
    } else if (e.touches.length === 1 && singleTouchDrag) {
      e.preventDefault();
      const deltaX = (e.touches[0].clientX - touchStart.x) * DRAG_SENSITIVITY;
      const deltaY = (e.touches[0].clientY - touchStart.y) * DRAG_SENSITIVITY;

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const maxX =
          (rect.width * zoomLevel - rect.width) / 2 + DRAG_BOUNDS_PADDING;
        const maxY =
          (rect.height * zoomLevel - rect.height) / 2 + DRAG_BOUNDS_PADDING;

        const newX = Math.min(
          Math.max(lastTouchPosition.x + deltaX, -maxX),
          maxX,
        );
        const newY = Math.min(
          Math.max(lastTouchPosition.y + deltaY, -maxY),
          maxY,
        );

        setImagePosition({ x: newX, y: newY });
      }
    }
  };

  const handleTouchEnd = () => {
    setPinchState(null);
    setIsTwoFingerDrag(false);
    setSingleTouchDrag(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) {
      return;
    }

    if (window.innerWidth > 768 && !isModalOpen) {
      setIsModalOpen(true);
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const handleZoomInAtPoint = (x: number, y: number) => {
    if (zoomLevel < maxZoom) {
      const newZoom = Math.min(zoomLevel + zoomStep, maxZoom);
      applyZoomAtPoint(newZoom, x, y);
    }
  };

  const handleZoomOutAtPoint = (x: number, y: number) => {
    if (zoomLevel > minZoom) {
      const newZoom = Math.max(zoomLevel - zoomStep, minZoom);
      applyZoomAtPoint(newZoom, x, y);
    }
  };

  const applyZoomAtPoint = (newZoom: number, x: number, y: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const offsetX = rect.width * (0.5 - x) * (newZoom - 1);
      const offsetY = rect.height * (0.5 - y) * (newZoom - 1);

      setImagePosition({ x: offsetX, y: offsetY });
      setZoomLevel(newZoom);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    } else {
      const newZoom = 2;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) / rect.width;
        const clickY = (e.clientY - rect.top) / rect.height;

        const offsetX = rect.width * (0.5 - clickX) * (newZoom - 1);
        const offsetY = rect.height * (0.5 - clickY) * (newZoom - 1);

        setImagePosition({ x: offsetX, y: offsetY });
        setZoomLevel(newZoom);
      }
    }
  };

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventDefault);
    };
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      if (e.deltaX > 0 || e.deltaY > 0) {
        nextImage();
      } else if (e.deltaX < 0 || e.deltaY < 0) {
        prevImage();
      }
      return;
    }

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      if (e.deltaY < 0) {
        handleZoomInAtPoint(0.5, 0.5);
      } else {
        handleZoomOutAtPoint(0.5, 0.5);
      }
    }
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    prevImage();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    nextImage();
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  if (loading) return <LoadingHamper />;
  if (!product) return null;

  return (
    <>
      <div>
        <Navbar />
        <div className="max-w-[1536px] mx-auto px-4 py-8 min-h-screen">
          <div className="grid md:grid-cols-2 gap-8 2xl:gap-12">
            <div>
              <div
                ref={containerRef}
                className={`rounded-lg flex items-center justify-center mx-auto w-[320px] h-[320px] md:w-[500px] md:h-[500px] 2xl:w-[600px] 2xl:h-[600px] overflow-hidden relative touch-none ${
                  window?.innerWidth > 768 ? "cursor-pointer" : ""
                }`}
                onClick={handleImageClick}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
              >
                {product.carousel && product.carousel.length > 0 ? (
                  <>
                    <div className="absolute left-4 top-4 z-20 md:flex flex-col items-center gap-2 bg-white/90 p-2 rounded-lg shadow-md hidden">
                      <button
                        onClick={handleZoomIn}
                        className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-sm transition-all"
                        title="Zoom in (or click image)"
                      >
                        <span className="text-xl font-bold text-gray-700">
                          +
                        </span>
                      </button>
                      <div className="text-xs font-medium text-gray-700">
                        {Math.round(zoomLevel * 100)}%
                      </div>
                      <button
                        onClick={handleZoomOut}
                        className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-sm transition-all"
                        title="Zoom out (or Shift+click image)"
                      >
                        <span className="text-xl font-bold text-gray-700">
                          −
                        </span>
                      </button>
                    </div>

                    <div className="absolute top-4 left-0 right-0 z-20 md:hidden">
                      {zoomLevel > 1 && (
                        <div className="mx-auto w-fit bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          Use one finger to drag
                        </div>
                      )}
                    </div>

                    <div
                      ref={imageRef}
                      className={`relative w-full h-full ${
                        zoomLevel > 1 ? "cursor-move" : "cursor-zoom-in"
                      }`}
                      onDoubleClick={handleDoubleClick}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    >
                      <div
                        style={{
                          transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                          transition: isDragging
                            ? "none"
                            : "transform 0.2s ease-out",
                          transformOrigin: "center",
                          willChange: "transform",
                        }}
                      >
                        <CachedImage
                          src={product.carousel[currentImageIndex]}
                          alt={`${product.name} - Image ${
                            currentImageIndex + 1
                          }`}
                          className="w-full h-full object-contain rounded-lg select-none"
                          draggable={false}
                        />
                      </div>
                    </div>

                    {product.carousel.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevClick}
                          className="absolute left-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all"
                        >
                          <IoChevronBackOutline className="h-6 w-6 text-gray-800" />
                        </button>
                        <button
                          onClick={handleNextClick}
                          className="absolute right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all"
                        >
                          <IoChevronForwardOutline className="h-6 w-6 text-gray-800" />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {product.carousel.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentImageIndex === index
                              ? "bg-white w-4"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>

              <div className="flex flex-row items-center justify-center gap-4 mt-4">
                <div className="bg-white shadow-sm py-1 md:py-2 px-2 md:px-4 rounded-full border border-gray-100 flex items-center gap-2">
                  <IoShieldCheckmark className="text-gray-600 text-xl" />
                  <p className="text-gray-700 font-mont text-xs 2xl:text-base">
                    100% secure payment
                  </p>
                </div>
                <div className="bg-white shadow-sm py-1 md:py-2 px-2 md:px-4 rounded-full border border-gray-100 flex items-center gap-2">
                  <IoTimeOutline className="text-gray-600 text-xl" />
                  <p className="text-gray-700 font-mont text-xs 2xl:text-base">
                    On time delivery
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 2xl:space-y-6">
              <div className="flex flex-row items-center">
                <h1 className="text-4xl 2xl:text-5xl font-alegreya font-bold text-headline">
                  {product.name}
                </h1>
                <div
                  className={`flex justify-center items-center text-sm 2xl:text-base ml-6 px-4 my-1 py-1 rounded-lg ${getStockStatus(
                    product.stock,
                  )}`}
                >
                  <span className="font-semibold">
                    {product.stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
              <p className="text-3xl 2xl:text-4xl font-mont font-semibold text-bg4">
                ${product.price}
              </p>

              <div className="space-y-3 2xl:space-y-4">
                <div className="border border-gray-400 p-3 2xl:p-4 rounded-lg">
                  <label className="block text-md 2xl:text-lg font-medium text-gray-700">
                    Gift Message
                  </label>
                  <textarea
                    className="mt-2 block w-full rounded-md text-sm 2xl:text-base border-gray-300 shadow-sm focus:border-bg4 focus:ring-bg4"
                    rows={3}
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Enter your gift message here..."
                  />
                </div>
                <div className="border border-gray-400 p-3 2xl:p-4 rounded-lg">
                  <label className="block text-md 2xl:text-lg font-medium text-gray-700">
                    Special Requests
                  </label>
                  <textarea
                    className="mt-2 block w-full rounded-md text-sm 2xl:text-base border-gray-300 shadow-sm focus:border-bg4 focus:ring-bg4"
                    rows={3}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="Any special requests..."
                  />
                </div>
              </div>

              <div className="space-y-4 2xl:space-y-6 py-4 2xl:py-6">
                <div className="flex items-center space-x-4">
                  <label className="text-md 2xl:text-lg font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 2xl:px-5 2xl:py-3 border-r hover:bg-gray-100 text-lg 2xl:text-xl"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 2xl:px-8 2xl:py-3 text-lg 2xl:text-xl">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(5, quantity + 1))}
                      className="px-4 py-2 2xl:px-5 2xl:py-3 border-l hover:bg-gray-100 text-lg 2xl:text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={initiateAddToCart}
                    disabled={wouldExceedLimit() || !product.stock}
                    className={`flex-1 font-semibold font-sans text-lg 2xl:text-xl px-6 py-3 2xl:py-4 rounded-lg transition-colors ${
                      wouldExceedLimit() || !product.stock
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white text-bg4 border border-bg4/80 hover:bg-gray-50"
                    }`}
                  >
                    {product.stock ? "Add to Cart" : "Out of Stock"}
                  </button>
                  <button
                    onClick={initiateBuyNow}
                    disabled={!product.stock}
                    className={`flex-1 font-semibold font-sans text-lg 2xl:text-xl px-6 py-3 2xl:py-4 rounded-lg transition-colors ${
                      product.stock
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
                {!product.stock && (
                  <p className="text-red-500 text-sm mt-2">
                    This item is currently out of stock. Please check back later
                    or contact us for more information.
                  </p>
                )}
                {wouldExceedLimit() && (
                  <>
                    <p className="text-red-500 text-sm mt-2">
                      Maximum cart quantity (25 items) exceeded!
                      <p>For bulk orders, kindly contact us on Whatsapp.</p>
                    </p>
                  </>
                )}
              </div>

              <div className="pb-4 2xl:pb-6">
                {product.components &&
                  product.components.filter(
                    (component) => component.trim() !== "",
                  ).length > 0 && (
                    <>
                      <h2 className="text-2xl 2xl:text-3xl font-sans font-semibold mb-3 pt-3">
                        Includes:
                      </h2>
                      <ul className="list-disc list-inside space-y-2 font-mont">
                        {product.components
                          .filter((component) => component.trim() !== "")
                          .map((component, index) => (
                            <li
                              key={index}
                              className="text-gray-600 text-md 2xl:text-lg font-semibold"
                            >
                              {component}
                            </li>
                          ))}
                        <li className="text-gray-600 text-md 2xl:text-lg font-semibold text-md font-mont">
                          Options available for customization*
                        </li>
                      </ul>
                    </>
                  )}

                {(!product.components ||
                  product.components.filter(
                    (component) => component.trim() !== "",
                  ).length === 0) && (
                  <h2 className="text-2xl 2xl:text-3xl font-sans font-semibold mb-3 pt-3">
                    Includes:
                  </h2>
                )}

                <ul
                  className={`list-disc list-inside space-y-1 font-mont ${
                    !product.components ||
                    product.components.filter(
                      (component) => component.trim() !== "",
                    ).length === 0
                      ? ""
                      : "hidden"
                  }`}
                >
                  <li className="text-gray-600 text-md font-semibold text-md font-mont">
                    Options available for customization*
                  </li>
                </ul>

                <p className="text-headline text-md mt-2 font-semibold text-sm font-mont">
                  We reserve the right to replace any item with another equal
                  valued item.*
                </p>
              </div>

              <div className="space-y-4 2xl:space-y-6 pt-4 2xl:pt-6">
                {product.occasion &&
                  product.occasion.filter((occ) => occ.trim() !== "").length >
                    0 && (
                    <div>
                      <h3 className="text-md 2xl:text-lg font-semibold mb-2">
                        Perfect for:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.occasion
                          .filter((occ) => occ.trim() !== "")
                          .map((occ) => (
                            <span
                              key={occ}
                              className="bg-pink-100 font-semibold text-sm 2xl:text-base font-mont text-pink-800 px-4 py-2 rounded-full"
                            >
                              {occ}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="py-12 2xl:py-16 bg-gradient-to-l from-bg1/20 to-bg4/5 px-4">
          <h2 className="text-4xl 2xl:text-5xl font-alegreya font-bold text-headline mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-6">
            {similarProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg bg-white/90 hover:bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div
                  className="md:h-72 relative hover:cursor-pointer"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-1.5  hover:cursor-pointer px-2 md:p-3 flex flex-row text-headline">
                  <h3 className="text-lg md:text-xl 2xl:text-2xl font-alegreya font-semibold">
                    {product.name}
                  </h3>
                  <div className="flex items-center ml-auto">
                    <span className="text-lg md:text-xl 2xl:text-2xl font-semibold text-headline">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-bg1/20 to-bg4/5 pt-10 pb-10 2xl:py-16 text-center flex items-center flex-col">
          <h2 className="text-3xl 2xl:text-4xl font-alegreya font-bold text-headline mb-6">
            Looking for More Options?
          </h2>
          <button
            onClick={() => router.push("/products")}
            className="bg-bg4/90 text-white flex flex-row items-center gap-x-3 font-semibold font-mont text-lg 2xl:text-xl px-8 py-4 rounded-lg hover:bg-bg4 transition-colors"
          >
            Shop for more Hampers
            <BsArrowUpRightCircleFill size={32} />
          </button>
        </div>

        <Footer />
      </div>
      <WhatsappRedirect />
      <DeliveryDateModal
        isOpen={showDateModal}
        onClose={() => setShowDateModal(false)}
        onConfirm={handleDateConfirm}
      />
      <AgeVerificationModal
        isOpen={showAgeVerification}
        onClose={() => {
          setShowAgeVerification(false);
          setPendingAction(null);
        }}
        onConfirm={handleAgeVerification}
      />
      {isModalOpen && window?.innerWidth > 768 && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onWheel={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full max-w-4xl max-h-[90vh]">
            <button
              onClick={handleCloseModal}
              className="absolute right-4 top-4 z-50 bg-white rounded-full p-2 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div
              className={`w-full h-full relative ${
                zoomLevel > 1
                  ? "cursor-grab active:cursor-grabbing"
                  : "cursor-zoom-in"
              }`}
              onClick={(e) => {
                if (!isDragging) handleImageClick(e);
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={() => {
                setIsDragging(false);
              }}
              onMouseLeave={() => {
                setIsDragging(false);
              }}
              onWheel={handleWheel}
            >
              <div
                style={{
                  transform: `scale(${zoomLevel}) translate(${
                    imagePosition.x / zoomLevel
                  }px, ${imagePosition.y / zoomLevel}px)`,
                  transition: isDragging ? "none" : "transform 0.2s ease-out",
                  transformOrigin: "center",
                  willChange: "transform",
                }}
                className="w-full h-full flex items-center justify-center"
              >
                <CachedImage
                  src={product.carousel[currentImageIndex]}
                  alt={`${product.name} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain select-none"
                  draggable={false}
                />
              </div>

              <div
                className="absolute left-4 top-4 z-20 flex flex-col items-center gap-2 bg-white/90 p-2 rounded-lg shadow-md"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomInAtPoint(0.5, 0.5);
                  }}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-sm"
                >
                  <span className="text-xl font-bold text-gray-700">+</span>
                </button>
                <div className="text-xs font-medium text-gray-700">
                  {Math.round(zoomLevel * 100)}%
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomOutAtPoint(0.5, 0.5);
                  }}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-sm"
                >
                  <span className="text-xl font-bold text-gray-700">−</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
