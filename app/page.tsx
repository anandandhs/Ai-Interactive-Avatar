"use client";

import InteractiveAvatar from "@/components/InteractiveAvatar";
import { LoginPage } from "@/components/LoginPage";
import { useAuthContext } from "@/components/Prividers/AuthProvider";
import { useState } from "react";

export default function App() {
  const auth = useAuthContext();
  const [dashboardSwitch, setDashboardSwitch] = useState<boolean>(false);

  // Show loading while initializing auth state
  if (!auth?.isInitialized) {
    return (
      <div
        className="min-h-screen flex align-items-center justify-content-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div
          className="flex flex-column align-items-center"
          style={{ gap: "var(--space-4)" }}
        >
          <div className="p-progress-spinner" />
          <span
            className="text-body-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {/* Loading your experience... */}
            <div className="loader"></div>
          </span>
        </div>
      </div>
    );
  }

  if (!auth?.isAuthenticated) {
    console.log("Not authenticated", auth?.error);
    return (
      <LoginPage
        onLogin={auth.login}
        error={auth?.error}
        loading={auth?.loading}
      />
    );
  }

  return (
    <>
      <div
        className="flex-1 overflow-hidden"
        style={{
          backgroundColor: "var(--bg-primary)",
          padding: "var(--space-6) var(--space-8)",
          height: "calc(100vh - 5rem)", // Account for navbar
          maxHeight: "calc(100vh - 5rem)",
        }}
      >
        <div
          className="w-full h-full flex flex-column overflow-hidden"
          style={{
            backgroundColor: "var(--bg-secondary)",
            height: "100%",
            maxHeight: "100%",
          }}
        >
          <div
            className="w-full max-w-7xl flex flex-column mx-auto h-full overflow-hidden"
            style={{
              height: "100%",
              maxHeight: "100%",
            }}
          >
            <div
              className="w-full h-full overflow-hidden"
              style={{ height: "100%", maxHeight: "100%" }}
            >
              <InteractiveAvatar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
