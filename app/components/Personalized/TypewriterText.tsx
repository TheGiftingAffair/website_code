"use client";
import { useState, useEffect } from "react";

const phrases = [
  "We got you covered!",
  "Create your own unique hamper with our personalized service.",
];

export default function TypewriterText() {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typeSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting && text === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        return;
      }

      setText((prev) =>
        isDeleting ? prev.slice(0, -1) : currentPhrase.slice(0, prev.length + 1)
      );
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex]);

  return (
    <span className="font-mont font-semibold">
      {text}
      <span className="animate-blink">|</span>
    </span>
  );
}
