import Link from "next/link";
import { motion } from "framer-motion";
import { type UserRoleType } from "@/lib/schemas/auth";
import { CardContent } from "@/components/ui/card";

interface RoleInfoMessageProps {
  role: UserRoleType;
}

export function RoleInfoMessage({ role }: RoleInfoMessageProps) {
  return (
    <CardContent className="space-y-4 p-6 pt-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg bg-muted/50 border border-border/50 p-6 space-y-4"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">
              {role === "examiner"
                ? "Examiner Account Request"
                : "Examinee Account Request"}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {role === "examiner"
                ? "Examiner accounts are created by institutions. Please contact your institution administrator to request an examiner account."
                : "Examinee accounts are created by institutions. Please contact your institution administrator to request an examinee account."}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="text-center text-sm text-muted-foreground pt-2">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Login here
        </Link>
      </div>
    </CardContent>
  );
}
