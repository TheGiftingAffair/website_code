import { useEffect } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
}

const Toast = ({ message, isVisible, onHide }: ToastProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 z-50">
      {message}
    </div>
  );
};

export default Toast;
