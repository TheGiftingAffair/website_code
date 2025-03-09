/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";

const ConfettiBackground = ({
  className = "",
  numConfetti = 35,
  colors = [
    [85, 71, 106],
    [174, 61, 99],
    [219, 56, 83],
    [244, 92, 68],
    [248, 182, 70],
  ],
}) => {
  const canvasRef = useRef(null);
  const confettiRef = useRef([]);
  const frameRef = useRef(null);
  const mouseXRef = useRef(0.5);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    const TARGET_FPS = 60; // increased for smoother animation
    const TIME_STEP = 1000 / TARGET_FPS;

    class Confetti {
      constructor() {
        this.style = colors[~~(Math.random() * colors.length)];
        this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`;
        this.r = ~~(Math.random() * 4) + 2;
        this.r2 = 2 * this.r;
        this.replace();
      }

      replace() {
        this.opacity = 0;
        this.dop = 0.01; // slightly faster opacity change
        this.x = Math.random() * (width - this.r2);
        this.y = Math.random() * (height - this.r2);
        this.xmax = width - this.r;
        this.ymax = height - this.r;
        // Restore mouse-based movement with adjusted speed
        this.vx = (Math.random() * 1 + 2) * (mouseXRef.current * 2 - 1);
        this.vy = 0.5 + Math.random() * 0.4; // slightly faster vertical speed
      }

      draw(deltaTime) {
        const timeScale = deltaTime / 16.67; // normalize to ~60fps

        // Update velocity based on mouse position
        const targetVx = (Math.random() * 1 + 2) * (mouseXRef.current * 2 - 1);
        this.vx += (targetVx - this.vx) * 0.1; // smooth transition

        this.x += this.vx * timeScale;
        this.y += this.vy * timeScale;
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
        context.arc(~~this.x, ~~this.y, this.r, 0, 2 * Math.PI, false);
        context.fillStyle = `${this.rgb},${this.opacity})`;
        context.fill();
      }
    }

    const resizeWindow = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const initConfetti = () => {
      confettiRef.current = Array(numConfetti)
        .fill(null)
        .map(() => new Confetti());
    };

    const step = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;

      // Only update if enough time has passed
      if (deltaTime >= TIME_STEP) {
        context.clearRect(0, 0, width, height);
        confettiRef.current.forEach((confetti) => confetti.draw(deltaTime));
        lastTimeRef.current = timestamp;
      }

      frameRef.current = requestAnimationFrame(step);
    };

    const handleMouseMove = (e) => {
      mouseXRef.current = e.pageX / width;
      // Update all confetti velocities
      confettiRef.current.forEach((confetti) => {
        const targetVx = (Math.random() * 1 + 2) * (mouseXRef.current * 2 - 1);
        confetti.vx += (targetVx - confetti.vx) * 0.1;
      });
    };

    // Initialize
    resizeWindow();
    initConfetti();
    frameRef.current = requestAnimationFrame(step);

    // Event listeners
    window.addEventListener("resize", resizeWindow);
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeWindow);
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [colors, numConfetti]);

  return (
    <div
      className={`absolute inset-0 z-10 pointer-events-none opacity-50 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ background: "transparent" }}
      />
    </div>
  );
};

export default ConfettiBackground;
