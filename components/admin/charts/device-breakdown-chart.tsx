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

const COLORS: Record<string, string> = {
  mobile: "var(--chart-1)",
  desktop: "var(--chart-2)",
  tablet: "var(--chart-3)",
};

const config = {
  count: { label: "Views" },
} satisfies ChartConfig;

export function DeviceBreakdownChart({
  data,
}: {
  data: { device: string; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No device data yet
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    fill: COLORS[d.device] ?? "var(--chart-4)",
  }));

  return (
    <ChartContainer config={config} className="mx-auto h-[260px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="device" />} />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="device"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell key={entry.device} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="device" />}
          verticalAlign="bottom"
        />
      </PieChart>
    </ChartContainer>
  );
}
