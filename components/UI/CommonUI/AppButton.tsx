import React from "react";
import {Button} from "primereact/button";
import style from "../CommonUI/CommonUI.module.css";

interface AppButtonProps {
  label: string;
  width: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  secondary?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  label,
  width,
  onClick,
  disabled = false,
  loading = false,
  secondary = false,
}) => {
  return (
    <Button
      label={label}
      className={secondary ? style.secondaryButton : style.buttonContainer}
      style={{width}}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
    />
  );
};

export default AppButton;
