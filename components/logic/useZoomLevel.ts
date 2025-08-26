import { useEffect, useState } from "react";

/**
 * Custom hook to track browser zoom level
 * @returns current zoom level as a number (e.g., 1 for 100%, 1.25 for 125%)
 */
export const useZoomLevel = (): number => {
  const [zoomLevel, setZoomLevel] = useState<number>(window.devicePixelRatio);

  useEffect(() => {
    const updateZoom = () => setZoomLevel(window.devicePixelRatio);

    // Listen for zoom/resize/orientation changes
    window.addEventListener("resize", updateZoom);
    window.addEventListener("orientationchange", updateZoom);

    return () => {
      window.removeEventListener("resize", updateZoom);
      window.removeEventListener("orientationchange", updateZoom);
    };
  }, []);

  return zoomLevel;
};
