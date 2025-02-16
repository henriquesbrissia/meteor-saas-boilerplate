import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Meteor } from "meteor/meteor";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoutes } from "/imports/ui/components/ProtectedRoutes";
import { CheckoutComplete } from "/imports/ui/pages/CheckoutComplete";
import { Dashboard } from "/imports/ui/pages/Dashboard";
import { ForgotPassword } from "/imports/ui/pages/ForgotPassword";
import { Profile } from "/imports/ui/pages/Profile";
import { ResetPassword } from "/imports/ui/pages/ResetPassword";
import { SignIn } from "/imports/ui/pages/SignIn";
import { SignUp } from "/imports/ui/pages/SignUp";
import { Teams } from "/imports/ui/pages/Teams";
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
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route element={<ProtectedRoutes />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.TEAMS} element={<Teams />} />
            <Route path={ROUTES.CHECKOUT_COMPLETE} element={<CheckoutComplete />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
});
