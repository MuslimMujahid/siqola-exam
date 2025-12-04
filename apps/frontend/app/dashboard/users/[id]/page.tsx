import React from "react";
import { Loading } from "@/components/ui/loading";
import { UserDetail } from "@/modules/users/pages/user-detail";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

const UserDetailPage = ({ params }: UserDetailPageProps) => {
  return (
    <React.Suspense fallback={<Loading text="Memuat..." fullScreen />}>
      <UserDetail params={params} />
    </React.Suspense>
  );
};

export { UserDetailPage as default };
