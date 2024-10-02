"use client";
import { getTitledOpponentStats } from "@/app/db/queries/select";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

export const getNetWinsClass = (netWinsNumber: number) => {
  if (netWinsNumber > 0) {
    return "text-green-600 font-semibold";
  } else if (netWinsNumber < 0) {
    return "text-red-600 font-semibold";
  } else {
    return "font-semibold";
  }
};

export type TitledOpponetStats = Awaited<
  ReturnType<typeof getTitledOpponentStats>
>[number];

export const columns: ColumnDef<TitledOpponetStats>[] = [
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
    cell: ({ row, column, cell }) => {
      const searchParams = useSearchParams();
      if (row.original.opponent_title) {
        return (
          <Link
            href={`${column.id}/${row.original.opponent_title}?${searchParams.toString()}`}
          >
            {cell.getValue() as ReactNode}
          </Link>
        );
      } else {
        return cell.getValue() as ReactNode;
      }
    },
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
