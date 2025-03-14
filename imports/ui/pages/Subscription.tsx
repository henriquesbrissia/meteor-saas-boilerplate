import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Crown, XCircle } from "lucide-react";
import { Meteor } from "meteor/meteor";

import type { CancelSubscriptionValues, SubscriptionDetails } from "/imports/api/checkout/schemas";
import { useToast } from "/imports/hooks/use-toast";

import { api } from "../api";
import { AppSidebar } from "../components/AppSidebar";
import PricingCard from "../components/PricingCard";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../elements/alert-dialog";
import BannerWarning from "../elements/banner-warning";
import { Button } from "../elements/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../elements/card";
import { SidebarProvider, SidebarTrigger } from "../elements/sidebar";
import { Toaster } from "../elements/toaster";

export const Subscription = () => {
  const {
    data: subscription,
    isLoading,
    error
  } = useQuery<SubscriptionDetails>({
    queryKey: ["subscriptionDetails"],
    queryFn: () => api.checkout.getSubscriptionDetails()
  });

  if (isLoading) {
    return <div className="dark:text-white">Loading...</div>;
  }

  if (error) {
    return <div className="dark:text-white">Error loading subscription Details</div>;
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-col h-screen w-full dark:bg-gray-900">
          <div className="bg-white dark:bg-gray-800 shadow-sm flex justify-between items-center">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold pb-4 pl-4 pt-7 dark:text-white">
                Your Subscription <Crown className="inline pb-1 ml-1" />
              </h1>
            </div>
            <div className="pr-6 pt-2">
              <ThemeSwitcher />
            </div>
          </div>
          {subscription?.isActive ? (
            <div className="flex gap-12 flex-cols-2 max-w-5xl min-w-[750px] mx-auto px-6 pt-14">
              <PlanCard subscription={subscription} />
              <ActionCard subscriptionId={subscription.id} />
            </div>
          ) : (
            <>
              <BannerWarning text="You need an active subscription to access this page. Wanna subscribe now?" />
              <PricingCard />
            </>
          )}

          <Toaster />
        </div>
      </SidebarProvider>
    </>
  );
};

function PlanCard({ subscription }: { subscription: SubscriptionDetails }) {
  return (
    <Card className="max-w-md w-full shadow-md px-6 py-3 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-3xl dark:text-white">Subscription Details</CardTitle>
        <CardDescription className="dark:text-gray-300">Information about your current plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Plan:</span>
            <span className="dark:text-white">{subscription.plan}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">ID:</span>
            <span className="text-sm dark:text-white">{subscription.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className="text-green-600 dark:text-green-500">{subscription.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Next billing:</span>
            <span className="dark:text-white">{subscription.nextBilling}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Price:</span>
            <span className="dark:text-white">
              {(subscription.price / 100).toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Cicle:</span>
            <span className="dark:text-white">{subscription.cicle}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionCard({ subscriptionId }: { subscriptionId: CancelSubscriptionValues }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const cancelSubscription = async () => {
    await api.checkout.cancelSubscription(subscriptionId);
    await queryClient.invalidateQueries();
    toast({
      title: "Done",
      description: "Your subscription was canceled."
    });
  };

  const customerPage = Meteor.settings.public.StripeClientPage as string;

  return (
    <Card className="w-full max-w-sm h-full shadow-md px-4 py-3 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-3xl dark:text-white">Actions</CardTitle>
        <CardDescription className="dark:text-gray-300">Manage your subscription</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <a href={customerPage} target="_blank">
            <Button variant={"outline"} className="w-full mt-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              <CreditCard className="mr-2 h-5 w-5 text-gray-400" />
              Update payment method
            </Button>
          </a>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} className="w-full">
                <XCircle className="mr-2 h-5 w-5" />
                Cancel subscription
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="dark:text-white">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="dark:text-gray-300">
                  <p>It's sad to see you go {":("}</p>
                  This action will immediately revoke access to your Premium Features.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={cancelSubscription} className="dark:bg-red-600 dark:hover:bg-red-700">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
