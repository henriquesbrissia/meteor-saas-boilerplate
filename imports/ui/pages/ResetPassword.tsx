import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import type { ResetPasswordPayloadValues, ResetPasswordValues } from "/imports/api/auth/schemas";
import { resetPasswordSchema } from "/imports/api/auth/schemas";
import { useToast } from "/imports/hooks/use-toast";

import { ROUTES } from "../../utils/routes";
import { api } from "../api";
import { Button } from "../elements/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../elements/card";
import { Input } from "../elements/input";
import { Label } from "../elements/label";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { Toaster } from "../elements/toaster";

export const ResetPassword = () => {
  const form = useForm<ResetPasswordValues>({
    defaultValues: { token: "", newPassword: "", confirmPassword: "" },
    resolver: zodResolver(resetPasswordSchema)
  });

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { toast } = useToast();
  const navigate = useNavigate();

  const resetPassword = api.auth.resetPassword.useMutation({
    onError: (error) => console.error("Reset Password Error:", error),
    onSuccess: () => {
      form.reset();
      navigate(ROUTES.SIGN_IN);
      toast({
        title: "Success",
        description: "Password successfully redefined"
      });
    }
  });

  const handeResetPassword = async (data: ResetPasswordPayloadValues) => {
    await resetPassword.mutateAsync({
      token: token || "",
      newPassword: data.newPassword
    });
  };

  return (
    <div className="flex-col h-screen w-full dark:bg-gray-900">
      <div className="flex justify-end p-4">
        <ThemeSwitcher />
      </div>
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
        <Card className="px-8 space-y-2 shadow-lg w-[28rem] dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl mb-3 mt-2 text-center dark:text-white">Reset Password</CardTitle>
            <CardDescription className="text-center dark:text-gray-300">Enter your new password.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="newPassword" className="dark:text-gray-200">New Password</Label>
                <Input
                  type="password"
                  placeholder="Your New Password"
                  required
                  {...form.register("newPassword")}
                  aria-invalid={!!form.formState.errors.newPassword}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                {form.formState.errors.newPassword && (
                  <span className="text-red-500 dark:text-red-400">{form.formState.errors.newPassword.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="dark:text-gray-200">Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm your New Password"
                  required
                  {...form.register("confirmPassword")}
                  aria-invalid={!!form.formState.errors.newPassword}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                {form.formState.errors.confirmPassword && (
                  <span className="text-red-500 dark:text-red-400">{form.formState.errors.confirmPassword.message}</span>
                )}
              </div>
              <Button
                onClick={form.handleSubmit(handeResetPassword)}
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full mb-3 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
            <div className="mt-6 text-left text-sm">
              <Link to={ROUTES.SIGN_IN} className="underline text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                ⭠ back to sign in page
              </Link>
            </div>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </div>
  );
};
