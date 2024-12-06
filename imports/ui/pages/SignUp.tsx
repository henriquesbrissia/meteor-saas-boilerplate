import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";
import { Meteor } from "meteor/meteor";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { type CreateUserValues, signUpSchema } from "/imports/api/auth/schemas";
import { api } from "/imports/ui/api";
import { ROUTES } from "/imports/ui/utils/routes";

import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { Input } from "../components/input";
import { Label } from "../components/label";

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateUserValues>({
    defaultValues: { email: "", password: "", confirmPassword: "" },
    resolver: zodResolver(signUpSchema)
  });
  const navigate = useNavigate();

  const signUp = api.auth.signUp.useMutation();

  const onSubmit = async ({ email, password }: CreateUserValues) => {
    await signUp.mutateAsync(
      { email, password },
      {
        onSuccess: () => {
          Meteor.loginWithPassword(email, password);
          reset();
          navigate(ROUTES.DASHBOARD);
        },
        onError: (e) => alert(e.message)
      }
    );
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
      <Card className="px-8 space-y-6 shadow-lg w-[28rem]">
        <CardHeader>
          <CardTitle className="text-3xl mb-5 mt-2 text-center">Sign up</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to create your account
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
              <Input
                id="confirmPassword"
                type="password"
                required
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
            </div>
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              disabled={signUp.isPending}
              className="w-full"
            >
              {signUp.isPending ? "Signing up..." : "Sign up"}
            </Button>
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink m-4 text-gray-400 text-xs">or sign up with</span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="flex mb-6 gap-5">
              <Button onClick={googleAuth} variant="outline" className="w-full">
                <span className="font-bold text-lg">G</span> Google
              </Button>
              <Button onClick={githubAuth} variant="outline" className="w-full">
                <Github /> Github
              </Button>
            </div>
          </div>
          <div className="mt-4 text-left text-sm">
            <Link to={ROUTES.SIGN_IN} className="underline text-gray-500">
              ⭠ back to sign in page
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
