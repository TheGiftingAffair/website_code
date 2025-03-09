const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full -z-10">
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <linearGradient id="grad" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor="#d775a4" />
          <stop offset="100%" stopColor="#82204f" />
        </linearGradient>
        <pattern
          id="grid"
          width="400"
          height="106"
          patternUnits="userSpaceOnUse"
        >
          {Array.from({ length: 51 }).map((_, i) => (
            <circle
              key={i}
              cx={i * 8}
              fill={i % 3 === 0 ? "#82204f" : "#d775a4"}
            >
              <animate
                attributeName="cy"
                values="4; 102; 4"
                dur="24500ms"
                begin={`-${(i * 490) % 24500}ms`}
                repeatCount="indefinite"
                keyTimes="0;0.28;1"
                keySplines="0.28 0.07 0.25 0.73; 0.73 0.25 0.07 0.28"
                calcMode="spline"
              />
              <animate
                attributeName="r"
                values="1; 4; 1"
                dur="12250ms"
                begin={`-${(i * 490) % 12250}ms`}
                repeatCount="indefinite"
                keyTimes="0;0.28;1"
                keySplines="0.28 0.07 0.25 0.73; 0.73 0.25 0.07 0.28"
                calcMode="spline"
              />
            </circle>
          ))}
        </pattern>
        <rect width="100%" height="100%" fill="url(#grad)" />
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

export default AnimatedBackground;
