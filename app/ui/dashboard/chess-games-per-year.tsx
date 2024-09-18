import { getYearlyGameCount } from "@/app/db/queries/select";
import { Card } from "@/app/ui/dashboard/cards";

export default async function GamesOverYears() {
  const playerName = "bodya17";
  const chess_games = await getYearlyGameCount(playerName);
  return (
    <>
      {chess_games.map(({ count, year }) => (
        <Card title={year.toString()} value={count} />
      ))}
    </>
  );
}
