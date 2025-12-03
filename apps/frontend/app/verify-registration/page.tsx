import React from "react";
import { VerifyRegistration } from "@/modules/auth/pages/verify-registration";
import { Loading } from "@/components/ui/loading";

type VerifyRegistrationPageProps = {
  searchParams: Promise<{ email?: string }>;
};

const VerifyRegistrationPage = ({
  searchParams,
}: VerifyRegistrationPageProps) => {
  return (
    <React.Suspense fallback={<Loading text="Verifikasi..." fullScreen />}>
      <VerifyRegistration searchParams={searchParams} />
    </React.Suspense>
  );
};

export { VerifyRegistrationPage as default };
