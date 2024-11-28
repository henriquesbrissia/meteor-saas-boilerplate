import { zodResolver } from "@hookform/resolvers/zod";
import { Accounts } from "meteor/accounts-base";
import { useForm } from "react-hook-form";

import type { PasswordValues } from "/imports/api/users/schemas";
import { passwordSchema } from "/imports/api/users/schemas";

export const PasswordUpdate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PasswordValues>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = (data: PasswordValues) => {
    Accounts.changePassword(data.oldPassword, data.newPassword, (err) => {
      if (err) {
        alert(`Error: ${err.message}`);
      } else {
        alert("Password updated successfully!");
        reset();
      }
    });
  };

  return (
    <div>
      <h2>Update Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="oldPassword">Old Password:</label>
          <input id="oldPassword" type="password" {...register("oldPassword")} />
          {errors.oldPassword && <span>{errors.oldPassword.message}</span>}
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input id="newPassword" type="password" {...register("newPassword")} />
          {errors.newPassword && <span>{errors.newPassword.message}</span>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
        </div>
        <button style={{ marginTop: "10px" }} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};
