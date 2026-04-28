"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackMetaPixelEvent } from "@/utils/metaPixel";

export default function MetaPixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    const queryString = searchParams.toString();
    trackMetaPixelEvent("PageView", {
      page_path: queryString ? `${pathname}?${queryString}` : pathname,
    });
  }, [pathname, searchParams]);
  return null;
}
