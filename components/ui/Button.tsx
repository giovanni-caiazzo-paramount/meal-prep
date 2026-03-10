/**
 * Button Component - Reusable stateless component
 */

import { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 active:opacity-80",
  secondary: "bg-muted text-foreground hover:bg-border active:opacity-80",
  danger: "bg-red-700 text-white hover:bg-red-800 active:bg-red-900",
  ghost: "text-foreground hover:bg-muted active:bg-border",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={`
        rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
