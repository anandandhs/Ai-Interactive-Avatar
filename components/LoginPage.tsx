"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { Message } from "primereact/message";

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  error?: string | null;
  loading?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  error,
  loading = false,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return;
    }

    await onLogin(username, password);
  };

  return (
    <div
      className="min-h-screen flex align-items-center justify-content-center"
      style={{
        background: "var(--bg-secondary)",
        padding: "var(--space-8)",
      }}
    >
      <Card
        className="w-full surface-card"
        style={{
          maxWidth: "28rem",
          padding: "var(--space-10)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--shadow-xl)",
          margin: "0 var(--space-4)",
          width: "calc(100% - var(--space-8))",
        }}
      >
        <div className="text-center mb-8">
          <div className="mb-6">
            <i
              className="pi pi-user-plus text-6xl"
              style={{
                color: "var(--primary-color)",
                marginBottom: "var(--space-4)",
              }}
            />
          </div>
          <h1
            className="text-display-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Welcome Back
          </h1>
          <p
            className="text-body-large"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign in to access your interactive AI avatar experience
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-column"
          style={{ gap: "var(--space-6)" }}
        >
          <div className="field">
            <label
              htmlFor="username"
              className="block text-body-medium font-medium"
              style={{
                color: "var(--text-primary)",
                marginBottom: "var(--space-2)",
              }}
            >
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={setUsername}
              placeholder="Enter your username"
              className="w-full"
              style={{
                fontSize: "var(--font-size-base)",
                padding: "var(--space-3) var(--space-4)",
              }}
              aria-describedby={error ? "login-error" : undefined}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label
              htmlFor="password"
              className="block text-body-medium font-medium"
              style={{
                color: "var(--text-primary)",
                marginBottom: "var(--space-2)",
              }}
            >
              Password
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full"
              inputClassName="w-full"
              style={{
                width: "100%",
                // fontSize: "var(--font-size-base)",
                // padding: "var(--space-3) var(--space-4)",
              }}
              feedback={false}
              toggleMask
              aria-describedby={error ? "login-error" : undefined}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <Message
              id="login-error"
              severity="error"
              text={error}
              className="w-full"
              style={{ marginTop: "var(--space-2)" }}
            />
          )}

          <Button
            type="submit"
            disabled={!username.trim() || !password.trim() || loading}
            className="w-full"
            loading={loading}
            style={{
              marginTop: "var(--space-4)",
              padding: "var(--space-4) var(--space-6)",
              fontSize: "var(--font-size-base)",
              fontWeight: "var(--font-weight-medium)",
            }}
            aria-label={
              loading ? "Signing in, please wait" : "Sign in to your account"
            }
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
