import { useQueryClient } from "@tanstack/react-query";
import { UserMinus } from "lucide-react";

import type { RemoveMemberDialogProps } from "/imports/api/teams/schemas";

import { api } from "../api";
import { Button } from "../elements/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../elements/dialog";

export const RemoveMemberDialog = ({ teamId, memberId, memberName }: RemoveMemberDialogProps) => {
  const queryClient = useQueryClient();

  const removeMember = api.teams.removeMember.useMutation({
    onError: (error) => {
      console.error("Error removing member:", error);
      alert(error.message || "An error occurred while removing the member.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    }
  });

  const handleRemoveMember = async () => {
    try {
      await removeMember.mutateAsync({ teamId, memberId });
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <UserMinus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-base">
            Are you sure you want to remove {memberName} from the Team?
          </DialogTitle>
          <DialogDescription>You can always add members back later</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" className="ml-3" onClick={() => handleRemoveMember()}>
              Remove
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
