import { zodResolver } from "@hookform/resolvers/zod";
import { Accounts } from "meteor/accounts-base";
import { useForm } from "react-hook-form";

import type { PasswordValues } from "/imports/api/users/schemas";
import { passwordSchema } from "/imports/api/users/schemas";

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

  const onSubmit = (data: PasswordValues) => {
    Accounts.changePassword(data.oldPassword, data.newPassword, (err) => {
      if (err) {
        alert(`Error: ${err.message}`);
      } else {
        alert("Password updated successfully!");
        form.reset();
      }
    });
  };

  return (
    <>
      <div className="p-8 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Change password</h1>
        <p className="text-sm text-gray-500">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </div>
      <div className="bg-slate-50 p-8 rounded-md shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input
                      id="oldPassword"
                      type="password"
                      {...field}
                      {...form.register("oldPassword")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      id="newPassword"
                      type="password"
                      {...field}
                      {...form.register("newPassword")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...field}
                      {...form.register("confirmPassword")}
                    />
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
    </>
  );
};
