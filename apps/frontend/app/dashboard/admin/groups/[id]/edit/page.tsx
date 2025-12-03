import React from "react";
import { EditGroup } from "@/modules/groups/pages/edit-group";
import { Loading } from "@/components/ui/loading";

type EditGroupPageProps = {
  params: Promise<{ id: string }>;
};

const EditGroupPage = ({ params }: EditGroupPageProps) => {
  return (
    <React.Suspense fallback={<Loading text="Memuat..." fullScreen />}>
      <EditGroup params={params} />
    </React.Suspense>
  );
};

export { EditGroupPage as default };
