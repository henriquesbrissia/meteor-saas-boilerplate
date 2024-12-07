import { zodResolver } from "@hookform/resolvers/zod";
import { Meteor } from "meteor/meteor";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import type { ProfileValues } from "/imports/api/users/schemas";
import { profileSchema } from "/imports/api/users/schemas";

import { api } from "../api";
import { PasswordUpdate } from "../components/PasswordUpdate";
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

  const updateProfile = api.users.updateProfile.useMutation({
    onError: (e) => alert(e.message),
    onSuccess: () => alert("Update successful!")
  });

  const handleUpdateProfile = async (data: ProfileValues) => {
    await updateProfile.mutateAsync(data);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setValue("image", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    Meteor.logout();
    navigate(ROUTES.SIGN_IN);
  };

  const deleteAccount = api.users.deleteAccount.useMutation({
    onError: (e) => alert(e.message),
    onSuccess: () => {
      alert("Account deleted successfully.");
      handleLogout();
    }
  });

  const userId = watch("userId");

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDelete) {
      await deleteAccount.mutateAsync(userId);
    }
  };

  const profilePicture = watch("image");

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        {profilePicture && (
          <div>
            <img
              src={profilePicture}
              alt="Profile Picture"
              style={{ width: "150px", height: "150px", borderRadius: "50%" }}
            />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {errors.image && <span>{errors.image.message}</span>}
        <h2>Your info:</h2>
        <label>Name:</label>
        <input type="text" {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
        <br />
        <label>Email:</label>
        <input type="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
        <br />
        <button style={{ marginTop: "15px" }} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
      <PasswordUpdate />
      <button style={{ marginTop: "20px" }} onClick={handleLogout}>
        Logout
      </button>
      <br />
      <button onClick={handleDeleteAccount} style={{ marginTop: "20px", color: "red" }}>
        Delete Account
      </button>
    </div>
  );
};
