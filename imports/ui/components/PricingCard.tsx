import { Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../elements/card";
import { SubscribeButtonDialog } from "./SubscribeButtonDialog";

export default function PricingCard() {
  return (
    <div className="mt-12 justify-items-center mx-auto">
      <Card className="px-6 py-3 space-y-4 shadow-lg w-[28rem]">
        <CardHeader>
          <CardTitle className="text-3xl">Premium Plan</CardTitle>
          <CardDescription>Everything you need to manage your team</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold mb-8 mt-4">
            $29
            <span className="font-normal text-muted-foreground text-lg">/month</span>{" "}
          </p>
          <ul>
            <li className="flex gap-2 text-muted-foreground">
              <Check className="w-4 text-green-600" />
              Premium team metrics
            </li>
            <li className="flex gap-2 text-muted-foreground">
              <Check className="w-4 text-green-600" />
              Special suport 24/7
            </li>
            <li className="flex gap-2 text-muted-foreground">
              <Check className="w-4 text-green-600" />
              Unlimited access
            </li>
            <li className="flex gap-2 text-muted-foreground">
              <Check className="w-4 text-green-600" />
              Cancel whenever you want
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <SubscribeButtonDialog />
        </CardFooter>
      </Card>
    </div>
  );
}
