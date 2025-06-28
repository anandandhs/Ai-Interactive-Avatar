"use client";

import InteractiveAvatar from "@/components/InteractiveAvatar";
import { LoginPage } from "@/components/LoginPage";
import { useAuth } from "@/components/logic/useAuth";

export default function App() {
  const { error, loading, login, isAuthenticated, isInitialized } = useAuth();

  // Show loading while initializing auth state
  if (!isInitialized) {
    return (
      <div
        className="min-h-screen flex align-items-center justify-content-center"
        style={{ backgroundColor: "var(--bg-secondary)" }}
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

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} error={error} loading={loading} />;
  }

  return (
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
  );
}
