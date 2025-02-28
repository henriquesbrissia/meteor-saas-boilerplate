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
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="px-8 space-y-2 shadow-lg w-[28rem]">
        <CardHeader>
          <CardTitle className="text-3xl mb-3 mt-2 text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">Enter your new password.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                placeholder="Your New Password"
                required
                {...form.register("newPassword")}
                aria-invalid={!!form.formState.errors.newPassword}
              />
              {form.formState.errors.newPassword && (
                <span>{form.formState.errors.newPassword.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                placeholder=" Confirm your New Password"
                required
                {...form.register("confirmPassword")}
                aria-invalid={!!form.formState.errors.newPassword}
              />
              {form.formState.errors.confirmPassword && (
                <span>{form.formState.errors.confirmPassword.message}</span>
              )}
            </div>
            <Button
              onClick={form.handleSubmit(handeResetPassword)}
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full mb-3"
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
          <div className="mt-6 text-left text-sm">
            <Link to={ROUTES.SIGN_IN} className="underline text-gray-500">
              ⭠ back to sign in page
            </Link>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};
