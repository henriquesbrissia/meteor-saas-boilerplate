import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";
import { Meteor } from "meteor/meteor";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { type CreateUserValues, signUpSchema } from "/imports/api/auth/schemas";
import { useToast } from "/imports/hooks/use-toast";
import { api } from "/imports/ui/api";

import { ROUTES } from "../../utils/routes";
import { Button } from "../elements/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../elements/card";
import { Input } from "../elements/input";
import { Label } from "../elements/label";
import { Toaster } from "../elements/toaster";

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
  const { toast } = useToast();

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
        onError: (e) => {
          toast({
            title: "Error",
            description: e.message || "Error signing up.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const googleAuth = () => {
    Meteor.loginWithGoogle({}, (error) => {
      if (error) {
        toast({
          title: "Error",
          description: error.message || "An error occured, please try again later",
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
            description: error.message || "An error occured, please try again later",
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
          <CardTitle className="text-3xl mb-3 mt-2 text-center dark:text-white">Sign up</CardTitle>
          <CardDescription className="text-center dark:text-gray-300">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                {...register("email")}
                aria-invalid={!!errors.email}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {errors.email && (
                <span className="text-red-500 dark:text-red-400">{errors.email.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                placeholder="Your password"
                {...register("password")}
                aria-invalid={!!errors.password}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {errors.password && (
                <span className="text-red-500 dark:text-red-400">{errors.password.message}</span>
              )}
              <Input
                id="confirmPassword"
                type="password"
                required
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              {errors.confirmPassword && (
                <span className="text-red-500 dark:text-red-400">{errors.confirmPassword.message}</span>
              )}
            </div>
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              size="lg"
              disabled={signUp.isPending}
              className="w-full dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {signUp.isPending ? "Signing up..." : "Sign up"}
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
          </div>
          <div className="mt-4 text-left text-sm">
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
