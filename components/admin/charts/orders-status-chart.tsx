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

const config = {
  count: { label: "Orders" },
  approved: { label: "Approved", color: "var(--chart-1)" },
  pending: { label: "Pending", color: "var(--chart-3)" },
  rejected: { label: "Rejected", color: "var(--chart-5)" },
} satisfies ChartConfig;

const COLORS: Record<string, string> = {
  approved: "var(--chart-1)",
  pending: "var(--chart-3)",
  rejected: "var(--chart-5)",
};

export function OrdersStatusChart({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  const chartData = data.map((d) => ({
    ...d,
    fill: COLORS[d.status] ?? "var(--chart-2)",
  }));

  return (
    <ChartContainer config={config} className="mx-auto h-[260px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="status"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell key={entry.status} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="status" />}
          verticalAlign="bottom"
        />
      </PieChart>
    </ChartContainer>
  );
}
