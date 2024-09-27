"use client";

import { Cell, flexRender } from "@tanstack/react-table";
import Link from "next/link";
import { type TitledOpponetStats } from "./columns";
import { ReadonlyURLSearchParams } from "next/navigation";

export function TitledLink(cell: Cell<TitledOpponetStats, unknown>, searchParams: ReadonlyURLSearchParams) {
  return (
    <Link
      href={`${cell.column.id}/${cell.row.original.opponent_title}?${searchParams.toString()}`}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </Link>
  );
}
