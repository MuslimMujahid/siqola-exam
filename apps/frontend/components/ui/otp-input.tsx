"use client";

import React from "react";
import { Input } from "./input";

interface OtpInputProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className = "",
}: OtpInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, inputValue: string) => {
    if (inputValue.length > 1) {
      inputValue = inputValue.slice(-1);
    }

    if (!/^\d*$/.test(inputValue)) {
      return;
    }

    const newValue = [...value];
    newValue[index] = inputValue;
    onChange(newValue);

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) {
      return;
    }
    const newValue = pastedData
      .split("")
      .concat(Array(length).fill(""))
      .slice(0, length);
    onChange(newValue);
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
  };

  return (
    <div className={`flex gap-2 justify-evenly ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          id={`otp-${index}`}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-12 text-center text-lg font-semibold"
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
