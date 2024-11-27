import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { profileSchema } from "/imports/api/users/schemas";

import { api } from "../api";
import { ROUTES } from "../utils/routes";

type ProfileValues = Zod.infer<typeof profileSchema>;

export const Profile = () => {
  const { data: user } = api.users.loggedUser.useQuery();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileValues>({
    defaultValues: {
      userId: user?._id,
      name: user?.profile?.name || "",
      email: user?.emails[0].address || ""
    },
    resolver: zodResolver(profileSchema)
  });

  const updateProfile = api.users.updateProfile.useMutation();

  const onSubmit = async (data: ProfileValues) => {
    await updateProfile.mutateAsync(data, {
      onError: (e) => {
        alert(e.message);
      },
      onSuccess: () => {
        alert("Update successfull");
      }
    });
  };

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Name:</label>
        <input type="text" {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
        <label>Email:</label>
        <input type="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        <Link to={ROUTES.DASHBOARD}>Back to Dashboard</Link>
      </form>
    </div>
  );
};
