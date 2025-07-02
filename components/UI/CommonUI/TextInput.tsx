import React from "react";
import {InputText} from "primereact/inputtext";
import style from "../CommonUI/CommonUI.module.css";

interface TextInputProps {
  label: string;
  width: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  autoComplete?: string;
  type?: string;
  error?: string;
  errorContainer?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  width,
  id,
  value,
  onChange,
  placeholder,
  className,
  autoComplete,
  type,
  error,
  errorContainer,
}) => {
  return (
    <div className="flex flex-column w-full">
      <span
        className={style.label}
        style={{
          fontWeight: "400",
          fontSize: " 0.875rem",
          lineHeight: "100%",
          marginBottom: "0.625rem",
        }}
      >
        {label}
      </span>
      <InputText
        id={id}
        type={type || "text"}
        value={String(value)}
        onChange={onChange}
        placeholder={placeholder}
        className={`${
          errorContainer ? style.errorInputContainer : style.inputContainer
        } ${className || ""}`}
        style={{width}}
        autoComplete={autoComplete}
      />
      <span className={style.error}>{error}</span>
    </div>
  );
};

export default TextInput;
