import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "../utils/routes";

export const ProtectedRoutes = () => {
  const { user, isLoading } = useTracker(() => {
    const user = Meteor.user();
    const isLoading = Meteor.loggingIn();
    return { user, isLoading };
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return user ? (
    <Suspense fallback={<p>Loading...</p>}>
      <Outlet />
    </Suspense>
  ) : (
    <Navigate to={ROUTES.SIGN_IN} />
  );
};
