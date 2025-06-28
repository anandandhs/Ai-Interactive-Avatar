import React, { forwardRef, useEffect, useRef, useState } from "react";
import { ConnectionQuality } from "@heygen/streaming-avatar";

import { useConnectionQuality } from "../logic/useConnectionQuality";
import { useStreamingAvatarSession } from "../logic/useStreamingAvatarSession";
import { StreamingAvatarSessionState } from "../logic";
import { CloseIcon } from "../Icons";
import { Button } from "../Button";
import { useAuth } from "../logic/useAuth";
import { AVATARS } from "@/app/lib/constants";
import Texas from "../../public/Svg/texas.svg";
import Image from "next/image";

export const AvatarVideo = forwardRef<HTMLVideoElement>(({}, ref) => {
  const { sessionState, stream } = useStreamingAvatarSession();
  const { connectionQuality } = useConnectionQuality();
  const { user } = useAuth();
  const [removeBG] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Determine current avatar based on user
  const currentAvatarId =
    user?.username === "irwin.spinello@papyrrus.com"
      ? AVATARS[0].avatar_id
      : AVATARS[1].avatar_id;

  // Check if current avatar is Pedro (which needs different positioning)
  const isPedroAvatar = currentAvatarId === "Pedro_Black_Suit_public";

  // Define conditional styles based on avatar type
  const getVideoStyles = () => {
    const baseStyles = {
      display: removeBG ? "none" : "block",
      position: "absolute" as const,
      zIndex: 1,
    };

    // Use the same sizing and positioning for both avatars
    return {
      ...baseStyles,
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
    };
  };

  const getCanvasStyles = () => {
    const baseStyles = {
      display: removeBG ? "block" : "none",
      backgroundColor: "transparent",
      position: "absolute" as const,
      zIndex: 1,
    };

    // Use the same sizing and positioning for both avatars
    return {
      ...baseStyles,
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
    };
  };

  const isLoaded =
    sessionState === StreamingAvatarSessionState.CONNECTED && stream !== null;

  // Chroma key processing effect - using proven algorithm from reference
  useEffect(() => {
    if (!removeBG || !isLoaded || !ref || typeof ref === "function") return;

    const renderCanvas = () => {
      const video = ref.current;
      const canvas = canvasRef.current;

      if (!canvas || !video) return;

      // Check if video has loaded and has valid dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        return requestAnimationFrame(renderCanvas);
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        if (isCloseToGreen([red, green, blue])) {
          data[i + 3] = 0; // Set alpha channel to 0 (transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return requestAnimationFrame(renderCanvas); // Return the request ID
    };

    const isCloseToGreen = (color: number[]) => {
      const [red, green, blue] = color;
      // Adjust threshold based on avatar type - Pedro might need different sensitivity
      const th = isPedroAvatar ? 100 : 120; // Pedro uses lower threshold
      return green > th && red < th && blue < th;
    };

    const animationFrameId = renderCanvas(); // Start the animation loop

    // Clean up function to cancel animation frame
    return () => cancelAnimationFrame(animationFrameId!);
  }, [removeBG, isLoaded, isPedroAvatar]);

  return (
    <>
      {connectionQuality !== ConnectionQuality.UNKNOWN && (
        <div
          className="absolute border-round-lg px-3 py-2"
          style={{
            top: "12px",
            left: "12px",
            backgroundColor: "#000000",
            color: "#ffffff",
          }}
        >
          Connection Quality: {connectionQuality}
        </div>
      )}

      {/* {isLoaded && (
        <Button
          className="absolute p-2 z-1"
          style={{
            top: "12px",
            right: "12px",
            backgroundColor: "rgba(63, 63, 70, 0.5)",
          }}
          onClick={stopAvatar}
          icon={<CloseIcon />}
        />
      )} */}
      {isLoaded && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden", // Prevent content from extending beyond container
          }}
        >
          <Image
            src={Texas}
            alt="texas"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          />

          <video ref={ref} autoPlay playsInline style={getVideoStyles()}>
            <track kind="captions" />
          </video>
          <canvas ref={canvasRef} style={getCanvasStyles()} />
        </div>
      )}
      {!isLoaded && (
        <div
          className="w-full h-full flex align-items-center justify-content-center absolute"
          style={{ top: 0, left: 0 }}
        >
          Loading...
        </div>
      )}
    </>
  );
});
AvatarVideo.displayName = "AvatarVideo";
