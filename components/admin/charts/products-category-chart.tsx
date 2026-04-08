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

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function ProductsCategoryChart({
  data,
}: {
  data: { category: string; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No products yet
      </div>
    );
  }

  const config: ChartConfig = {
    count: { label: "Products" },
    ...Object.fromEntries(
      data.map((d, i) => [
        d.category,
        { label: d.category, color: PALETTE[i % PALETTE.length] },
      ])
    ),
  };

  const chartData = data.map((d, i) => ({
    ...d,
    fill: PALETTE[i % PALETTE.length],
  }));

  return (
    <ChartContainer config={config} className="mx-auto h-[260px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="category" />} />
        <Pie
          data={chartData}
          dataKey="count"
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
