import React from "react";
import { Loading } from "@/components/ui/loading";
import { Login } from "@/modules/auth/pages/login";

type LoginPageProps = {
  searchParams: Promise<{ invitation?: string }>;
};

const LoginPage = ({ searchParams }: LoginPageProps) => {
  return (
    <React.Suspense fallback={<Loading text="Memuat..." fullScreen />}>
      <Login searchParams={searchParams} />
    </React.Suspense>
  );
};

export { LoginPage as default };
