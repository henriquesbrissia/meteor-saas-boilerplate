import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Meteor } from "meteor/meteor";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { SignIn } from "/imports/ui/pages/SignIn";
import { SignUp } from "/imports/ui/pages/SignUp";
import { ROUTES } from "/imports/ui/utils/routes";

const queryClient = new QueryClient();

Meteor.startup(() => {
  const container = document.getElementById("react-target");
  const root = createRoot(container!);
  root.render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.SIGN_IN} replace />} />
          <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
});
