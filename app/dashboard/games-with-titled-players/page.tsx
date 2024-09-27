import { lusitana } from "@/app/ui/fonts";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Chart } from "./chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getDailyStats,
  getPlayerGamesCount,
  getTitledOpponentStats,
} from "@/app/db/queries/select";
import { TitledLink } from "./titled-link";
import DateRangePicker from "./date-range-selector";

export default async function Page({
  searchParams,
}: {
  searchParams?: { from?: string; to?: string };
}) {
  const playerName = "bodya17";
  const startDate = searchParams?.from ?? "2024-01-01";
  const endDate = searchParams?.to ?? "2024-01-30";
  const event = "Rated bullet game";
  const titledOpponentStats = await getTitledOpponentStats(
    playerName,
    event,
    startDate,
    endDate
  );
  const gamesPerDay = await getDailyStats(playerName, startDate, endDate);
  // const gamesCount = await getPlayerGamesCount(playerName);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Games with titled players
      </h1>
      <div>
        {/* List view for mobile devices */}
        <div className="block lg:hidden">
          {titledOpponentStats.map((item, index) => (
            <div key={index} className="bg-white shadow rounded-lg mb-4 p-4">
              <div className="mb-2">
                <span className="font-semibold">Opponent Title: </span>
                <span>{item.opponent_title || "No Title"}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Avgerage Opponent Rating:</span>
                <span>{item.average_opponent_rating}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Games Played:</span>
                <span>{item.games_played}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Wins:</span>
                <span>{item.wins}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Losses:</span>
                <span>{item.losses}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Draws:</span>
                <span>{item.draws}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Net Wins:</span>
                {/*<span className={getNetWinsClass(item.net_wins)}>*/}
                <span>{item.net_wins}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Win %:</span>
                <span>{item.win_percentage}%</span>
              </div>
              <div>
                <span className="font-semibold">Points %:</span>
                <span>{item.points_percentage}%</span>
              </div>
            </div>
          ))}
        </div>
        {/* <h1 className="m-4">{gamesCount[0].count}</h1> */}
        <DateRangePicker />
        <DataTable
          columns={columns}
          data={titledOpponentStats}
          renderCell={TitledLink}
        />
        <Card className="my-4">
          <CardHeader>
            <CardTitle>Hot days</CardTitle>
            <CardDescription>
              number of days I played more than 50 games
            </CardDescription>
          </CardHeader>
          <CardContent>{gamesPerDay.length}</CardContent>
        </Card>
        <Chart chartData={gamesPerDay} />
      </div>
    </main>
  );
}
