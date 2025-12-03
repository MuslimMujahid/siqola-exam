"use client";

import React from "react";
import { Construction } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ComingSoonWrapperProps {
  children: React.ReactNode;
  message?: string;
  showIcon?: boolean;
  topOffset?: string;
}

export function ComingSoonWrapper({
  children,
  message = "Fitur ini akan segera hadir",
  showIcon = true,
  topOffset = "top-0",
}: ComingSoonWrapperProps) {
  // Clone the child and add overflow-hidden to prevent blur from bleeding
  const wrappedChild = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<{ className?: string }>,
        {
          className: cn(
            (children as React.ReactElement<{ className?: string }>).props
              .className || "",
            "overflow-hidden"
          ),
        }
      )
    : children;

  return (
    <div className="relative">
      {wrappedChild}

      {/* Coming soon overlay - positioned to avoid header */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Backdrop that excludes the card border and header area */}
        <div
          className={cn(
            "absolute inset-x-0 ${topOffset} bottom-0 bg-background/60 backdrop-blur-[3px]",
            topOffset
          )}
        />

        {/* Coming soon badge */}
        <div className="relative flex flex-col items-center gap-2 p-4 bg-background/95 backdrop-blur-sm rounded-lg border border-border shadow-lg z-10">
          {showIcon && (
            <Construction className="w-8 h-8 text-muted-foreground" />
          )}
          <p className="text-sm font-medium text-muted-foreground text-center">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
