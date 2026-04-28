"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getProductById } from "@/utils/productService";
import { trackMetaPixelEvent } from "@/utils/metaPixel";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  giftMessage?: string;
  specialRequest?: string;
}

interface CartContextType {
  items: CartItem[];
  deliveryDate: string | null;
  setDeliveryDate: (date: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalQuantity: () => number;
}

const CART_STORAGE_KEY = "shopping-cart";
const DELIVERY_DATE_KEY = "delivery-date";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [deliveryDate, setDeliveryDate] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(DELIVERY_DATE_KEY);
    }
    return null;
  });

  // Persist cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Persist delivery date to localStorage whenever it changes
  useEffect(() => {
    if (deliveryDate) {
      localStorage.setItem(DELIVERY_DATE_KEY, deliveryDate);
    } else {
      localStorage.removeItem(DELIVERY_DATE_KEY);
    }
  }, [deliveryDate]);

  const addToCart = async (product: {
    id: string;
    name: string;
    quantity: number;
    giftMessage?: string;
    specialRequest?: string;
  }) => {
    try {
      const productData = await getProductById(product.id);
      let shouldTrackAddToCart = false;
      if (!productData) {
        console.error("Product not found");
        return;
      }

      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.productId === product.id,
        );
        shouldTrackAddToCart = true;

        // Calculate new total quantity
        const currentTotal = currentItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const newQuantity = existingItem
          ? product.quantity + existingItem.quantity
          : product.quantity;
        const otherItemsTotal = currentTotal - (existingItem?.quantity || 0);

        // Check if adding would exceed limit
        if (otherItemsTotal + newQuantity > 25) {
          alert(
            "Cannot add items. Total cart quantity cannot exceed 25 items.",
          );
          return currentItems;
        }

        if (existingItem) {
          return currentItems.map((item) =>
            item.productId === product.id
              ? {
                  ...item,
                  quantity: newQuantity,
                  giftMessage: product.giftMessage || item.giftMessage,
                  specialRequest: product.specialRequest || item.specialRequest,
                }
              : item,
          );
        }

        return [
          ...currentItems,
          {
            id: Date.now().toString(),
            productId: product.id,
            name: product.name,
            quantity: product.quantity,
            price: productData.price,
            image: productData.image,
            giftMessage: product.giftMessage,
            specialRequest: product.specialRequest,
          },
        ];
      });

      // Trigger notification
      window.localStorage.setItem("cartAdded", `${product.name} added to cart`);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "cartAdded",
          newValue: `${product.name} added to cart`,
        }),
      );

      if (shouldTrackAddToCart) {
        trackMetaPixelEvent("AddToCart", {
          content_type: "product",
          content_ids: [product.id],
          contents: [
            {
              id: product.id,
              quantity: product.quantity,
              item_price: productData.price,
            },
          ],
          value: productData.price * product.quantity,
          currency: "SGD",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    try {
      if (quantity < 0) return;

      if (quantity === 0) {
        removeFromCart(productId);
        return;
      }

      setItems((prevItems) => {
        // Calculate total quantity excluding current item
        const currentItem = prevItems.find(
          (item) => item.productId === productId,
        );
        if (!currentItem) return prevItems;

        const otherItemsTotal = prevItems.reduce(
          (sum, item) =>
            item.productId !== productId ? sum + item.quantity : sum,
          0,
        );

        // Check if new quantity would exceed limit
        if (otherItemsTotal + quantity > 25) {
          alert(
            "Cannot update quantity. Total cart quantity cannot exceed 25 items.",
          );
          return prevItems;
        }

        return prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeFromCart = (productId: string) => {
    try {
      setItems((prevItems) =>
        prevItems.filter((item) => item.productId !== productId),
      );
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalQuantity = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        deliveryDate,
        setDeliveryDate,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getSubtotal,
        getTotalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
