import { useState } from "react";
import type { ChangeEvent } from "react";

import "./SharedUI.css";

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordInput({
  id,
  name,
  value,
  label,
  placeholder = "Enter password",
  autoComplete = "current-password",
  required = true,
  onChange,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="app-field" htmlFor={id}>
      {label && <span>{label}</span>}

      <div className="password-input">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
        />

        <button
          type="button"
          className="password-input__toggle"
          onClick={() => setShowPassword((currentValue) => !currentValue)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </label>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M2 12C3.5 8.11 7.03 5 12 5C16.97 5 20.5 8.11 22 12C20.5 15.89 16.97 19 12 19C7.03 19 3.5 15.89 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.73 5.08C11.15 5.03 11.57 5 12 5C16.97 5 20.5 8.11 22 12C21.55 13.17 20.86 14.27 19.97 15.22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.53 17.53C16.02 18.47 14.16 19 12 19C7.03 19 3.5 15.89 2 12C2.69 10.21 3.83 8.62 5.32 7.42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.88 9.88C9.34 10.42 9 11.17 9 12C9 13.66 10.34 15 12 15C12.83 15 13.58 14.66 14.12 14.12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}