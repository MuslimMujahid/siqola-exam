import React from "react";
import { GroupDetail } from "@/modules/groups/pages/group-detail";
import { Loading } from "@/components/ui/loading";

type GroupDetailPageProps = {
  params: Promise<{ id: string }>;
};

const GroupDetailPage = ({ params }: GroupDetailPageProps) => {
  return (
    <React.Suspense fallback={<Loading text="Memuat..." fullScreen />}>
      <GroupDetail params={params} />
    </React.Suspense>
  );
};

export { GroupDetailPage as default };
