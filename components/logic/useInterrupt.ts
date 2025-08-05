import { useCallback } from "react";

import { useStreamingAvatarContext } from "./context";

export const useInterrupt = () => {
  const { avatarRef } = useStreamingAvatarContext();

  const interrupt = useCallback(() => {
    try {
      if (!avatarRef.current) {
        console.warn("Cannot interrupt: Avatar reference is null");
        return;
      }

      console.log("🛑 Interrupting avatar...");
      avatarRef.current.interrupt();
    } catch (error) {
      console.error("Error during interrupt:", error);
      // Don't re-throw as interrupt should be non-blocking
    }
  }, [avatarRef]);

  return { interrupt };
};
