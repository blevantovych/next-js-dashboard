"use client";

import { Cell, flexRender } from "@tanstack/react-table";
import Link from "next/link";
import { type TitledOpponetStats } from "./columns";

export function TitledLink(cell: Cell<TitledOpponetStats, unknown>) {
  return (
    <Link href={`${cell.column.id}/${cell.row.original.opponent_title}`}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </Link>
  );
}
