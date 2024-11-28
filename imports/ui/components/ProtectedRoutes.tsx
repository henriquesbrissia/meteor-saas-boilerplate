import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "../utils/routes";

export const ProtectedRoutes = () => {
  const user = useTracker(() => Meteor.user());

  return !!user ? (
    <Suspense fallback={<p>Loading...</p>}>
      <Outlet />
    </Suspense>
  ) : (
    <Navigate to={ROUTES.SIGN_IN} />
  );
};
