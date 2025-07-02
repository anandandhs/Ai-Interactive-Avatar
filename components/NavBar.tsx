"use client";

import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import Image from "next/image";
import Logo from "../public/Svg/nav_logo.svg";
import Settings from "../public/Svg/settings.svg";
import AiChat from "../public/Svg/aiChat.svg";
import Dasboard from "../public/Svg/dashboard.svg";
import Profile from "../public/Svg/profile.svg";
import {StreamingAvatarSessionState, useStreamingAvatarSession} from "./logic";
import Link from "next/link";
import {useAuthContext} from "./Prividers/AuthProvider";
import {useRouter} from "next/navigation";

export default function NavBar({
  dashboardSwitch,
  setDashboardSwitch,
}: {
  dashboardSwitch: boolean;
  setDashboardSwitch: (value: boolean) => void;
}) {
  const auth = useAuthContext();
  const router = useRouter();
  const {stopAvatar, sessionState} = useStreamingAvatarSession();
  const handleLogout = () => {
    if (sessionState !== StreamingAvatarSessionState.INACTIVE) {
      stopAvatar();
    }
    auth?.logout();
    window.location.href = "/";
  };

  const startContent = (
    <>
      <Image src={Logo} alt="logo" />
    </>
  );

  const endContent = (
    <div className="flex align-items-center" style={{gap: "50px"}}>
      {dashboardSwitch ? (
        <Image
          src={AiChat}
          alt="dashboard"
          className="cursor-pointer"
          onClick={() => {
            setDashboardSwitch(false), router.push("/");
          }}
        />
      ) : (
        <Image
          src={Dasboard}
          alt="ai-chat"
          className="cursor-pointer"
          onClick={() => {
            setDashboardSwitch(true), router.push("/dashboard");
          }}
        />
      )}

      <Image src={Settings} alt="settings" />
      <Image src={Profile} alt="profile" />
      <Button
        icon="pi pi-sign-out"
        className="p-button-text p-button-rounded"
        onClick={handleLogout}
        tooltip="Sign out"
        tooltipOptions={{position: "bottom"}}
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
