import { zodResolver } from "@hookform/resolvers/zod";
import { Accounts } from "meteor/accounts-base";
import { useForm } from "react-hook-form";

import type { PasswordValues } from "/imports/api/users/schemas";
import { passwordSchema } from "/imports/api/users/schemas";

import { Button } from "../elements/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../elements/form";
import { Input } from "../elements/input";

export const PasswordUpdate = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = useForm<PasswordValues>({
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
        reset();
      }
    });
  };

  const form = useForm();

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="oldPasssword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input
                      id="oldPassword"
                      type="password"
                      {...field}
                      {...register("oldPassword")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPasssword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      id="newPassword"
                      type="password"
                      {...field}
                      {...register("newPassword")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPasssword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...field}
                      {...register("confirmPassword")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-24 m-auto">
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
