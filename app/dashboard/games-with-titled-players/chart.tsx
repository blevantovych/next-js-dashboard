"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function Chart({
  chartData,
}: {
  chartData: { date: string; total_games: number }[];
}) {
  const total = React.useMemo(
    () => ({
      // desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      games: chartData.reduce((acc, curr) => acc + curr.total_games, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          <button className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Games</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total["games"].toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig}>
          <BarChart
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
            <YAxis />
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
            {/* show rating diff for each day (i.e. lost 50 points) */}
            <Bar dataKey="wins" stackId="a" fill={`var(--color-wins)`} />
            <Bar dataKey="losses" stackId="a" fill={`var(--color-losses)`} />
            <Bar dataKey="draws" stackId="a" fill={`var(--color-draws)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
