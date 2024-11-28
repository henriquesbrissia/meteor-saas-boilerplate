import { zodResolver } from "@hookform/resolvers/zod";
import { Meteor } from "meteor/meteor";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { type CreateUserValues, signUpSchema } from "/imports/api/auth/schemas";

import { api } from "../api";
import { ROUTES } from "../utils/routes";

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
          reset();
          navigate(ROUTES.SIGN_IN);
        }
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
    <>
      <div>
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Email:</label>
            <input type="email" placeholder="you@henrique.dev" {...register("email")} />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          <div>
            <label>Password:</label>
            <input type="password" placeholder="Your Password" {...register("password")} />
            {errors.password && <span>{errors.password.message}</span>}
            <input
              type="password"
              placeholder="Confirm your Password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
          </div>
          <div>
            <button type="submit" disabled={signUp.isPending}>
              {signUp.isPending ? "Signing up..." : "Sign up"}
            </button>
            {signUp.isError && <p>Error: {signUp.error.message}</p>}
          </div>
        </form>
        <button onClick={googleAuth}>Sign up with Google</button>
        <button onClick={githubAuth}>Sign up with GitHub</button>
        <br />
        <Link to={ROUTES.SIGN_IN} className="back">
          ⭠ back to sign in page
        </Link>
      </div>
    </>
  );
};
