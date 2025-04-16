"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "outline" | "secondary";
  className?: string;
  onClick?: () => void;
  size: "lg" | "sm";
  children: ReactNode;
}

export const Button = ({
  size,
  variant,
  className,
  onClick,
  children,
}: ButtonProps) => {
  const baseStyle =
    "rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";

  const sizeStyle = size === "lg" ? "px-4 py-2 text-base" : "px-2 py-1 text-sm";

  const variantStyle =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : variant === "secondary"
        ? "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200"
        : "border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-100";

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className ?? ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
