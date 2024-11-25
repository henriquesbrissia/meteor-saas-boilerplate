import { zodResolver } from "@hookform/resolvers/zod";
import { Meteor } from "meteor/meteor";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { z } from "zod";

import { authSignUpSchema } from "/imports/api/auth/schemas";

import { ROUTES } from "../utils/routes";

type AuthValues = z.infer<typeof authSignUpSchema>;

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<AuthValues>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(authSignUpSchema)
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleError = (error: Meteor.Error | undefined) => {
    if (error) {
      const reason = error?.reason || "Sorry, please try again.";
      setErrorMessage(reason);
      return;
    }
    reset();
    navigate(ROUTES.DASHBOARD);
  };

  const onSubmit = ({ email, password }: AuthValues) => {
    setErrorMessage(null);
    Meteor.loginWithPassword(email, password, (error) => {
      handleError(error);
    });
  };

  return (
    <>
      <div>
        <h1>Welcome back!</h1>
        <p>
          Do not have an account yet? <Link to={ROUTES.SIGN_UP}>Create account</Link>
        </p>
      </div>
      <div className="box">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Email <span className="important">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="you@henrique.dev"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
          <label>
            Password <span className="important">*</span>
          </label>
          <input
            type="password"
            required
            placeholder="Your password"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
          <Link to={ROUTES.FORGOT_PASSWORD} className="forgot">
            Forgot password?
          </Link>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
          {errorMessage && (
            <p className="important" role="alert" aria-live="assertive">
              Error: {errorMessage}
            </p>
          )}
        </form>
      </div>
    </>
  );
};
