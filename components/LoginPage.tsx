"use client";

import React, { useState } from "react";
import { Input } from "./Input";
import { Card } from "primereact/card";
import { Message } from "primereact/message";

import Image from "next/image";
import Avatar from "../public/Svg/avatar.svg";

import { InputText } from "primereact/inputtext";
import TextInput from "./UI/CommonUI/TextInput";
import { Button } from "./Button";
import AppButton from "./UI/CommonUI/AppButton";
import style from "../styles/commonStyle.module.css";
import clsx from "clsx";
import Mail from "../public/Svg/mail.svg";
import Password from "../public/Svg/password.svg";
import BackgroundLogo from "../public/Svg/home_2.svg";
import BackgroundStar from "../public/Svg/home_1.svg";
import LoginAvatar from "../public/Svg/meliassaLogin.svg";
import Logo from "../public/Svg/nav_logo.svg";
import { relative } from "path";

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

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) return;
    await onLogin(username, password);
  };

  return (
    <div className="grid h-full">
      <div className="col-6">
        <div
          style={{
            marginTop: "3.125rem",
            marginLeft: "3.125rem",
            paddingBottom: "3.125rem",
          }}
        >
          <Image
            src={LoginAvatar}
            alt="avatar"
            // className="w-auto"
            // style={{
            //   objectFit: "contain",
            //   height: "100vh",
            // }}
            // style={{
            //   width: "auto", // Preserve original width
            //   objectFit: "fill", // Force fill container (breaks aspect ratio)
            // }}
          />
          <h5
            className="text-2xl font-normal p-5 relative z-1"
            style={{
              bottom: "12rem",
              color: "white",
              fontSize: "1.563rem",
              fontWeight: 400,
              lineHeight: "3rem",
              maxWidth: "32rem",
              left: "10rem",
              textAlign: "center",
            }}
          >
            Your AI Powered Career Concierge Log In To Begin Your Workforce
            Journey.
          </h5>
        </div>

        {/* <div className={style.homeBackground}>
          <h5
            className="text-2xl font-normal p-5 relative z-1"
            style={{ color: "#002768" }}
          >
            Your AI Powered Career Concierge Log In To Begin Your Workforce
            Journey.
          </h5>

          <div
            className="flex align-items-end relative"
            style={{ top: "2rem" }}
          >
            <Image
              src={BackgroundStar}
              alt="home_1"
              width={400}
              className="z-1"
            />
            <Image
              src={Avatar}
              alt="avatar"
              className="absolute z-1"
              height={550}
              style={{ left: "7rem" }}
            />
            <Image
              src={BackgroundLogo}
              alt="home_2"
              className="relative"
              style={{ left: "-12.6rem" }}
            />
          </div>
        </div> */}
      </div>
      <div className="col-6">
        <div
          className="flex flex-column justify-content-center align-items-center relative"
          style={{ top: "15%" }}
        >
          <Image src={Logo} alt="logo" />
          <div className="flex flex-column justify-content-center align-items-center gap-2 mt-5">
            <h2
              style={{
                color: "#515151",
                fontWeight: "500",
                fontSize: "2.25rem",
                lineHeight: "100%",
              }}
            >
              Welcome back !
            </h2>
            <p
              style={{
                color: "#1B84FF",
                fontWeight: "500",
                fontSize: "1rem",
                lineHeight: "100%",
              }}
              // className={style.blueText}
            >
              Connect with our Intelligence
            </p>
          </div>
          <div
            className="flex flex-column gap-4 mt-5"
            style={{ width: "30rem" }}
          >
            <div className="flex relative">
              <Image src={Mail} alt="mail" className={style.imageInput} />
              <TextInput
                label="Email"
                width="100%"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="custom-input"
                autoComplete="username"
              />
            </div>
            <div className="flex relative">
              <Image
                src={Password}
                alt="password"
                className={style.imageInput}
              />
              <TextInput
                label="Password"
                width="100%"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="custom-input"
                autoComplete="username"
              />
            </div>

            <p
              className={clsx("text-right", style.blueText)}
              style={{
                color: "#1B84FF",
                fontWeight: "400",
                fontSize: "1rem",
                lineHeight: "100%",
              }}
            >
              Forgot Password?
            </p>

            <AppButton
              label="Log in"
              width="100%"
              onClick={handleSubmit}
              disabled={!username.trim() || !password.trim() || loading}
              loading={loading}
            />

            <span
              className="flex justify-content-center"
              style={{
                color: "#515151",
                fontWeight: "400",
                fontSize: "1rem",
                lineHeight: "100%",
              }}
            >
              {"Don't have an account?"}
              <p
                className={style.blueText}
                style={{
                  color: "#1B84FF",
                  fontWeight: "400",
                  fontSize: "1rem",
                  lineHeight: "100%",
                }}
              >
                &nbsp;{"Sign in"}
              </p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
