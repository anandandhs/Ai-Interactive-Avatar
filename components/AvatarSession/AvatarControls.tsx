import React from "react";
import { SelectButton } from "primereact/selectbutton";

import { useVoiceChat } from "../logic/useVoiceChat";
import { Button } from "../Button";
import { useInterrupt } from "../logic/useInterrupt";

import { AudioInput } from "./AudioInput";
import { TextInput } from "./TextInput";
import style from "../../styles/commonStyle.module.css";

export const AvatarControls: React.FC = () => {
  const {
    isVoiceChatLoading,
    isVoiceChatActive,
    startVoiceChat,
    stopVoiceChat,
  } = useVoiceChat();
  const { interrupt } = useInterrupt();

  const chatOptions = [
    { label: "Voice Chat", value: "voice" },
    { label: "Text Chat", value: "text" },
  ];

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
    <div className="flex justify-content-center gap-3 relative w-full align-items-center">
      {/* <SelectButton
        value={currentChatMode}
        onChange={(e) => handleChatModeChange(e.value)}
        options={chatOptions}
        disabled={isVoiceChatLoading}
        className={isVoiceChatLoading ? "opacity-50" : ""}
      /> */}
      {(isVoiceChatActive || isVoiceChatLoading) && <AudioInput />}
      {/* <TextInput /> */}
      <div className="absolute" style={{ right: "12px" }}>
        <Button
          // severity="secondary"
          onClick={interrupt}
          className={style.interruptButton}
        >
          Interrupt
        </Button>
      </div>
    </div>
  );
};
