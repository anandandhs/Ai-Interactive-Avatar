"use client";

import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {useAuth} from "./logic/useAuth";
import Image from "next/image";
import Logo from "../public/Svg/nav_logo.svg";
import Settings from "../public/Svg/settings.svg";
import Profile from "../public/Svg/profile.svg";
import {useStreamingAvatarSession} from "./logic";

export default function NavBar() {
  const {user, logout} = useAuth();
  const {stopAvatar} = useStreamingAvatarSession();
  const handleLogout = () => {
    logout();
  };

  const startContent = (
    <>
      <Image src={Logo} alt="logo" />
    </>
  );

  const endContent = (
    <div className="flex align-items-center" style={{gap: "var(--space-4)"}}>
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
