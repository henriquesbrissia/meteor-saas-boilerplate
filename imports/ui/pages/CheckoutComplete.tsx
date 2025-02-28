import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../utils/routes";
import { Button } from "../elements/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../elements/card";

export const CheckoutComplete = () => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full items-center justify-center mt-28">
      <Card className="max-w-lg mt-10 text-center shadow-lg">
        <CardContent>
          <CardHeader>
            <ShoppingBag size={44} className="text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Subscription Confirmed</CardTitle>
            <CardDescription>Thank you for joining our community!</CardDescription>
          </CardHeader>
          <div className="text-gray-700 text-sm">
            <p>Your subscription has been confirmed and your Premium Account is active.</p>
            <p>You can now fully enjoy our content</p>
          </div>
          <Button onClick={() => navigate(ROUTES.DASHBOARD)} className="mt-12 mb-3">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
