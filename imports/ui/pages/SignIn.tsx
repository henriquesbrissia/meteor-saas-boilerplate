import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";
import { Meteor } from "meteor/meteor";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { type AuthValues, signInSchema } from "/imports/api/auth/schemas";
import { ROUTES } from "/imports/ui/utils/routes";

import { TwoFactorForm } from "../components/TwoFactorForm";
import { Button } from "../elements/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../elements/card";
import { Input } from "../elements/input";
import { Label } from "../elements/label";
import { Toaster } from "../elements/toaster";
import { useToast } from "../hooks/use-toast";

export const SignIn = () => {
  const form = useForm<AuthValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInSchema)
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const [requires2fa, setRequires2fa] = useState(false);
  const [pendingAuth, setPendingAuth] = useState<{ email: string; password: string } | null>(null);

  const onSubmit = ({ email, password }: AuthValues) => {
    try {
      Meteor.loginWithPassword(email, password, (error) => {
        if (error) {
          if (error.error === "no-2fa-code") {
            setRequires2fa(true);
            setPendingAuth({ email, password });
            return;
          }
          toast({
            title: "Error",
            description: error.message || "Sorry, please try again.",
            variant: "destructive"
          });
          return;
        }
        form.reset();
        navigate(ROUTES.DASHBOARD);
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  const googleAuth = () => {
    Meteor.loginWithGoogle({}, (error) => {
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
      navigate(ROUTES.DASHBOARD);
    });
  };

  const githubAuth = () => {
    Meteor.loginWithGithub(
      {
        requestPermissions: ["user"]
      },
      (error) => {
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive"
          });
        }
        navigate(ROUTES.DASHBOARD);
      }
    );
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="px-8 space-y-4 shadow-lg w-[28rem]">
        <CardHeader>
          <CardTitle className="text-3xl mb-3 mt-2 text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            {requires2fa
              ? "Enter your 2FA code to complete sign in"
              : "Enter your email below to login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requires2fa && pendingAuth ? (
            <TwoFactorForm
              email={pendingAuth.email}
              password={pendingAuth.password}
              onSuccess={() => {
                form.reset();
                navigate(ROUTES.DASHBOARD);
              }}
            />
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...form.register("email")}
                  aria-invalid={!!form.formState.errors.email}
                />
                {form.formState.errors.email && <span>{form.formState.errors.email.message}</span>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="ml-auto inline-block text-sm underline text-gray-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Your password"
                  {...form.register("password")}
                  aria-invalid={!!form.formState.errors.password}
                />
                {form.formState.errors.password && (
                  <span>{form.formState.errors.password.message}</span>
                )}
              </div>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink m-4 text-gray-500 text-xs">or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <div className="flex mb-6 gap-5">
                <Button onClick={googleAuth} variant="outline" className="w-full">
                  <span className="font-bold text-lg">G</span> Google
                </Button>
                <Button onClick={githubAuth} variant="outline" className="w-full">
                  <Github /> Github
                </Button>
              </div>
              <div className="text-center text-sm text-gray-500">
                Don't have an account yet?{" "}
                <Link to={ROUTES.SIGN_UP} className="underline">
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};
