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
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="px-8 space-y-2 shadow-lg w-[28rem]">
        <CardHeader>
          <CardTitle className="text-3xl mb-3 mt-2 text-center">Forgot your password?</CardTitle>
          <CardDescription className="text-center">
            Enter your email to recieve a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                placeholder="m@example.com"
                required
                {...form.register("email")}
                aria-invalid={!!form.formState.errors.email}
              />
              {form.formState.errors.email && <span>{form.formState.errors.email.message}</span>}
            </div>
            <Button
              onClick={form.handleSubmit(handleSendEmail)}
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="w-full mb-3"
            >
              {form.formState.isSubmitting ? "Requesting link..." : "Request link"}
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
