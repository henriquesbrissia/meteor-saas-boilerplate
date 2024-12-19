import { zodResolver } from "@hookform/resolvers/zod";
import { UserPen } from "lucide-react";
import { Meteor } from "meteor/meteor";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import type { ProfileValues } from "/imports/api/users/schemas";
import { profileSchema } from "/imports/api/users/schemas";

import { api } from "../api";
import { AppSidebar } from "../components/AppSidebar";
import { PasswordUpdate } from "../components/PasswordUpdate";
import { Button } from "../elements/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../elements/form";
import { Input } from "../elements/input";
import { SidebarProvider, SidebarTrigger } from "../elements/sidebar";

export const Profile = () => {
  const { data: user } = api.users.loggedUser.useQuery();
  const form = useForm<ProfileValues>({
    defaultValues: {
      userId: user?._id,
      name: user?.profile?.name || "",
      email: user?.githubEmail || user?.googleEmail || user?.emails?.[0].address || "",
      image: user?.githubImage || user?.googleImage || user?.profile?.image || ""
    },
    resolver: zodResolver(profileSchema)
  });

  const updateProfile = api.users.updateProfile.useMutation({
    onError: (e) => alert(e.message),
    onSuccess: () => alert("Update successful!")
  });

  const handleUpdateProfile = async (data: ProfileValues) => {
    await updateProfile.mutateAsync(data);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => form.setValue("image", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const deleteAccount = api.users.deleteAccount.useMutation({
    onError: (e) => alert(e.message),
    onSuccess: () => {
      alert("Account deleted successfully.");
      Meteor.logout();
    }
  });

  const userId = form.watch("userId");

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      await deleteAccount.mutateAsync(userId);
    }
  };

  const profilePicture = form.watch("image");

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-col h-screen w-full">
      <SidebarTrigger />
        <h1 className="text-2xl font-bold pb-4 pl-14 pt-7 border-b border-gray-300 w-full">
          Your Profile <UserPen className="inline pb-1 ml-1" />
        </h1>
        <div className="grid gap-6 grid-cols-2 grid-rows-4 max-w-5xl min-w-[800px] mx-auto pt-14">
        <div className="p-8 rounded-md shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Your Account</h1>
          <p className="text-sm text-gray-500">Update your account's name and email address.</p>
        </div>
          <div className="bg-slate-50 p-8 rounded-md shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-6">
              <div className="flex items-center gap-4">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full bg-gray-200 border"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl">
                    {user?.profile?.name.charAt(0) ||
                      user?.emails?.[0].address.charAt(0).toUpperCase()}
                  </div>
                )}
                  <Button type="button" variant="outline">
                  <label htmlFor="profileImage" className="cursor-pointer">
                    Select a new photo
                  </label>
                </Button>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input id="name" type="text" {...field} {...form.register("name")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id="email" type="email" {...field} {...form.register("email")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <div className="flex justify-end mt-4">
              <Button type="submit" className="w-24">
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
                </div>
            </form>
          </Form>
        </div>
        {user?.hasPassword && <PasswordUpdate />}
          <div className="p-8 rounded-md shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Delete Account</h1>
            <p className="text-sm text-gray-500">Permanently delete your account.</p>
        </div>
          <div className="bg-slate-50 p-8 rounded-md shadow-sm">
            <p className="text-sm text-gray-600">
              Once your account is deleted, all of its resources and data will be permanently
              deleted. Before deleting your account, please download any data or information that
              you wish to retain.
            </p>
            <Button variant="destructive" onClick={handleDeleteAccount} className="shadow-md mt-4">
            Delete Account
          </Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
