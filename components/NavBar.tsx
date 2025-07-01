"use client";

import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { useAuth } from "./logic/useAuth";
import Image from "next/image";
import Logo from "../public/Svg/nav_logo.svg";
import Settings from "../public/Svg/settings.svg";
import AiChat from "../public/Svg/aiChat.svg";
import Dasboard from "../public/Svg/dashboard.svg";
import Profile from "../public/Svg/profile.svg";
import {
  StreamingAvatarSessionState,
  useStreamingAvatarSession,
} from "./logic";
import Link from "next/link";

export default function NavBar({
  isAuthenticated = false,
  dashboardSwitch,
  setDashboardSwitch,
}: {
  isAuthenticated: boolean;
  dashboardSwitch: boolean;
  setDashboardSwitch: (value: boolean) => void;
}) {
  const { logout } = useAuth();
  const { stopAvatar, sessionState } = useStreamingAvatarSession();
  const handleLogout = () => {
    if (sessionState !== StreamingAvatarSessionState.INACTIVE) {
      stopAvatar();
    }
    logout();
    window.location.href = "/";
  };

  const startContent = (
    <>
      <Image src={Logo} alt="logo" />
    </>
  );

  const endContent = (
    <div className="flex align-items-center" style={{ gap: "var(--space-4)" }}>
      {dashboardSwitch ? (
        <Link href="/dashboard">
          <Image
            src={AiChat}
            alt="dashboard"
            className="cursor-pointer"
            onClick={() => setDashboardSwitch(false)}
          />
        </Link>
      ) : (
        <Link href="/">
          <Image
            src={Dasboard}
            alt="ai-chat"
            onClick={() => setDashboardSwitch(true)}
            className="cursor-pointer"
          />
        </Link>
      )}
      <Image src={Settings} alt="settings" />
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
      end={isAuthenticated ? endContent : null}
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
