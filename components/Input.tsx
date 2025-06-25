import React from "react";
import { InputText } from "primereact/inputtext";

interface InputProps {
  value: string | undefined | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  type?: string;
  size?: "small" | "large";
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  autoComplete?: string;
  style?: React.CSSProperties;
}

export const Input = (props: InputProps) => {
  const inputProps: any = {
    id: props.id,
    className: `w-full ${props.className || ""}`,
    placeholder: props.placeholder,
    type: props.type || "text",
    value: props.value || "",
    onChange: (e: any) => props.onChange(e.target.value),
    disabled: props.disabled,
    "aria-label": props["aria-label"],
    "aria-describedby": props["aria-describedby"],
    autoComplete: props.autoComplete,
    style: props.style,
  };

  // Only add size if it's defined
  if (props.size !== undefined) {
    inputProps.size = props.size;
  }

  return <InputText {...inputProps} />;
};
