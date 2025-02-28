import { zodResolver } from "@hookform/resolvers/zod";
import { UserPen } from "lucide-react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import type { ProfileValues } from "/imports/api/users/schemas";
import { profileSchema } from "/imports/api/users/schemas";
import { useToast } from "/imports/hooks/use-toast";

import { api } from "../api";
import { AppSidebar } from "../components/AppSidebar";
import { DeleteAccount } from "../components/DeleteAccount";
import { PasswordUpdate } from "../components/PasswordUpdate";
import { SetTwoFactorAuth } from "../components/SetTwoFactorAuth";
import { Button } from "../elements/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../elements/form";
import { Input } from "../elements/input";
import { SidebarProvider, SidebarTrigger } from "../elements/sidebar";
import { Toaster } from "../elements/toaster";

export const Profile = () => {
  const { data: user } = api.users.loggedUser.useQuery();
  const form = useForm<ProfileValues>({
    defaultValues: {
      userId: user?._id,
      name: user?.profile?.name || user?.githubName || user?.googleName || "",
      email: user?.githubEmail || user?.googleEmail || user?.emails?.[0].address || "",
      image: user?.profile?.image || user?.githubImage || user?.googleImage || ""
    },
    resolver: zodResolver(profileSchema)
  });

  const { toast } = useToast();

  const updateProfile = api.users.updateProfile.useMutation({
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message || "Error updating profile.",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your profile has been updated successfully!"
      });
    }
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

  const profilePicture = form.watch("image");

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-col h-screen w-full">
        <div className="bg-white shadow-sm">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold pb-4 pl-14 pt-7">
            Your Profile <UserPen className="inline pb-1 ml-1" />
          </h1>
        </div>
        <div className="grid gap-6 grid-cols-2 grid-rows-4 max-w-5xl min-w-[800px] mx-auto pt-14">
          <div className="p-8 rounded-md shadow-sm">
            <h1 className="text-2xl font-bold mb-4">Your Account</h1>
            <p className="text-sm text-gray-500">Update your account's name and email address.</p>
          </div>
          <div className="bg-white p-8 rounded-md shadow-sm">
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
          {user?.hasPassword && <SetTwoFactorAuth />}
          {user?._id && <DeleteAccount userId={user._id} />}
        </div>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};
