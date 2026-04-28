export type MetaPixelEventParams = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (
      command: string,
      event: string,
      params?: MetaPixelEventParams,
    ) => void;
  }
}

const MAX_RETRIES = 10;
const RETRY_DELAY = 100; // ms

export const trackMetaPixelEvent = (
  event: string,
  params?: MetaPixelEventParams,
) => {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim()) return;

  let retries = 0;

  const attemptTrack = () => {
    if (typeof window.fbq === "function") {
      window.fbq("track", event, params);
      console.log(`[Meta Pixel] Tracked: ${event}`, params);
      return;
    }

    if (retries < MAX_RETRIES) {
      retries++;
      setTimeout(attemptTrack, RETRY_DELAY);
    } else {
      console.warn(
        `[Meta Pixel] fbq not available after ${MAX_RETRIES} retries for event: ${event}`,
      );
    }
  };

  attemptTrack();
};
