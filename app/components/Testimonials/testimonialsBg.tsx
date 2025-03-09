import React from "react";

const AnimatedCubesBackground = () => {
  const colors = {
    bg1: "#FFFCEF", // Lighter background
    bg3: "#FF7700", // Brighter orange
    bg4: "#FA4032", // Brighter red
  };

  return (
    <div className="absolute inset-0 w-full h-full -z-10">
      <svg
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <pattern
          id="cubePattern"
          width="256"
          height="192"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(0.5 0.5)"
        >
          <g transform="translate(0 -256)">
            <rect width="512" height="512" fill={colors.bg1} />

            {[0, 192, 384].map((yOffset) => (
              <g key={yOffset}>
                <use href="#cube-top" x="0" y={64 + yOffset} />
                <use href="#cube-top" x="128" y={64 + yOffset} />
                <use href="#cube-middle" x="-64" y={96 + yOffset} />
                <use href="#cube-middle" x="64" y={96 + yOffset} />
                <use href="#cube-middle" x="192" y={96 + yOffset} />
              </g>
            ))}

            <defs>
              <g id="cube-top">
                <path fill={`${colors.bg4}88`}>
                  <animate
                    attributeName="d"
                    dur="0s" // Stopped the animation
                    repeatCount="indefinite"
                    calcMode="linear"
                    values="M64 64 L0 32 L0 96 L64 128Z;
                            M64 64 L0 32 L0 32 L64 64Z;
                            M64 64 L0 32 L0 32 L64 64Z;
                            M64 64 L0 32 L0 32 L64 64Z"
                  />
                </path>
                <path fill={`${colors.bg3}88`}>
                  <animate
                    attributeName="d"
                    dur="0s" // Stopped the animation
                    repeatCount="indefinite"
                    calcMode="linear"
                    values="M64 64 L128 32 L128 96 L64 128Z;
                            M64 64 L128 32 L128 32 L64 64Z;
                            M64 64 L128 32 L128 32 L64 64Z;
                            M64 64 L128 32 L128 32 L64 64Z"
                  />
                </path>
                <path fill={`${colors.bg4}88`}>
                  <animate
                    attributeName="d"
                    dur="0s" // Stopped the animation
                    repeatCount="indefinite"
                    calcMode="linear"
                    keyTimes="0;.33;1"
                    values="M64 256 L0 224 L0 224 L64 256Z;
                            M64 192 L0 160 L0 224 L64 256Z;
                            M64 64 L0 32 L0 96 L64 128Z"
                  />
                </path>
                <path fill={`${colors.bg3}88`}>
                  <animate
                    attributeName="d"
                    dur="0s" // Stopped the animation
                    repeatCount="indefinite"
                    calcMode="linear"
                    keyTimes="0;.33;1"
                    values="M64 256 L128 224 L128 224 L64 256Z;
                            M64 192 L128 160 L128 224 L64 256Z;
                            M64 64 L128 32 L128 96 L64 128Z"
                  />
                </path>
              </g>
              <g id="cube-middle">
                <path fill={`${colors.bg3}88`}>
                  <animate
                    attributeName="d"
                    dur="0s" // Stopped the animation
                    repeatCount="indefinite"
                    calcMode="linear"
                    values="M64 128 L128 96 L128 160 L64 192Z;
                            M64 64 L128 32 L128 96 L64 128Z;
                            M64 64 L128 32 L128 32 L64 64Z;
                            M64 64 L128 32 L128 32 L64 64Z"
                  />
                </path>
                <path fill={`${colors.bg4}88`}>
                  <animate
                    attributeName="d"
                    dur="0s" // Stopped the animation
                    repeatCount="indefinite"
                    calcMode="linear"
                    values="M64 128 L0 96 L0 160 L64 192Z;
                            M64 64 L0 32 L0 96 L64 128Z;
                            M64 64 L0 32 L0 32 L64 64Z;
                            M64 64 L0 32 L0 32 L64 64Z"
                  />
                </path>
                <path fill={`${colors.bg3}88`}>
                  <animate
                    attributeName="d"
                    dur="0s" // Stopped the animation
                    repeatCount="indefinite"
                    calcMode="linear"
                    values="M64 256 L128 224 L128 224 L64 256Z;
                            M64 256 L128 224 L128 224 L64 256Z;
                            M64 192 L128 160 L128 224 L64 256Z;
                            M64 128 L128 96 L128 160 L64 192Z"
                  />
                </path>
                <path fill={`${colors.bg4}88`}>
                  <animate
                    attributeName="d"
                    dur="0s" // Stopped the animation
                    repeatCount="indefinite"
                    calcMode="linear"
                    values="M64 256 L0 224 L0 224 L64 256Z;
                            M64 256 L0 224 L0 224 L64 256Z;
                            M64 192 L0 160 L0 224 L64 256Z;
                            M64 128 L0 96 L0 160 L64 192Z"
                  />
                </path>
              </g>
              <linearGradient id="fadeGradient" gradientTransform="rotate(90)">
                <stop offset="0.4" stopColor={`${colors.bg1}00`} />
                <stop offset="1" stopColor={colors.bg1} />
              </linearGradient>
            </defs>
          </g>
        </pattern>
        <rect width="100%" height="100%" fill="url(#cubePattern)" />
      </svg>
    </div>
  );
};

export default AnimatedCubesBackground;
