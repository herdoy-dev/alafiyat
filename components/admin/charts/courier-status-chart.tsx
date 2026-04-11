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

const STATUS_COLORS: Record<string, string> = {
  delivered: "var(--chart-1)",
  in_transit: "var(--chart-2)",
  picked_up: "var(--chart-3)",
  pending: "var(--chart-4)",
  cancelled: "var(--chart-5)",
};

const config = {
  count: { label: "Orders" },
} satisfies ChartConfig;

export function CourierStatusChart({
  data,
}: {
  data: { status: string; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No courier data yet
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    fill: STATUS_COLORS[d.status] ?? "var(--chart-3)",
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
