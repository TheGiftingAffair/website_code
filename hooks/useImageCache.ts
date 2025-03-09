import { useState, useEffect } from 'react';
import { imageCache } from '../utils/imageCache';

export function useImageCache(url: string | undefined) {
  const [cachedUrl, setCachedUrl] = useState<string | undefined>(url);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadImage = async () => {
      try {
        const cached = await imageCache.getImage(url);
        if (isMounted) {
          setCachedUrl(cached);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading cached image:', error);
        if (isMounted) {
          setCachedUrl(url);
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { cachedUrl, loading };
}
