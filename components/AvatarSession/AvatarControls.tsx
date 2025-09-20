import React, {useState} from "react";
import {SelectButton} from "primereact/selectbutton";
import {ElevenLabsModel} from "@heygen/streaming-avatar";

import {useVoiceChat} from "../logic/useVoiceChat";
import {Button} from "../Button";
import {useInterrupt} from "../logic/useInterrupt";

import {AudioInput} from "./AudioInput";
import {TextInput} from "./TextInput";
import style from "../../styles/commonStyle.module.css";
import {Dropdown} from "primereact/dropdown";
import {useAuthContext} from "../Prividers/AuthProvider";
import Image from "next/image";

interface AvatarControlsProps {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  currentModel?: ElevenLabsModel;
  onModelChange?: (model: ElevenLabsModel, language: string) => void;
}

export const AvatarControls: React.FC<AvatarControlsProps> = ({
  currentLanguage,
  setCurrentLanguage,
  currentModel,
  onModelChange,
}: {
  currentLanguage: string;
  setCurrentLanguage: (language: string) => void;
  currentModel?: ElevenLabsModel;
  onModelChange?: (model: ElevenLabsModel, language: string) => void;
}) => {
  const {isVoiceChatLoading, isVoiceChatActive, startVoiceChat, stopVoiceChat} =
    useVoiceChat();
  const {interrupt} = useInterrupt();

  const auth = useAuthContext();

  const chatOptions = [
    {label: "Voice Chat", value: "voice"},
    {label: "Text Chat", value: "text"},
  ];

  const languageOptions = [
    {label: "English", value: "en"},
    {label: "Spanish", value: "es"},
  ];

  const modelOptions = [
    {label: "Flash V2.5", value: ElevenLabsModel.eleven_flash_v2_5},
    {label: "Multilingual V2", value: ElevenLabsModel.eleven_multilingual_v2},
  ];

  const handleLanguageChange = (newLanguage: string) => {
    console.log("🌐 Language change requested:", newLanguage);
    console.log("🌐 Current language before change:", currentLanguage);
    setCurrentLanguage(newLanguage);
    if (
      auth?.user?.username?.toLowerCase() === "john.keating@papyrrus.com" &&
      onModelChange &&
      currentModel
    ) {
      console.log(
        "✅ Triggering language change for john.keating@papyrrus.com"
      );
      onModelChange(currentModel, newLanguage);
    }
  };

  const handleModelChange = (newModel: ElevenLabsModel) => {
    console.log("🔄 Model change requested:", newModel);
    if (
      auth?.user?.username?.toLowerCase() === "john.keating@papyrrus.com" &&
      onModelChange
    ) {
      console.log("✅ Triggering model change for john.keating@papyrrus.com");
      onModelChange(newModel, currentLanguage);
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
        <div className="flex" style={{gap: "1rem", marginRight: "2rem"}}>
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
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.value)}
              options={languageOptions}
              className={isVoiceChatLoading ? "opacity-50" : ""}
              style={{width: "10rem"}}
              placeholder="Language"
            />
            <Button
              // severity="secondary"
              onClick={interrupt}
              className={style.interruptButton}
            >
              Interrupt
            </Button>
            {(isVoiceChatActive || isVoiceChatLoading) && <AudioInput />}
          </div>
        </div>
      )}
    </div>
  );
};
