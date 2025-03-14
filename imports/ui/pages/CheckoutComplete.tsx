import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../utils/routes";
import { Button } from "../elements/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../elements/card";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

export const CheckoutComplete = () => {
  const navigate = useNavigate();
  return (
    <div className="flex-col h-screen w-full dark:bg-gray-900">
      <div className="flex justify-end p-4">
        <ThemeSwitcher />
      </div>
      <div className="flex w-full items-center justify-center mt-20">
        <Card className="max-w-lg mt-10 text-center shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <CardContent>
            <CardHeader>
              <ShoppingBag size={44} className="text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl dark:text-white">Subscription Confirmed</CardTitle>
              <CardDescription className="dark:text-gray-300">Thank you for joining our community!</CardDescription>
            </CardHeader>
            <div className="text-gray-700 dark:text-gray-300 text-sm">
              <p>Your subscription has been confirmed and your Premium Account is active.</p>
              <p>You can now fully enjoy our content</p>
            </div>
            <Button onClick={() => navigate(ROUTES.DASHBOARD)} className="mt-12 mb-3 dark:bg-blue-600 dark:hover:bg-blue-700">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
