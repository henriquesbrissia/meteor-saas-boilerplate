import { Meteor } from "meteor/meteor";

import type { UserIdValues } from "/imports/api/users/schemas";

import { api } from "../api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../elements/alert-dialog";
import { Button } from "../elements/button";
import { useToast } from "../hooks/use-toast";

export function DeleteAccount({ userId }: UserIdValues) {
  const { toast } = useToast();

  const deleteAccount = api.users.deleteAccount.useMutation({
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message || "Error deleting account.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Account deleted successfully."
      });
      Meteor.logout();
    }
  });

  const handleDeleteAccount = async () => {
    await deleteAccount.mutateAsync(userId);
  };

  return (
    <>
      <div className="p-8 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Delete Account</h1>
        <p className="text-sm text-gray-500">Permanently delete your account.</p>
      </div>
      <div className="bg-white p-8 rounded-md shadow-sm">
        <p className="text-sm text-gray-600">
          Once your account is deleted, all of its resources and data will be permanently deleted.
          Before deleting your account, please download any data or information that you wish to
          retain.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="shadow-md mt-4">
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
