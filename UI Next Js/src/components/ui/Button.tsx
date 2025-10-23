import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import clsx from "clsx";

interface ButtonProps extends MuiButtonProps {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "contained",
  ...props
}) => {
  const baseClasses = "mui-tailwind-button font-medium rounded-lg";

  const variantClasses = clsx({
    "bg-primary-500 hover:bg-primary-600 text-white shadow-sm":
      variant === "contained",
    "border border-primary-500 text-primary-500 hover:bg-primary-50":
      variant === "outlined",
    "text-primary-500 hover:bg-primary-50": variant === "text",
  });

  return (
    <MuiButton
      className={clsx(baseClasses, variantClasses, className)}
      variant={variant}
      {...props}
    >
      {children}
    </MuiButton>
  );
};
