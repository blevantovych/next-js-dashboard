import { fetchGamesPerYear } from "@/app/lib/data";
import { Card } from "@/app/ui/dashboard/cards";

export default async function GamesOverYears() {
  const chess_games = await fetchGamesPerYear();
  return (
    <>
      {chess_games.rows.map(({ count, year }) => (
        <Card title={year} value={count} />
      ))}
    </>
  );
}
