import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";
import { Meteor } from "meteor/meteor";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { type AuthValues, signInSchema } from "/imports/api/auth/schemas";
import { ROUTES } from "/imports/ui/utils/routes";

import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { Input } from "../components/input";
import { Label } from "../components/label";

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AuthValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInSchema)
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = ({ email, password }: AuthValues) => {
    setErrorMessage(null);
    Meteor.loginWithPassword(email, password, (error) => {
      if (error) {
        const message = error?.message || "Sorry, please try again.";
        setErrorMessage(message);
        return;
      }
      reset();
      navigate(ROUTES.DASHBOARD);
    });
  };

  const googleAuth = () => {
    Meteor.loginWithGoogle({}, (error) => {
      if (error) {
        alert(`Error: ${error.message}`);
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
          alert(`Error: ${error.message}`);
        }
        navigate(ROUTES.DASHBOARD);
      }
    );
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="px-8 space-y-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-4xl my-4 text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && <span>{errors.email.message}</span>}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                placeholder="Your password"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              {errors.password && <span>{errors.password.message}</span>}
            </div>
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            {errorMessage && (
              <p role="alert" aria-live="assertive">
                Error: {errorMessage}
              </p>
            )}
            <div className="flex my-6 gap-5">
              <Button onClick={googleAuth} variant="outline" className="w-full">
                <span className="font-bold text-lg">G</span> Google
              </Button>
              <Button onClick={githubAuth} variant="outline" className="w-full">
                <Github /> Github
              </Button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to={ROUTES.SIGN_UP} className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
