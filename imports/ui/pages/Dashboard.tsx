import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { AppSidebar } from "../components/AppSidebar";
import type { ChartConfig } from "../elements/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "../elements/chart";
import { SidebarProvider, SidebarTrigger } from "../elements/sidebar";

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
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-col h-screen w-full">
        <SidebarTrigger />
        <h1 className="text-4xl font-extrabold mt-10 ml-6 mb-4">Dashboard</h1>
        <div className="border-t border-gray-300 w-full"></div>
        <div className="flex-col w-full">
          <h2 className="font-semibold mt-10 ml-6 mb-4">Sales:</h2>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-[900px] m-6">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: string) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </SidebarProvider>
  );
};
