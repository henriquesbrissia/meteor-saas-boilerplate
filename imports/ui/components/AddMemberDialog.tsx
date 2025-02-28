import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import type { TeamIdValues } from "/imports/api/teams/schemas";
import { addMemberSchema, type AddMemberValues } from "/imports/api/teams/schemas";
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

export const AddMemberDialog = ({ teamId }: TeamIdValues) => {
  const form = useForm<AddMemberValues>({
    defaultValues: { email: "", teamId: teamId || "" },
    resolver: zodResolver(addMemberSchema)
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addMember = api.teams.addMember.useMutation({
    onError: (e) => {
      form.reset();
      toast({
        title: "Error",
        description: e.message || "Error adding member.",
        variant: "destructive"
      });
    },
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries();
      toast({
        title: "Success",
        description: "Member added successfully"
      });
    }
  });

  const handleAddMember = async (data: AddMemberValues) => {
    try {
      await addMember.mutateAsync({ ...data, teamId });
      console.log("Member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>Enter the member's email to add them to the team.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleAddMember)}>
            <div>
              <Input type="email" placeholder="Email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button" onClick={() => form.reset()}>
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit" className="ml-3" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Adding..." : "Add Member"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
