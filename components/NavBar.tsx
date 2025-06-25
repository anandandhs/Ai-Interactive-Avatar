"use client";

import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { useAuth } from "./logic/useAuth";

export default function NavBar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const startContent = (
    <div className="flex align-items-center" style={{ gap: "var(--space-4)" }}>
      <div
        className="flex align-items-center justify-content-center"
        style={{
          width: "3rem",
          height: "3rem",
          backgroundColor: "var(--primary-color)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <i
          className="pi pi-user-plus"
          style={{
            fontSize: "1.25rem",
            color: "var(--bg-primary)",
          }}
        />
      </div>
      <div className="flex flex-column">
        <span
          className="text-heading-medium"
          style={{
            color: "var(--text-primary)",
            letterSpacing: "-0.025em",
            lineHeight: "1.2",
          }}
        >
          AI Avatar
        </span>
        <span
          className="text-caption"
          style={{
            color: "var(--text-secondary)",
            marginTop: "-2px",
          }}
        >
          Interactive Experience
        </span>
      </div>
    </div>
  );

  const endContent = (
    <div className="flex align-items-center" style={{ gap: "var(--space-4)" }}>
      <div className="flex flex-column align-items-end">
        <span
          className="text-body-small font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome back
        </span>
        <span
          className="text-caption"
          style={{ color: "var(--text-secondary)" }}
        >
          {user?.displayName || user?.username || "User"}
        </span>
      </div>
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
