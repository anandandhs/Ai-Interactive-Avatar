import React from "react";
import { InputText } from "primereact/inputtext";

interface InputProps {
  value: string | undefined | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  type?: string;
  size?: "small" | "large" | null;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  autoComplete?: string;
}

export const Input = (props: InputProps) => {
  return (
    <InputText
      id={props.id}
      className={`w-full ${props.className || ""}`}
      placeholder={props.placeholder}
      type={props.type || "text"}
      value={props.value || ""}
      onChange={(e) => props.onChange(e.target.value)}
      disabled={props.disabled}
      size={props.size}
      aria-label={props["aria-label"]}
      aria-describedby={props["aria-describedby"]}
      autoComplete={props.autoComplete}
    />
  );
};
