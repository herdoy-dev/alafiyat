"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const config = {
  revenue: { label: "Revenue" },
} satisfies ChartConfig;

export function RevenueByCategoryChart({
  data,
}: {
  data: { category: string; revenue: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No category revenue yet
      </div>
    );
  }

  const chartData = data.map((d, i) => ({
    ...d,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <ChartContainer config={config} className="mx-auto h-[260px] w-full">
      <PieChart>
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="category"
              formatter={(value) => `৳${Number(value).toLocaleString()}`}
            />
          }
        />
        <Pie
          data={chartData}
          dataKey="revenue"
          nameKey="category"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell key={entry.category} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="category" />}
          verticalAlign="bottom"
        />
      </PieChart>
    </ChartContainer>
  );
}
