import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import type { CreateTeamValues } from "/imports/api/teams/schemas";
import { createTeamSchema } from "/imports/api/teams/schemas";

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

  const createTeam = api.teams.createTeam.useMutation({
    onError: (error) => console.error("Error creating team:", error),
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries();
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
        <Button>Create Team</Button>
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
