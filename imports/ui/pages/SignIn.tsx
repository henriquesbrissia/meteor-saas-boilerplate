import { zodResolver } from "@hookform/resolvers/zod";
import { Meteor } from "meteor/meteor";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { type AuthValues, signInSchema } from "/imports/api/auth/schemas";

import { ROUTES } from "../utils/routes";

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
    <>
      <div>
        <h1>Welcome back!</h1>
        <p>
          Do not have an account yet? <Link to={ROUTES.SIGN_UP}>Create account</Link>
        </p>
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              placeholder="you@henrique.dev"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              placeholder="Your password"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <Link to={ROUTES.FORGOT_PASSWORD}>Forgot password?</Link>
          <br />
          <div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
            {errorMessage && (
              <p role="alert" aria-live="assertive">
                Error: {errorMessage}
              </p>
            )}
          </div>
        </form>
        <button onClick={googleAuth}>Sign in with Google</button>
        <button onClick={githubAuth}>Sign in with GitHub</button>
      </div>
    </>
  );
};
