"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";

const chartConfig = {
  gamesPlayed: {
    label: "Games played",
  },
  losses: {
    label: "Losses",
    color: "hsl(var(--chart-1))",
  },
  wins: {
    label: "Wins",
    color: "hsl(var(--chart-2))",
  },
  draws: {
    label: "Draws",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function RatingChart({
  chartData,
}: {
  chartData: { date: string; rating: number }[];
}) {
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }}
        />
        <YAxis domain={["dataMin", "dataMax"]} type="number" />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
            />
          }
        />
        <Line type="monotone" dataKey="rating" stroke="#8884d8" dot={false} />
      </LineChart>
    </ChartContainer>
  );
}
