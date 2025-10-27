import React, { useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { ElevenLabsModel } from "@heygen/streaming-avatar";
import { Toast } from "primereact/toast";

import { useVoiceChat } from "../logic/useVoiceChat";
import { Button } from "../Button";
import { useInterrupt } from "../logic/useInterrupt";

import { AudioInput } from "./AudioInput";
import { TextInput } from "./TextInput";
import style from "../../styles/commonStyle.module.css";
import { Dropdown } from "primereact/dropdown";
import { useAuthContext } from "../Prividers/AuthProvider";
import Image from "next/image";
import { useSelectedAvatarLanguage } from "../logic/useSelectedAvatarLanguage";

interface AvatarControlsProps {
  currentModel?: ElevenLabsModel;
  onModelChange?: (model: ElevenLabsModel, language: string) => void;
  toastRef?: React.RefObject<Toast>;
}

export const AvatarControls: React.FC<AvatarControlsProps> = ({
  currentModel,
  onModelChange,
  toastRef,
}: {
  currentModel?: ElevenLabsModel;
  onModelChange?: (model: ElevenLabsModel, language: string) => void;
  toastRef?: React.RefObject<Toast>;
}) => {
  const {
    isVoiceChatLoading,
    isVoiceChatActive,
    startVoiceChat,
    stopVoiceChat,
  } = useVoiceChat(toastRef);
  const { interrupt } = useInterrupt();

  const auth = useAuthContext();

  const { selectedLanguage, setSelectedLanguage, languageOptions } =
    useSelectedAvatarLanguage();

  const chatOptions = [
    { label: "Voice Chat", value: "voice" },
    { label: "Text Chat", value: "text" },
  ];

  const modelOptions = [
    { label: "Flash V2.5", value: ElevenLabsModel.eleven_flash_v2_5 },
    { label: "Multilingual V2", value: ElevenLabsModel.eleven_multilingual_v2 },
  ];

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
    if (
      auth?.user?.username?.toLowerCase() === "john.keating@papyrrus.com" &&
      onModelChange &&
      currentModel
    ) {
      onModelChange(
        currentModel === ElevenLabsModel.eleven_flash_v2_5
          ? ElevenLabsModel.eleven_multilingual_v2
          : ElevenLabsModel.eleven_flash_v2_5,
        newLanguage
      );
    }
  };

  const currentChatMode =
    isVoiceChatActive || isVoiceChatLoading ? "voice" : "text";

  const handleChatModeChange = (value: string) => {
    if (value === "voice" && !isVoiceChatActive && !isVoiceChatLoading) {
      startVoiceChat();
    } else if (value === "text" && isVoiceChatActive && !isVoiceChatLoading) {
      stopVoiceChat();
    }
  };

  return (
    <div className="flex justify-content-end gap-3 relative w-full align-items-center">
      {/* <SelectButton
        value={currentChatMode}
        onChange={(e) => handleChatModeChange(e.value)}
        options={chatOptions}
        disabled={isVoiceChatLoading}
        className={isVoiceChatLoading ? "opacity-50" : ""}
      /> */}

      {/* <TextInput /> */}

      {auth?.user?.username?.toLowerCase() === "john.keating@papyrrus.com" && (
        <div className="flex" style={{ gap: "1rem", marginRight: "2rem" }}>
          {/* <Dropdown
            value={currentModel}
            onChange={(e) => handleModelChange(e.value)}
            options={modelOptions}
            className={isVoiceChatLoading ? "opacity-50" : ""}
            style={{ width: "12rem" }}
            placeholder="Select Model"
          /> */}
          <div className="flex align-items-center">
            <Dropdown
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.value)}
              options={languageOptions}
              className={isVoiceChatLoading ? "opacity-50" : ""}
              style={{ width: "10rem" }}
              placeholder="Language"
            />
            <Button
              // severity="secondary"
              onClick={interrupt}
              className={style.interruptButton}
            >
              Interrupt
            </Button>
            <AudioInput toastRef={toastRef} />
          </div>
        </div>
      )}
    </div>
  );
};
