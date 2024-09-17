import {
  fetchFilteredCustomers,
  fetchGamesPerDay,
  fetchGamesWithTitledPlayers,
  TitledOpponetStats,
} from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import { DataTable } from "@/components/ui/data-table";
import { columns, getNetWinsClass } from "./columns";
import { Chart } from "./chart";

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatGamesPerDayData(
  gamesPerDay: {
    date: Date;
    count: string;
    draws: string;
    losses: string;
    wins: string;
  }[]
): {
  date: string;
  count: number;
  draws: number;
  wins: number;
  losses: number;
}[] {
  return gamesPerDay.map(({ date, count, draws, wins, losses }) => ({
    date: formatDate(date),
    count: Number(count),
    draws: Number(draws),
    wins: Number(wins),
    losses: Number(losses),
  }));
}

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
  const gamesPerDay = await fetchGamesPerDay("bodya17");
  const gamesPerDayFormatted = formatGamesPerDayData(gamesPerDay.rows);
  console.log(gamesPerDayFormatted.slice(0, 5));
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
        <Chart chartData={gamesPerDayFormatted} />
      </div>
    </main>
  );
}
// <Chart
//   data={[
//     { month: "January", desktop: 186, mobile: 80 },
//     { month: "February", desktop: 305, mobile: 200 },
//     { month: "March", desktop: 237, mobile: 120 },
//     { month: "April", desktop: 73, mobile: 190 },
//     { month: "May", desktop: 209, mobile: 130 },
//     { month: "June", desktop: 214, mobile: 140 },
//   ]}
// />
