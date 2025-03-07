import { useQueryClient } from "@tanstack/react-query";
import { UserMinus } from "lucide-react";

import type { RemoveMemberDialogProps } from "/imports/api/teams/schemas";
import { useToast } from "/imports/hooks/use-toast";

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
  const { toast } = useToast();

  const removeMember = api.teams.removeMember.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred while removing the member.",
        variant: "destructive"
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast({
        title: "Success",
        description: "Member removed successfully!"
      });
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
        <Button variant="ghost" size="icon">
          <UserMinus className="text-red-600" />
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
