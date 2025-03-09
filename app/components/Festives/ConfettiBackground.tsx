/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef } from "react";

const NUM_CONFETTI = 75; // Reduced from 100
const COLORS = [
  [85, 71, 106],
  [174, 61, 99],
  [219, 56, 83],
  [244, 92, 68],
  [248, 182, 70],
];
const PI_2 = 2 * Math.PI;

class Confetti {
  style: number[];
  rgb: string;
  r: number;
  r2: number;
  opacity: number;
  dop: number;
  x: number;
  y: number;
  xmax: number;
  ymax: number;
  vx: number;
  vy: number;

  constructor() {
    this.style = COLORS[~~(Math.random() * 5)];
    this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
    this.r = ~~(Math.random() * 4) + 2;
    this.r2 = 2 * this.r;
    this.replace();
  }

  replace() {
    this.opacity = 0;
    this.dop = 0.01 * (Math.random() * 3 + 1); // Reduced from 0.03
    this.x = Math.random() * window.innerWidth - this.r2;
    this.y = Math.random() * window.innerHeight - this.r2;
    this.xmax = window.innerWidth - this.r;
    this.ymax = window.innerHeight - this.r;
    this.vx = (Math.random() * 1 + 4 * 0.5 - 2.5) * 0.5;
    this.vy = (0.7 * this.r + Math.random() * 2 - 1) * 0.9;
  }

  draw(context: CanvasRenderingContext2D) {
    this.x += this.vx;
    this.y += this.vy;
    this.opacity += this.dop;

    if (this.opacity > 1) {
      this.opacity = 1;
      this.dop *= -1;
    }

    if (this.opacity < 0 || this.y > this.ymax) {
      this.replace();
    }

    if (!(0 < this.x && this.x < this.xmax)) {
      this.x = (this.x + this.xmax) % this.xmax;
    }

    context.beginPath();
    context.arc(~~this.x, ~~this.y, this.r, 0, PI_2, false);
    context.fillStyle = `${this.rgb},${this.opacity})`;
    context.fill();
  }
}

const ConfettiBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const confetti = Array.from({ length: NUM_CONFETTI }, () => new Confetti());

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      confetti.forEach((c) => c.draw(context));
      setTimeout(() => requestAnimationFrame(animate), 30); // Delay between frames
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />
  );
};

export default ConfettiBackground;
