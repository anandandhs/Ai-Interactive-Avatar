"use client";

import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import Image from "next/image";

import Profile from "../public/Svg/profile.svg";
import {
  StreamingAvatarSessionState,
  useApiPost,
  useInterrupt,
  useMessageHistory,
  useStreamingAvatarSession,
} from "./logic";
import Link from "next/link";
import { useAuthContext } from "./Prividers/AuthProvider";
import { useRouter } from "next/navigation";
import { useThemeIcons } from "./logic/useThemeIcon";
import { SessionRequest, SessionResponse } from "./logic/apiConfig";
import { useSelectedAvatarLanguage } from "./logic/useSelectedAvatarLanguage";
import { useEffect, useRef } from "react";

export default function NavBar({
  dashboardSwitch,
  setDashboardSwitch,
}: {
  dashboardSwitch: boolean;
  setDashboardSwitch: (value: boolean) => void;
}) {
  const auth = useAuthContext();
  const router = useRouter();
  const { stopAvatar, sessionState } = useStreamingAvatarSession();
  const { settingsIcon, dashboardIcon, aiChatIcon } = useThemeIcons();
  const { interrupt } = useInterrupt();

  const postSessionApi = useApiPost<SessionResponse>("/AI/CreateUserSession");
  const { messages } = useMessageHistory();
  const { selectedLanguage } = useSelectedAvatarLanguage();

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
    console.log("📝 NavBar messages updated:", messages.length, "messages");
  }, [messages]);

  const handleLogout = async () => {
    // Capture messages BEFORE any cleanup that might clear them
    const messagesToSave = messagesRef.current;
    console.log(
      "💾 Capturing messages before logout:",
      messagesToSave.length,
      "messages"
    );
    console.log("💾 Messages content:", messagesToSave);

    // 1) Try to clean up any running avatar session
    try {
      if (sessionState !== StreamingAvatarSessionState.INACTIVE) {
        console.log("🔌 Cleaning up avatar session before logout...");
        interrupt();
        // short pause to let interrupt take effect
        await new Promise((resolve) => setTimeout(resolve, 300));
        await stopAvatar();
      }
    } catch (error) {
      console.error("Error during avatar cleanup:", error);
      // continue to attempt session persist + logout even if cleanup fails
    }

    // 2) Try to persist session info to server
    try {
      const sessionId = localStorage.getItem("sessionId") || "";

      // Filter out greeting messages (same filter as MessageHistory component)
      const filteredMessages = messagesToSave.filter(
        (msg) =>
          msg.content !== `Hi, my name is ${auth?.user?.displayName}` &&
          msg.content !== `Hola, me llamo ${auth?.user?.displayName}`
      );

      console.log("🔍 Filtered messages:", filteredMessages.length, "messages");
      console.log("🔍 Filtered content:", filteredMessages);

      const sessionRequest: SessionRequest = {
        sessionId,
        preferredLanguage: selectedLanguage,
        metadata: JSON.stringify(
          filteredMessages.length > 0 ? { messages: filteredMessages } : {}
        ),
      };

      console.log("📤 Sending session request:", sessionRequest);

      await postSessionApi.execute({
        data: sessionRequest,
      });
    } catch (error) {
      console.error("Error saving session on logout:", error);
    } finally {
      // 3) Ensure logout/navigation happens regardless of errors above
      try {
        auth?.logout();
      } catch (e) {
        console.error("Error calling auth.logout():", e);
      }
      // Use router to navigate client-side
      router.push("/");
    }
  };

  const startContent = (
    <>
      <Image
        src={process.env.NEXT_PUBLIC_LOGO!}
        alt="logo"
        width={60}
        height={60}
      />
    </>
  );

  const endContent = (
    <div className="flex align-items-center" style={{ gap: "50px" }}>
      {dashboardSwitch ? (
        <Image
          src={aiChatIcon}
          alt="dashboard"
          className="cursor-pointer"
          onClick={() => {
            (setDashboardSwitch(false), router.push("/"));
          }}
        />
      ) : (
        <Image
          src={dashboardIcon}
          alt="ai-chat"
          className="cursor-pointer"
          onClick={() => {
            (setDashboardSwitch(true), router.push("/dashboard"));
          }}
        />
      )}

      <Image src={settingsIcon} alt="settings" />
      <Image src={Profile} alt="profile" />
      <Button
        icon="pi pi-sign-out"
        className="p-button-text p-button-rounded"
        onClick={handleLogout}
        tooltip="Sign out"
        tooltipOptions={{ position: "bottom" }}
        style={{
          color: "var(--error-color)",
          backgroundColor: "transparent",
          border: "2px solid var(--error-color)",
          borderRadius: "var(--radius-full)",
          width: "2.5rem",
          height: "2.5rem",
          padding: "0",
        }}
        aria-label="Sign out of your account"
      />
    </div>
  );

  return (
    <Toolbar
      start={startContent}
      end={endContent}
      className="border-none"
      style={{
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-light)",
        padding: "var(--space-4) var(--space-8)",
        boxShadow: "var(--shadow-sm)",
        minHeight: "5rem",
      }}
    />
  );
}
