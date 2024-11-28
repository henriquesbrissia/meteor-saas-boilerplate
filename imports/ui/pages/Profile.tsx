import { zodResolver } from "@hookform/resolvers/zod";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import type { ProfileValues } from "/imports/api/users/schemas";
import { profileSchema } from "/imports/api/users/schemas";

import { api } from "../api";
import { ROUTES } from "../utils/routes";

export const Profile = () => {
  const { data: user } = api.users.loggedUser.useQuery();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProfileValues>({
    defaultValues: {
      userId: user?._id,
      name: user?.profile?.name || "",
      email:
        user?.services?.github?.email ||
        user?.services?.google?.email ||
        user?.emails[0].address ||
        "",
      image:
        user?.services?.github?.avatar ||
        user?.services?.google?.picture ||
        user?.profile?.image ||
        ""
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const profilePicture = watch("image");

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {profilePicture && (
          <div>
            <img
              src={profilePicture}
              alt="Profile Picture"
              style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "50%" }}
            />
          </div>
        )}
        {errors.image && <span>{errors.image.message}</span>}
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
