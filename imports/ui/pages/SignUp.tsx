import { zodResolver } from "@hookform/resolvers/zod";
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

  return (
    <>
      <div>
        <h1>Create Account</h1>
        <p>Enter your data to start enjoying</p>
      </div>
      <div className="box">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Email <span className="important">*</span>
          </label>
          <input type="email" required placeholder="you@henrique.dev" {...register("email")} />
          {errors.email && <span>{errors.email.message}</span>}
          <label>
            Password <span className="important">*</span>
          </label>
          <input type="password" required placeholder="Your Password" {...register("password")} />
          {errors.password && <span>{errors.password.message}</span>}
          <input
            type="password"
            required
            placeholder="Confirm your Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
          <button type="submit" disabled={signUp.isPending}>
            {signUp.isPending ? "Signing up..." : "Sign up"}
          </button>
          {signUp.isError && <p className="important">Error: {signUp.error.message}</p>}
          <Link to={ROUTES.SIGN_IN} className="back">
            ⭠ back to login page
          </Link>
        </form>
      </div>
    </>
  );
};
