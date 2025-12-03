import React from "react";
import { Invitation } from "@/modules/institution/pages/invitation";
import { Loading } from "@/components/ui/loading";

type InvitationPageProps = {
  params: Promise<{ token: string }>;
};

const InvitationPage = ({ params }: InvitationPageProps) => {
  return (
    <React.Suspense fallback={<Loading text="Memuat..." fullScreen />}>
      <Invitation params={params} />
    </React.Suspense>
  );
};

export { InvitationPage as default };
