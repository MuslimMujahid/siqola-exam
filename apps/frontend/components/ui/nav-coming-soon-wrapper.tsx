"use client";

import React from "react";
import { Construction } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavComingSoonWrapperProps {
  children: React.ReactNode;
  message?: string;
}

/**
 * NavComingSoonWrapper - A reusable component for navigation items that are under development
 *
 * Features:
 * - Disables the navigation link to prevent access
 * - Reduces opacity to indicate unavailable state
 * - Shows a small construction icon badge on the navigation item
 * - Displays a tooltip with custom message on hover
 *
 * Usage:
 * ```tsx
 * <NavComingSoonWrapper message="Akan segera hadir">
 *   <Link href="/coming-soon">Navigation Item</Link>
 * </NavComingSoonWrapper>
 * ```
 *
 * @param children - The navigation element to wrap (typically a Link or button)
 * @param message - Custom tooltip message (defaults to "Fitur ini akan segera hadir")
 */
export function NavComingSoonWrapper({
  children,
  message = "Fitur ini akan segera hadir",
}: NavComingSoonWrapperProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative cursor-not-allowed opacity-50">
            {/* Pointer events none to prevent clicking */}
            <div className="pointer-events-none">{children}</div>

            {/* Small coming soon indicator badge */}
            <div className="absolute -top-1 -right-1 pointer-events-none">
              <div className="bg-primary/20 text-primary rounded-full p-0.5">
                <Construction className="w-2.5 h-2.5" />
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="flex items-center gap-2">
          <Construction className="w-4 h-4" />
          <span>{message}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
