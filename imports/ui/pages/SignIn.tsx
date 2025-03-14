import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";
import { Meteor } from "meteor/meteor";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { type AuthValues, signInSchema } from "/imports/api/auth/schemas";
import { useToast } from "/imports/hooks/use-toast";

import { ROUTES } from "../../utils/routes";
import { TwoFactorForm } from "../components/TwoFactorForm";
import { Button } from "../elements/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../elements/card";
import { Input } from "../elements/input";
import { Label } from "../elements/label";
import { Toaster } from "../elements/toaster";

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
      Meteor.loginWithPassword(email, password, (error: Meteor.Error | Error | undefined) => {
        if (error) {
          if ('error' in error && error.error === "no-2fa-code") {
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
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
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
    <div className="flex h-screen w-full items-center justify-center dark:bg-gray-900">
      <Card className="px-8 space-y-3 shadow-lg w-[28rem] dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl mb-3 mt-2 text-center dark:text-white">Sign in</CardTitle>
          <CardDescription className="text-center dark:text-gray-300">
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
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                <Input
                  id="email"
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="ml-auto inline-block text-sm underline text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                {form.formState.errors.password && (
                  <span className="text-red-500 dark:text-red-400">{form.formState.errors.password.message}</span>
                )}
              </div>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting}
                className="w-full dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                <span className="flex-shrink m-3 text-gray-500 text-xs dark:text-gray-400">or continue with</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="flex mb-6 gap-5">
                <Button 
                  onClick={googleAuth} 
                  size="lg" 
                  variant="outline" 
                  className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                >
                  <span className="font-bold text-lg">G</span> Google
                </Button>
                <Button 
                  onClick={githubAuth} 
                  size="lg" 
                  variant="outline" 
                  className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                >
                  <Github /> Github
                </Button>
              </div>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account yet?{" "}
                <Link to={ROUTES.SIGN_UP} className="underline hover:text-gray-700 dark:hover:text-gray-300">
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
