class ImageCache {
  private static instance: ImageCache;
  private cache: Map<string, string>;
  private failedUrls: Set<string>;

  private constructor() {
    this.cache = new Map();
    this.failedUrls = new Set();
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.clearCache());
    }
  }

  static getInstance(): ImageCache {
    if (!ImageCache.instance) {
      ImageCache.instance = new ImageCache();
    }
    return ImageCache.instance;
  }

  async getImage(url: string): Promise<string> {
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    if (this.failedUrls.has(url)) {
      return url;
    }

    try {
      // Use our proxy API route instead of direct fetch
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      this.cache.set(url, objectUrl);
      return objectUrl;
    } catch (error) {
      console.error('Error caching image:', error);
      this.failedUrls.add(url);
      return url;
    }
  }

  clearCache() {
    this.cache.forEach((objectUrl) => {
      try {
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        console.error('Error revoking URL:', error);
      }
    });
    this.cache.clear();
    this.failedUrls.clear();
  }
}

export const imageCache = ImageCache.getInstance();
