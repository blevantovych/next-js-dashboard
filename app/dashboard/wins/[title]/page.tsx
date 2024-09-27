import { getWins } from "@/app/db/queries/select";

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
  return (
    <>
      <h1>
        {wins.length} wins with {params.title}
      </h1>
      <ul>
        {wins.map(({ site }) => (
          <li>
            <a href={site} target="_blank">
              {site}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
