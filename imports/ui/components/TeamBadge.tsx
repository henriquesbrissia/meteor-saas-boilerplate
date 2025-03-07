import { useQuery } from "@tanstack/react-query";

import type { GetOwnerSubscriptionValues } from "/imports/api/teams/schemas";

import { api } from "../api";
import { Badge } from "../elements/badge";
import { Skeleton } from "../elements/skeleton";

export const TeamBadge = ({ ownerId }: GetOwnerSubscriptionValues) => {
  const {
    data: isActive,
    isLoading,
    error
  } = useQuery({
    queryKey: ["ownerSubscriptionStatus", ownerId],
    queryFn: () => api.teams.getOwnerSubscriptionStatus(ownerId)
  });

  if (isLoading) {
    return (
      <div className="inline-flex items-center">
        <Skeleton className="w-[42px] h-[23px] rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-sm">
        Error: {error ? error.message : "Failed to load badge, please try again later."}
      </p>
    );
  }

  return (
    <div className="inline-flex items-center">
      {isActive ? <Badge>Pro</Badge> : <Badge variant="secondary">Free</Badge>}
    </div>
  );
};
