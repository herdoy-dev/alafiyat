"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const config = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ProfitBreakdownChart({
  data,
}: {
  data: { name: string; revenue: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No revenue data yet
      </div>
    );
  }

  return (
    <ChartContainer config={config} className="h-[260px] w-full">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 16, right: 24, top: 8, bottom: 8 }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => `৳${v.toLocaleString()}`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={120}
          tickFormatter={(v: string) =>
            v.length > 18 ? `${v.slice(0, 18)}…` : v
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => `৳${Number(value).toLocaleString()}`}
            />
          }
        />
        <Bar
          dataKey="revenue"
          fill="var(--color-revenue)"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
