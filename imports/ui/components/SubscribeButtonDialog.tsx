import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import { Meteor } from "meteor/meteor";

import type { CheckoutSession } from "/imports/api/checkout/schemas";

import { api } from "../api";
import { Button } from "../elements/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../elements/dialog";
import { Skeleton } from "../elements/skeleton";

const stripePublishableKey = Meteor.settings.public.stripePublishableKey as string;
const stripePromise = loadStripe(stripePublishableKey);

export const SubscribeButtonDialog = () => {
  const { data, isLoading, error } = useQuery<CheckoutSession>({
    queryKey: ["checkoutSession"],
    queryFn: () => api.checkout.createSession()
  });

  if (isLoading) {
    return <Skeleton className="w-full h-[36px] rounded-md" />;
  }

  if (error || !data) {
    return (
      <p className="text-red-500 text-sm">
        Error: {error ? error.message : "Failed to load button, please try again later."}
      </p>
    );
  }

  const options = { clientSecret: data.clientSecret };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full shadow-md">
          Subscribe Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </DialogContent>
    </Dialog>
  );
};
