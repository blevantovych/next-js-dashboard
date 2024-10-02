import { getWins } from "@/app/db/queries/select";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: { from?: string; to?: string };
  params: { title: string };
}) {
  const playerName = "bodya17";
  const opponentTitle = params.title;
  const event = "Rated bullet game";
  const startDate = searchParams?.from ?? "2024-01-01";
  const endDate = searchParams?.to ?? "2024-01-30";
  const wins = await getWins({
    playerName,
    opponentTitle,
    event,
    startDate,
    endDate,
  });
  return <DataTable data={wins} columns={columns} />;
}
