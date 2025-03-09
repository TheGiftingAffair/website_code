"use client";
import { useState, useEffect } from "react";

interface TypeWriterProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
}

export default function TypeWriter({
  text,
  delay = 50,
  onComplete,
}: TypeWriterProps) {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, delay, text, onComplete]);

  return <span className="font-mont">{currentText}</span>;
}
