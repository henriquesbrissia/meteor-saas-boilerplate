import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Meteor } from "meteor/meteor";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import type { ProfileValues } from "/imports/api/users/schemas";
import { profileSchema } from "/imports/api/users/schemas";
import { ROUTES } from "/imports/ui/utils/routes";

import { api } from "../api";
import { Button } from "../components/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/form";
import { Input } from "../components/input";
import { PasswordUpdate } from "../components/PasswordUpdate";

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

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    Meteor.logout();
    queryClient.clear();
    navigate(ROUTES.SIGN_IN);
  };

  const deleteAccount = api.users.deleteAccount.useMutation({
    onError: (e) => alert(e.message),
    onSuccess: () => {
      alert("Account deleted successfully.");
      handleLogout();
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
    <div className="grid gap-4 grid-cols-2 grid-rows-4 max-w-4xl mx-auto p-8">
      <div className="bg-white p-8 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Your Account</h1>
        <p className="text-sm text-gray-500">Update your account's name and email address.</p>
      </div>
      <div className="bg-slate-100 p-8 rounded-md shadow-md">
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
              <Button variant="outline">
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
            <Button type="submit" className="w-24">
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </div>
      {user?.hasPassword && <PasswordUpdate />}
      <div></div>
      <div className="space-y-4 px-6">
        <Button variant="outline" onClick={handleLogout} className="w-full shadow-md">
          Logout
        </Button>
        <Button variant="destructive" onClick={handleDeleteAccount} className="w-full shadow-md">
          Delete Account
        </Button>
      </div>
    </div>
  );
};
