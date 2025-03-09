import Image from 'next/image';
import { useState } from 'react';

interface CachedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function CachedImage({ src, alt, className, width = 500, height = 500 }: CachedImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <span className="text-gray-400">Image not available</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={() => setError(true)}
        onLoadingComplete={() => setIsLoading(false)}
        loading="lazy"
        unoptimized={false}
        priority={false}
      />
    </div>
  );
}
