import { useCallback, useEffect } from "react";
import { Toast } from "primereact/toast";

import { useStreamingAvatarContext } from "./context";
import { useMicrophone } from "./useMicrophone";

export const useVoiceChat = (toastRef?: React.RefObject<Toast | null>) => {
  const {
    avatarRef,
    isMuted,
    setIsMuted,
    isVoiceChatActive,
    setIsVoiceChatActive,
    isVoiceChatLoading,
    setIsVoiceChatLoading,
  } = useStreamingAvatarContext();

  const {
    permission,
    ensurePermission,
    error: microphoneError,
    isSupported: isMicrophoneSupported,
  } = useMicrophone();

  const startVoiceChat = useCallback(
    async (isInputAudioMuted?: boolean) => {
      if (!avatarRef.current) return;

      // Check microphone support
      if (!isMicrophoneSupported) {
        console.error("Microphone not supported by this browser");
        toastRef?.current?.show({
          severity: "error",
          summary: "Microphone Not Supported",
          detail: "Your browser does not support microphone access.",
          life: 5000,
        });
        return;
      }

      setIsVoiceChatLoading(true);

      try {
        // Let HeyGen SDK handle microphone access - it will prompt for permission
        console.log(
          "🎤 Starting voice chat - HeyGen SDK will request microphone access"
        );
        await avatarRef.current?.startVoiceChat({
          isInputAudioMuted,
        });

        // If we reach here, voice chat started successfully
        setIsVoiceChatActive(true);
        setIsMuted(!!isInputAudioMuted);

        console.log("✅ Voice chat started successfully");
      } catch (error) {
        console.error("❌ Error starting voice chat:", error);

        // Check if it's a permission-related error
        if (
          error instanceof Error &&
          (error.message.includes("Permission") ||
            error.message.includes("NotAllowedError") ||
            error.message.includes("microphone"))
        ) {
          toastRef?.current?.show({
            severity: "warn",
            summary: "Microphone Permission Required",
            detail:
              "Please allow microphone access to use voice chat with the avatar.",
            life: 5000,
          });

          // Set voice chat as "active" but muted to show the microphone button
          setIsVoiceChatActive(true);
          setIsMuted(true);
        } else {
          // Other errors
          toastRef?.current?.show({
            severity: "error",
            summary: "Voice Chat Error",
            detail: "Failed to start voice chat. Please try again.",
            life: 5000,
          });
        }
      } finally {
        setIsVoiceChatLoading(false);
      }
    },
    [
      avatarRef,
      setIsMuted,
      setIsVoiceChatActive,
      setIsVoiceChatLoading,
      isMicrophoneSupported,
      toastRef,
    ]
  );

  const stopVoiceChat = useCallback(() => {
    if (!avatarRef.current) return;
    avatarRef.current?.closeVoiceChat();
    setIsVoiceChatActive(false);
    setIsMuted(true);
  }, [avatarRef, setIsMuted, setIsVoiceChatActive]);

  const muteInputAudio = useCallback(() => {
    if (!avatarRef.current) return;
    avatarRef.current?.muteInputAudio();
    setIsMuted(true);
  }, [avatarRef, setIsMuted]);

  const unmuteInputAudio = useCallback(async () => {
    if (!avatarRef.current) return;

    try {
      // Check if we have microphone permission before unmuting
      if (permission !== "granted") {
        console.log("🎤 Requesting microphone permission before unmuting");
        const hasPermission = await ensurePermission();
        if (!hasPermission) {
          console.error("Cannot unmute: microphone permission denied");
          toastRef?.current?.show({
            severity: "warn",
            summary: "Microphone Permission Required",
            detail: "Please allow microphone access to unmute.",
            life: 3000,
          });
          return;
        }
      }

      avatarRef.current?.unmuteInputAudio();
      setIsMuted(false);
      console.log("🎤 Microphone unmuted successfully");
    } catch (error) {
      console.error("Error unmuting microphone:", error);
      toastRef?.current?.show({
        severity: "error",
        summary: "Unmute Failed",
        detail: "Failed to unmute microphone. Please try again.",
        life: 3000,
      });
    }
  }, [avatarRef, setIsMuted, permission, ensurePermission, toastRef]);

  // Check microphone permission on mount
  useEffect(() => {
    if (isMicrophoneSupported) {
      console.log(
        "🎤 Microphone supported, checking initial permission status"
      );
      // Query permission status without requesting access
      navigator.permissions
        ?.query?.({ name: "microphone" as any })
        .then((status) => {
          console.log(
            "🎤 Initial microphone permission status:",
            status?.state
          );
        })
        .catch(() => {
          console.log("🎤 Permission API not available, will check on demand");
        });
    } else {
      console.log("❌ Microphone not supported by this browser");
    }
  }, [isMicrophoneSupported]);

  return {
    startVoiceChat,
    stopVoiceChat,
    muteInputAudio,
    unmuteInputAudio,
    isMuted,
    isVoiceChatActive,
    isVoiceChatLoading,
    // Microphone-related properties
    microphonePermission: permission,
    microphoneError,
    isMicrophoneSupported,
    ensurePermission,
  };
};
