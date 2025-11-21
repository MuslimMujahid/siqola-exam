"use client";

import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

interface BasicErrorProps {
  message: string;
}

export function BasicError({ message }: BasicErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border p-4 text-sm bg-destructive/10 border-destructive/20 text-destructive"
    >
      <div className="flex items-start gap-2">
        <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-medium mb-1">Login Failed</p>
          <p>{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
