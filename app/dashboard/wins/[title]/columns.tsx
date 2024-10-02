"use client";
import { getWins } from "@/app/db/queries/select";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type GameInfo = Awaited<ReturnType<typeof getWins>>[number];

export const columns: ColumnDef<GameInfo>[] = [
  {
    accessorKey: "site",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Link" />
    ),
    cell: ({ row }) => (
      <Link href={row.original.site} target="_blank">
        {row.original.site}
      </Link>
    ),
  },
  {
    accessorKey: "white",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="White" />
    ),
  },
  {
    accessorKey: "black",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Black" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
  },
  // {
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Average Opponent Rating" />
  //   ),
  //   accessorKey: "average_opponent_rating",
  // },
  // {
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Games Played" />
  //   ),
  //   accessorKey: "games_played",
  // },
  // {
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Wins" />
  //   ),
  //   accessorKey: "wins",
  // },
  // {
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Losses" />
  //   ),
  //   accessorKey: "losses",
  // },
  // {
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Draws" />
  //   ),
  //   accessorKey: "draws",
  // },
  // {
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Net Wins" />
  //   ),
  //   accessorKey: "net_wins",
  //   // cell: ({ row }: { row: Row<TitledOpponetStats> }) => {
  //   //   const netWins: number = row.getValue("net_wins");
  //   //   return <span className={getNetWinsClass(netWins)}>{netWins}</span>;
  //   // },
  // },
  // {
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Win %" />
  //   ),
  //   accessorKey: "win_percentage",
  // },
  // {
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Points %" />
  //   ),
  //   accessorKey: "points_percentage",
  // },
];
