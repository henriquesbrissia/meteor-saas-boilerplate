import { zodResolver } from "@hookform/resolvers/zod";
import { Accounts } from "meteor/accounts-base";
import { useForm } from "react-hook-form";

import type { PasswordValues } from "/imports/api/users/schemas";
import { passwordSchema } from "/imports/api/users/schemas";
import { useToast } from "/imports/hooks/use-toast";

import { Button } from "../elements/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../elements/form";
import { Input } from "../elements/input";

export const PasswordUpdate = () => {
  const form = useForm<PasswordValues>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    resolver: zodResolver(passwordSchema)
  });

  const { toast } = useToast();

  const onSubmit = (data: PasswordValues) => {
    Accounts.changePassword(data.oldPassword, data.newPassword, (err) => {
      if (err) {
        toast({
          title: "Error",
          description: err.message || "Error changing password.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Password updated successfully!"
        });
        form.reset();
      }
    });
  };

  return (
    <>
      <div className="p-8 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Change password</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">Old Password</FormLabel>
                  <FormControl>
                    <Input
                      id="oldPassword"
                      type="password"
                      {...field}
                      {...form.register("oldPassword")}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">New Password</FormLabel>
                  <FormControl>
                    <Input
                      id="newPassword"
                      type="password"
                      {...field}
                      {...form.register("newPassword")}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-gray-200">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...field}
                      {...form.register("confirmPassword")}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-400" />
                </FormItem>
              )}
            />
            <div className="flex justify-end mt-4">
              <Button type="submit" className="w-24 dark:bg-blue-600 dark:hover:bg-blue-700">
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
