"use client";

import React, {useState} from "react";
import {Input} from "./Input";
import {Card} from "primereact/card";
import {Password} from "primereact/password";
import {Message} from "primereact/message";
import Logo from "../public/Svg/texas_logo.svg";
import Image from "next/image";
import Avatar from "../public/Svg/home_avatar.svg";
import BackgroundLogin from "../public/Svg/login_background.svg";
import {InputText} from "primereact/inputtext";
import TextInput from "./UI/CommonUI/TextInput";
import {Button} from "./Button";
import AppButton from "./UI/CommonUI/AppButton";
import style from "../styles/commonStyle.module.css";
import clsx from "clsx";

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
    <div className="grid">
      <div className="col-6">
        <div className={style.homeBlur}>
          <Image
            src={BackgroundLogin}
            alt="Avatar"
            className={style.blurImage}
            style={{filter: "blur(15px)"}}
          />
          {/* <div className={style.blurOverlay} /> */}
          <h5 className="text-white text-2xl font-normal p-5 relative z-1">
            Your A.I Powered Career Concierge Log In To Begin Your Workforce
            Journey.
          </h5>
          <Image src={Avatar} alt="Avatar" className={style.centerImage} />
        </div>
      </div>
      <div className="col-6">
        <div
          className="flex flex-column justify-content-center align-items-center relative"
          style={{top: "15%"}}
        >
          <Image alt="logo" src={Logo} />
          <div className="flex flex-column justify-content-center align-items-center gap-2 mt-5">
            <h2>Welcome back !</h2>
            <p className={style.blueText}>Connect with our Intelligence</p>
          </div>
          <div className="flex flex-column gap-4 mt-5" style={{width: "30rem"}}>
            <TextInput
              label="Email"
              width="100%"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              autoComplete="username"
            />
            <TextInput
              label="Password"
              width="100%"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              autoComplete="username"
            />

            <p className={clsx("text-right", style.blueText)}>
              Forgot Password?
            </p>

            <AppButton
              label="Login"
              width="100%"
              onClick={handleSubmit}
              disabled={!username.trim() || !password.trim() || loading}
              loading={loading}
            />

            <span className="flex justify-content-center">
              Dont have an account? <p className={style.blueText}>Sign in</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
