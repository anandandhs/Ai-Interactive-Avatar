import React from "react";
import { Button as PrimeButton } from "primereact/button";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: React.ReactNode;
    iconPos?: "left" | "right" | "top" | "bottom";
    loading?: boolean;
    severity?:
      | "success"
      | "info"
      | "warning"
      | "danger"
      | "help"
      | "secondary"
      | "contrast";
    size?: "small" | "large";
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
  const primeButtonProps: any = {
    label: typeof children === "string" ? children : undefined,
    className,
    onClick: props.disabled ? undefined : onClick,
    disabled: props.disabled,
    icon,
    iconPos,
    loading,
    text,
    outlined,
    raised,
    rounded,
    ...props,
  };

  // Only add severity and size if they are defined
  if (severity !== undefined) {
    primeButtonProps.severity = severity;
  }
  if (size !== undefined) {
    primeButtonProps.size = size;
  }

  return (
    <PrimeButton {...primeButtonProps}>
      {typeof children !== "string" ? children : undefined}
    </PrimeButton>
  );
};
