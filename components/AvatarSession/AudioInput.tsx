import React from "react";
import { Toast } from "primereact/toast";

import { useVoiceChat } from "../logic/useVoiceChat";
import { Button } from "../Button";
import { LoadingIcon, MicIcon, MicOffIcon } from "../Icons";
import style from "../../styles/commonStyle.module.css";
import clsx from "clsx";

interface AudioInputProps {
  toastRef?: React.RefObject<Toast>;
}

export const AudioInput: React.FC<AudioInputProps> = ({ toastRef }) => {
  const {
    muteInputAudio,
    unmuteInputAudio,
    isMuted,
    isVoiceChatLoading,
    microphonePermission,
    microphoneError,
    isMicrophoneSupported,
    ensurePermission,
  } = useVoiceChat(toastRef);

  const handleMuteClick = async () => {
    // If microphone permission is not granted, try to get permission first
    if (microphonePermission !== "granted") {
      const hasPermission = await ensurePermission();
      if (!hasPermission) {
        console.error("Cannot toggle microphone: permission denied");
        return;
      }
    }

    if (isMuted) {
      await unmuteInputAudio();
    } else {
      muteInputAudio();
    }
  };

  // Determine button state based on microphone permission and support
  const isButtonDisabled =
    isVoiceChatLoading ||
    !isMicrophoneSupported ||
    microphonePermission === "denied";
  const buttonTitle = !isMicrophoneSupported
    ? "Microphone not supported"
    : microphonePermission === "denied"
      ? "Microphone permission denied"
      : microphoneError
        ? `Microphone error: ${microphoneError}`
        : isMuted
          ? "Unmute microphone"
          : "Mute microphone";

  return (
    <div>
      <Button
        className={clsx(`p-0 relative`, style.micButton)}
        disabled={isButtonDisabled}
        onClick={handleMuteClick}
        title={buttonTitle}
      >
        {/* <div
          className={`absolute left-0 top-0 rounded-lg border-2 border-[#7559FF] w-full h-full ${
            isUserTalking ? "animate-ping" : ""
          }`}
        /> */}
        {isVoiceChatLoading ? (
          <LoadingIcon className="animate-spin" size={20} />
        ) : microphonePermission === "denied" ? (
          <MicOffIcon size={20} className="text-red-500" />
        ) : !isMicrophoneSupported ? (
          <MicOffIcon size={20} className="text-gray-400" />
        ) : isMuted ? (
          <MicOffIcon size={20} />
        ) : (
          <MicIcon size={20} />
        )}
      </Button>
    </div>
  );
};
