"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const config = {
  count: { label: "Orders" },
  bKash: { label: "bKash", color: "var(--chart-1)" },
  Nagad: { label: "Nagad", color: "var(--chart-2)" },
  Rocket: { label: "Rocket", color: "var(--chart-3)" },
  Upay: { label: "Upay", color: "var(--chart-4)" },
} satisfies ChartConfig;

const COLORS: Record<string, string> = {
  bKash: "var(--chart-1)",
  Nagad: "var(--chart-2)",
  Rocket: "var(--chart-3)",
  Upay: "var(--chart-4)",
};

export function PaymentMethodsChart({
  data,
}: {
  data: { method: string; count: number }[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
        No payment data yet
      </div>
    );
  }

  return (
    <ChartContainer config={config} className="h-[260px] w-full">
      <BarChart data={data} margin={{ left: 12, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="method"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <ChartTooltip content={<ChartTooltipContent nameKey="method" />} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((d) => (
            <Cell
              key={d.method}
              fill={COLORS[d.method] ?? "var(--chart-5)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
