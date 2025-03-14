import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import type { ForgotPasswordValues } from "/imports/api/auth/schemas";
import { forgotPasswordSchema } from "/imports/api/auth/schemas";
import { useToast } from "/imports/hooks/use-toast";

import { ROUTES } from "../../utils/routes";
import { api } from "../api";
import { Button } from "../elements/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../elements/card";
import { Input } from "../elements/input";
import { Label } from "../elements/label";
import { Toaster } from "../elements/toaster";

export const ForgotPassword = () => {
  const form = useForm<ForgotPasswordValues>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordSchema)
  });

  const { toast } = useToast();

  const sendEmail = api.auth.forgotPassword.useMutation({
    onError: (error) => {
      console.error("Error sending token:", error),
        toast({
          title: "Error",
          description: error.message || "Error sending token.",
          variant: "destructive"
        });
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Success",
        description: "Reset email sent successfully."
      });
    }
  });

  const handleSendEmail = async (data: ForgotPasswordValues) => {
    try {
      await sendEmail.mutateAsync({ email: data.email });
    } catch (error) {
      console.error("Error sending token:", error);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center dark:bg-gray-900">
      <Card className="px-8 space-y-2 shadow-lg w-[28rem] dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl mb-3 mt-2 text-center dark:text-white">Forgot your password?</CardTitle>
          <CardDescription className="text-center dark:text-gray-300">
            Enter your email to receive a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
              <Input
                type="email"
                placeholder="m@example.com"
                required
                {...form.register("email")}
                aria-invalid={!!form.formState.errors.email}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {form.formState.errors.email && (
                <span className="text-red-500 dark:text-red-400">{form.formState.errors.email.message}</span>
              )}
            </div>
            <Button
              onClick={form.handleSubmit(handleSendEmail)}
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="w-full mb-3 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {form.formState.isSubmitting ? "Requesting link..." : "Request link"}
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
  );
};
