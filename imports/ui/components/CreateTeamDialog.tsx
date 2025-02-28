import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import type { CreateTeamValues } from "/imports/api/teams/schemas";
import { createTeamSchema } from "/imports/api/teams/schemas";
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

export const CreateTeamDialog = () => {
  const form = useForm<CreateTeamValues>({
    defaultValues: { name: "" },
    resolver: zodResolver(createTeamSchema)
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createTeam = api.teams.createTeam.useMutation({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Error creating team.",
        variant: "destructive"
      });
    },
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries();
      toast({
        title: "Success",
        description: "Team created successfully!"
      });
    }
  });

  const handleCreateTeam = async (data: CreateTeamValues) => {
    try {
      await createTeam.mutateAsync(data);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="w-60 shadow-sm">
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>Enter new team name to create.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleCreateTeam)}>
            <div>
              <Input type="text" placeholder="Team name" {...form.register("name")} />
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
                  {form.formState.isSubmitting ? "Creating..." : "Create team"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
