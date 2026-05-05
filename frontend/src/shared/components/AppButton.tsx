import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./SharedUI.css";

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}

export function AppButton({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: AppButtonProps) {
  return (
    <button
      className={[
        "app-button",
        `app-button--${variant}`,
        fullWidth ? "app-button--full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}