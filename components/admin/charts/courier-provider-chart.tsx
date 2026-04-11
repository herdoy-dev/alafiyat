"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const COLORS: Record<string, string> = {
  Pathao: "var(--chart-1)",
  Steadfast: "var(--chart-2)",
};

const config = {
  count: { label: "Orders" },
} satisfies ChartConfig;

export function CourierProviderChart({
  data,
}: {
  data: { provider: string; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No courier data yet
      </div>
    );
  }

  return (
    <ChartContainer config={config} className="h-[260px] w-full">
      <BarChart data={data} margin={{ left: 12, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="provider"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={32}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent nameKey="provider" />} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((d) => (
            <Cell
              key={d.provider}
              fill={COLORS[d.provider] ?? "var(--chart-4)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
