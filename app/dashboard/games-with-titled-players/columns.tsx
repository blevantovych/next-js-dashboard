"use client";
import { getTitledOpponentStats } from "@/app/db/queries/select";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export const getNetWinsClass = (netWinsNumber: number) => {
  if (netWinsNumber > 0) {
    return "text-green-600 font-semibold";
  } else if (netWinsNumber < 0) {
    return "text-red-600 font-semibold";
  } else {
    return "font-semibold";
  }
};

export const columns: ColumnDef<
  Awaited<ReturnType<typeof getTitledOpponentStats>>[number]
>[] = [
  {
    accessorKey: "opponent_title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Opponent Title" />
    ),
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Average Opponent Rating" />
    ),
    accessorKey: "average_opponent_rating",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Games Played" />
    ),
    accessorKey: "games_played",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wins" />
    ),
    accessorKey: "wins",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Losses" />
    ),
    accessorKey: "losses",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Draws" />
    ),
    accessorKey: "draws",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Net Wins" />
    ),
    accessorKey: "net_wins",
    // cell: ({ row }: { row: Row<TitledOpponetStats> }) => {
    //   const netWins: number = row.getValue("net_wins");
    //   return <span className={getNetWinsClass(netWins)}>{netWins}</span>;
    // },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Win %" />
    ),
    accessorKey: "win_percentage",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Points %" />
    ),
    accessorKey: "points_percentage",
  },
];
