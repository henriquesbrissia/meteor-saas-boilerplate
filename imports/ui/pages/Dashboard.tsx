import { Link } from "react-router-dom";

import { ROUTES } from "/imports/ui/utils/routes";

export const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen w-full items-left p-28 space-y-10">
      <h1 className="text-4xl font-extrabold">Dashboard.</h1>
      <Link to={ROUTES.PROFILE} className="underline">
        - Profile Settings
      </Link>
    </div>
  );
};
