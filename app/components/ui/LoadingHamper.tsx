export default function LoadingHamper() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-bg1/20 to-bg4/5">
      <div className="relative w-32 h-20 mb-4">
        {/* Basket */}
        <div className="absolute w-full h-full bottom-0 rounded-lg overflow-hidden">
          {/* Main basket body */}
          <div className="absolute w-[90%] h-[92%] bottom-0 left-[5%] border-2 border-gray-600 rounded-lg bg-[#f5e6d3] overflow-hidden">
            {/* Horizontal weave lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-full h-px bg-[#d4c3b0]" />
              ))}
            </div>
            {/* Vertical weave lines */}
            <div className="absolute inset-0 flex flex-row justify-between">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-full w-px bg-[#d4c3b0]" />
              ))}
            </div>
            {/* Diagonal weave pattern */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, #e6d5c3 8px, #e6d5c3 16px),
                               repeating-linear-gradient(-45deg, transparent, transparent 8px, #e6d5c3 8px, #e6d5c3 16px)`,
              }}
            />
          </div>
          {/* Basket rim */}
          <div className="absolute top-[8%] left-[2.5%] w-[95%] h-[6px] border-2 border-gray-600 rounded-full bg-[#e6d5c3]" />
        </div>
        {/* Bouncing items */}
        <div
          className="absolute -top-2 left-1/4 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-80"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="absolute -top-1 right-1/4 w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-80"
          style={{ animationDelay: "0.4s" }}
        />
        <div
          className="absolute -top-3 left-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce opacity-80"
          style={{ animationDelay: "0.6s" }}
        />
      </div>
      <p className="text-2xl font-alegreya font-semibold text-headline animate-pulse">
        Loading your hamper...
      </p>
    </div>
  );
}
