import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";

import type { EditTeamValues } from "/imports/api/teams/schemas";
import { editTeamSchema } from "/imports/api/teams/schemas";
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
import { Form } from "../elements/form";
import { Input } from "../elements/input";

export const EditTeamDialog = ({ teamId, name }: EditTeamValues) => {
  const form = useForm<EditTeamValues>({
    defaultValues: { name: name || "", teamId: teamId || "" },
    resolver: zodResolver(editTeamSchema)
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const editTeam = api.teams.editTeam.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Error editing team.",
        variant: "destructive"
      });
    },
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries();
      toast({
        title: "Success",
        description: "Team edited successfully!"
      });
    }
  });

  const handleEditTeam = async (data: EditTeamValues) => {
    try {
      await editTeam.mutateAsync({ ...data, teamId });
    } catch (error) {
      console.error("Error editing team:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <SquarePen className="text-gray-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit team's name</DialogTitle>
          <DialogDescription>Enter new team name</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleEditTeam)}>
            <div>
              <Input type="text" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button" onClick={() => form.reset()}>
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button className="ml-3" type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Submiting..." : "Submit"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
