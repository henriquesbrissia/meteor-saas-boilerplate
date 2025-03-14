import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { api } from "../api";
import { AppSidebar } from "../components/AppSidebar";
import PricingCard from "../components/PricingCard";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import BannerWarning from "../elements/banner-warning";
import type { ChartConfig } from "../elements/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "../elements/chart";
import { SidebarProvider, SidebarTrigger } from "../elements/sidebar";
import { Toaster } from "../elements/toaster";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 }
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb"
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa"
  }
} satisfies ChartConfig;

export const Dashboard = () => {
  const {
    data: isActive,
    isLoading,
    error
  } = useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: () => api.checkout.getSubscriptionStatus()
  });

  if (isLoading) {
    return <div className="dark:text-white">Loading...</div>;
  }

  if (error) {
    return <div className="dark:text-white">Error loading subscription status</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-col h-screen w-full dark:bg-gray-900 dark:text-white">
        <div className="bg-white dark:bg-gray-800 shadow-sm flex justify-between items-center">
          <div className="flex items-center">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold pb-4 pl-4 pt-7">
              Your Dashboard <LayoutDashboard className="inline pb-1 ml-1" />
            </h1>
          </div>
          <div className="pr-6 pt-2">
            <ThemeSwitcher />
          </div>
        </div>
        {isActive ? (
          <div className="flex-col border border-gray-200 dark:border-gray-700 max-w-5xl mx-auto p-6 mt-12 bg-white dark:bg-gray-800 shadow-md rounded-xl">
            <h2 className="text-lg font-semibold">Sales:</h2>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-[900px] m-6">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} className="dark:opacity-20" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value: string) => value.slice(0, 3)}
                  className="dark:text-gray-300"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        ) : (
          <>
            <BannerWarning text="You need an active subscription to access Premium Metrics. Wanna subscribe now?" />
            <PricingCard />
          </>
        )}
        <Toaster />
      </div>
    </SidebarProvider>
  );
};
