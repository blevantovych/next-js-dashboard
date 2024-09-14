import {
  fetchFilteredCustomers,
  fetchGamesWithTitledPlayers,
  TitledOpponetStats,
} from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import { DataTable } from "@/components/ui/data-table";
import { columns, getNetWinsClass } from "./columns";

function convertNumericValuesToNumber(data: TitledOpponetStats[]) {
  return data.map(
    ({
      games_played,
      wins,
      losses,
      draws,
      net_wins,
      win_percentage,
      points_percentage,
      average_opponent_rating,
      ...rest
    }) => ({
      games_played: Number(games_played),
      wins: Number(wins),
      losses: Number(losses),
      draws: Number(draws),
      net_wins: Number(net_wins),
      win_percentage: Number(win_percentage),
      points_percentage: Number(points_percentage),
      average_opponent_rating: Number(average_opponent_rating),
      ...rest,
    })
  );
}

export default async function Page() {
  const results = await fetchGamesWithTitledPlayers(
    "bodya17",
    "Rated bullet game"
  );
  await fetchFilteredCustomers("");
  const data = convertNumericValuesToNumber(results.rows);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Games with titled players
      </h1>
      <div>
        {/* List view for mobile devices */}
        <div className="block lg:hidden">
          {data.map((item, index) => (
            <div key={index} className="bg-white shadow rounded-lg mb-4 p-4">
              <div className="mb-2">
                <span className="font-semibold">Opponent Title: </span>
                <span>{item.opponent_title || "No Title"}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">
                  Avgerage Opponent Rating:{" "}
                </span>
                <span>{item.average_opponent_rating}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Games Played: </span>
                <span>{item.games_played}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Wins: </span>
                <span>{item.wins}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Losses: </span>
                <span>{item.losses}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Draws: </span>
                <span>{item.draws}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Net Wins: </span>
                {/*<span className={getNetWinsClass(item.net_wins)}>*/}
                <span>{item.net_wins}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Win %: </span>
                <span>{item.win_percentage}%</span>
              </div>
              <div>
                <span className="font-semibold">Points %: </span>
                <span>{item.points_percentage}%</span>
              </div>
            </div>
          ))}
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
