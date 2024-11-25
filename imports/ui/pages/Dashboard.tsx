import { Link } from "react-router-dom";

import { ROUTES } from "../utils/routes";

export const Dashboard = () => {
  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <Link to={ROUTES.PROFILE}>Profile Settings</Link>
    </div>
  );
};
