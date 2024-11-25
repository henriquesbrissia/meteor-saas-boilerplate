import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "./routes";

export const ProtectedRoutes = () => {
  const user = useTracker(() => Meteor.user());

  return user ? <Outlet /> : <Navigate to={ROUTES.SIGN_IN} />;
};
