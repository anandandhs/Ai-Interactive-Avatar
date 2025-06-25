import React from "react";
import { Button as PrimeButton } from "primereact/button";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: string;
    iconPos?: "left" | "right" | "top" | "bottom";
    loading?: boolean;
    severity?:
      | "success"
      | "info"
      | "warning"
      | "danger"
      | "help"
      | "secondary"
      | "contrast"
      | null;
    size?: "small" | "large" | null;
    text?: boolean;
    outlined?: boolean;
    raised?: boolean;
    rounded?: boolean;
  }
> = ({
  children,
  className,
  onClick,
  icon,
  iconPos = "left",
  loading = false,
  severity,
  size,
  text = false,
  outlined = false,
  raised = false,
  rounded = false,
  ...props
}) => {
  return (
    <PrimeButton
      label={typeof children === "string" ? children : undefined}
      className={className}
      onClick={props.disabled ? undefined : onClick}
      disabled={props.disabled}
      icon={icon}
      iconPos={iconPos}
      loading={loading}
      severity={severity}
      size={size}
      text={text}
      outlined={outlined}
      raised={raised}
      rounded={rounded}
      {...props}
    >
      {typeof children !== "string" ? children : undefined}
    </PrimeButton>
  );
};
