import React, {forwardRef} from "react";
import {ConnectionQuality} from "@heygen/streaming-avatar";

import {useConnectionQuality} from "../logic/useConnectionQuality";
import {useStreamingAvatarSession} from "../logic/useStreamingAvatarSession";
import {StreamingAvatarSessionState} from "../logic";
import {CloseIcon} from "../Icons";
import {Button} from "../Button";
import Texas from "../../public/Svg/texas.svg";
import Image from "next/image";
import style from "../../styles/commonStyle.module.css";

export const AvatarVideo = forwardRef<HTMLVideoElement>(({}, ref) => {
  const {sessionState, stopAvatar, stream} = useStreamingAvatarSession();
  const {connectionQuality} = useConnectionQuality();

  const isLoaded =
    sessionState === StreamingAvatarSessionState.CONNECTED && stream !== null;

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
        <video ref={ref} autoPlay playsInline className={style.videoContainer}>
          <track kind="captions" />
        </video>
      )}
      {!isLoaded && (
        <div
          className="w-full h-full flex align-items-center justify-content-center absolute"
          style={{top: 0, left: 0}}
        >
          Loading...
        </div>
      )}
    </>
  );
});
AvatarVideo.displayName = "AvatarVideo";
