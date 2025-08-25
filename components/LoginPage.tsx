"use client";

import React, {useState} from "react";
import {Input} from "./Input";
import {Card} from "primereact/card";
import {Message} from "primereact/message";

import Image from "next/image";
import Avatar from "../public/Svg/avatar.svg";

import {InputText} from "primereact/inputtext";
import TextInput from "./UI/CommonUI/TextInput";
import {Button} from "./Button";
import AppButton from "./UI/CommonUI/AppButton";
import style from "../styles/commonStyle.module.css";
import clsx from "clsx";

import LoginRightRectangle from "../public/Svg/loginRightRectangle.svg";
import LoginLeftRectangle from "../public/Svg/loginLeftRectangle.svg";
import {useThemeIcons} from "./logic/useThemeIcon";

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
  const [imageLoading, setImageLoading] = useState(true);

  const {mailIcon, passwordIcon} = useThemeIcons();
  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) return;
    await onLogin(username, password);
  };

  return (
    <div className="grid h-full">
      {/* Left Side */}
      <div className="col-12 md:col-6 relative p-0" style={{height: "107vh"}}>
        <Image
          src={process.env.NEXT_PUBLIC_LOGIN_LOGO!}
          alt="avatar"
          fill
          onLoadingComplete={() => {
            setImageLoading(false);
          }}
          style={{objectFit: "cover"}}
        />
        {/* <div className="w-full relative">
          <h5
            className="absolute text-center"
            style={{
              bottom: "9%",
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: 400,
              lineHeight: "2.5rem",
              maxWidth: "80%",
              padding: "0 1rem",
              whiteSpace: "normal",
              width: "32vw",
            }}
          >
            Your AI Powered Career Concierge Log In To Begin Your Workforce
            Journey.
          </h5>
        </div> */}

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
        <Image
          src={LoginLeftRectangle}
          alt="rectangleLeft"
          style={{position: "absolute", top: "15%", left: "49.5%"}}
        />
        <Image
          src={LoginRightRectangle}
          alt="rectangleRIght"
          style={{position: "absolute", top: "15%", left: "98.5%"}}
        />
        <div className="h-full flex flex-column justify-content-center">
          <div className="flex flex-column justify-content-center align-items-center relative">
            <Image
              src={process.env.NEXT_PUBLIC_LOGO!}
              alt="logo"
              width={180}
              height={35}
            />
            <div className="flex flex-column justify-content-center align-items-center gap-2 mt-5">
              <h2
                style={{
                  color: "var(--text-primary-color)",
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
              style={{width: "28rem"}}
            >
              {error && <div className={style.errorBox}>{error}</div>}

              <div className="flex relative">
                <Image src={mailIcon} alt="mail" className={style.imageInput} />
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
                  src={passwordIcon}
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
                className={clsx("text-right -mt-2 mb-5", style.blueText)}
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
                loading={loading}
              />

              <span
                className="flex justify-content-center"
                style={{
                  color: "var(--text-primary-color)",
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
    </div>
  );
};
