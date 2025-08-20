import React, { forwardRef, useEffect, useRef, useState } from "react";
import { ConnectionQuality } from "@heygen/streaming-avatar";

import { useConnectionQuality } from "../logic/useConnectionQuality";
import { useStreamingAvatarSession } from "../logic/useStreamingAvatarSession";
import { StreamingAvatarSessionState } from "../logic";
import { CloseIcon } from "../Icons";
import { Button } from "../Button";
import { AVATARS } from "@/app/lib/constants";
// import Texas from "../../public/Svg/texas.svg";
import Texas from "../../public/Svg/deskBg.svg";
import accademicEnglish from "../../public/Svg/accademicEnglish.png";
import accademicSpanish from "../../public/Svg/accademicSpanish.png";
import administrationEnglish from "../../public/Svg/administrationEnglish.png";
import administrationSpanish from "../../public/Svg/administrationSpanish.png";
import admissionEnglish from "../../public/Svg/admissionEnglish.png";
import admissionSpanish from "../../public/Svg/admissionSpanish.png";
import Image from "next/image";
import { useAuthContext } from "../Prividers/AuthProvider";
import { getRequiredAvatar } from "@/app/lib/genericFunctions";
interface AvatarVideoProps {
  page: number;
}

export const AvatarVideo = forwardRef<HTMLVideoElement, AvatarVideoProps>(
  ({ page }, ref) => {
    const { sessionState, stream } = useStreamingAvatarSession();
    const { connectionQuality } = useConnectionQuality();
    const auth = useAuthContext();
    const [removeBG] = useState(true);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Determine current ava(tar based on user
    const currentAvatarId = getRequiredAvatar(
      auth?.user?.username?.toLowerCase() || "",
      auth?.user?.username?.toLowerCase() == "jason.padilla@papyrrus.com"
        ? page + 3
        : page
    );

    // Check if current avatar is Pedro (which needs different positioning)

    // Define conditional styles based on avatar type
    const getVideoStyles = () => {
      const baseStyles = {
        display: removeBG ? "none" : "block",
        position: "absolute" as const,
        zIndex: 2,
      };

      // Position avatar to fit within academic office scene
      // Avatar should appear sitting behind the white desk with monitor visible
      return {
        ...baseStyles,
        top: "25%", // Position avatar to appear behind desk
        left: "50%",
        transform: "translateX(-50%)", // Center horizontally
        width: "85%", // Scale avatar to fit the office scene
        height: "85%", // Maintain proportions
        objectFit: "cover" as const,
      };
    };

    const getCanvasStyles = (currentAvatarId: string) => {
      const baseStyles = {
        display: removeBG ? "block" : "none",
        backgroundColor: "transparent",
        position: "absolute" as const,
        zIndex: 2,
      };

      // Check if user needs special background (Texas/deskBg) - these users get different positioning
      const needsSpecialBackground =
        auth?.user?.username?.toLowerCase() == "matteo.gobeaux@papyrrus.com" ||
        auth?.user?.username?.toLowerCase() ==
          "berkley.esherwood@papyrrus.com" ||
        auth?.user?.username?.toLowerCase() == "percy.veltman@papyrrus.com";

      if (needsSpecialBackground) {
        return {
          ...baseStyles,
          top: "30%", // Positioning for Texas/deskBg background
          left: "47%",
          transform: "translateX(-50%)", // Center horizontally
          width: "80%", // Larger size for this background
          height: "70%",
          objectFit: "cover" as const,
        };
      }

      // Katya && Marianne (Administration avatars)
      if (
        currentAvatarId === AVATARS[0].avatar_id ||
        currentAvatarId === AVATARS[3].avatar_id
      ) {
        return {
          ...baseStyles,
          top: "32%", // Positioning for administration background
          left: "52%",
          transform: "translateX(-50%)", // Center horizontally
          width: "52%", // Standard size for administration
          height: "52%",
          objectFit: "cover" as const,
        };
      }

      // Thaddeus & Alessandra (Academic avatars)
      if (
        currentAvatarId === AVATARS[1].avatar_id ||
        currentAvatarId === AVATARS[4].avatar_id
      ) {
        return {
          ...baseStyles,
          top: "36.5%", // Positioning for academic background
          left: "44.5%",
          transform: "translateX(-50%)", // Center horizontally
          width: "53%", // Standard size for academic
          height: "53%",
          objectFit: "cover" as const,
        };
      }

      // Pedro && Amina (Admission avatars) - Default case
      return {
        ...baseStyles,
        top: "29.7%", // Positioning for admission background
        left: "52%",
        transform: "translateX(-50%)", // Center horizontally
        width: "52%", // Standard size for admission
        height: "52%",
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
        const th = 120; // Pedro uses lower threshold
        return green > th && red < th && blue < th;
      };

      const animationFrameId = renderCanvas(); // Start the animation loop

      // Clean up function to cancel animation frame
      return () => cancelAnimationFrame(animationFrameId!);
    }, [removeBG, isLoaded]);

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
              // Ensure responsive scaling with page zoom
              minHeight: "400px", // Minimum height for proper avatar display
              aspectRatio: "16/9", // Maintain aspect ratio for consistent layout
            }}
          >
            {/* Background office environment */}
            <Image
              src={(() => {
                // Check if user needs special background (Texas/deskBg)
                const needsSpecialBackground =
                  auth?.user?.username?.toLowerCase() ==
                    "matteo.gobeaux@papyrrus.com" ||
                  auth?.user?.username?.toLowerCase() ==
                    "berkley.esherwood@papyrrus.com" ||
                  auth?.user?.username?.toLowerCase() ==
                    "percy.veltman@papyrrus.com";

                if (needsSpecialBackground) {
                  return Texas;
                }

                // Select background based on avatar type
                switch (currentAvatarId) {
                  case AVATARS[0].avatar_id: // Katya - Administration English
                    return administrationEnglish;
                  case AVATARS[1].avatar_id: // Thaddeus - Academic English
                    return accademicEnglish;
                  case AVATARS[2].avatar_id: // Amina - Admission English
                    return admissionEnglish;
                  case AVATARS[3].avatar_id: // Marianne - Administration Spanish
                    return administrationSpanish;
                  case AVATARS[4].avatar_id: // Alessandra - Academic Spanish
                    return accademicSpanish;
                  case AVATARS[5].avatar_id: // Pedro - Admission Spanish
                    return admissionSpanish;
                  default:
                    return Texas; // Fallback
                }
              })()}
              alt="office background"
              style={{
                position: "absolute",
                top: "7%",
                left: "1.5%",
                width: "97%",
                height: "97%",
                objectFit: "contain",
                zIndex: 0,
              }}
            />

            {/* Avatar video positioned to appear behind desk */}
            <video ref={ref} autoPlay playsInline style={getVideoStyles()}>
              <track kind="captions" />
            </video>

            {/* Chroma key canvas with same positioning */}
            <canvas ref={canvasRef} style={getCanvasStyles(currentAvatarId)} />
          </div>
        )}
        {!isLoaded && (
          <div
            className="w-full h-full flex align-items-center justify-content-center absolute"
            style={{ top: 0, left: 0 }}
          >
            <div className="loader"></div>
          </div>
        )}
      </>
    );
  }
);
AvatarVideo.displayName = "AvatarVideo";
