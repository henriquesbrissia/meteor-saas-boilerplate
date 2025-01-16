import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";

import type { EditRoleDialogProps, EditRoleValues } from "/imports/api/teams/schemas";
import { editRoleSchema } from "/imports/api/teams/schemas";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from "../elements/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../elements/select";

export const EditRoleDialog = ({ teamId, memberId, memberName, role }: EditRoleDialogProps) => {
  const form = useForm<EditRoleValues>({
    defaultValues: { teamId: teamId || "", memberId: memberId || "", role: role || "" },
    resolver: zodResolver(editRoleSchema)
  });

  const queryClient = useQueryClient();

  const editRole = api.teams.editRole.useMutation({
    onError: (error) => console.error("Error editing role:", error),
    onSuccess: async () => {
      form.reset();
      await queryClient.invalidateQueries();
    }
  });

  const handleEditRole = async (data: EditRoleValues) => {
    try {
      await editRole.mutateAsync({ ...data, teamId });
    } catch (error) {
      console.error("Error editing role:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-1">
          <SquarePen className="pt-1" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {memberName}'s role</DialogTitle>
          <DialogDescription>Select a role below</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleEditRole)}>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a new role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">admin</SelectItem>
                      <SelectItem value="member">member</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Only admins can edit team's name, as well as add and remove members.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
