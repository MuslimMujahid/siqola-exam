import { useQuery } from "@tanstack/react-query";
import { getInstitutionStats } from "@/lib/api/institutions";

export function useInstitutionStats(institutionId?: string) {
  return useQuery({
    queryKey: ["institution-stats", institutionId],
    queryFn: () => {
      if (!institutionId) {
        throw new Error("Institution ID is required");
      }
      return getInstitutionStats(institutionId);
    },
    enabled: !!institutionId,
  });
}
