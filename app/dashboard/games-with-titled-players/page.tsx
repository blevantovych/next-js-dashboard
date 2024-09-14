import { fetchGamesWithTitledPlayers } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Page() {
  const results = await fetchGamesWithTitledPlayers(
    "bodya17",
    "Rated bullet game"
  );
  const data = results.rows;

  const getNetWinsClass = (netWinsNumber: number) => {
    if (netWinsNumber > 0) {
      return "text-green-600 font-semibold";
    } else if (netWinsNumber < 0) {
      return "text-red-600 font-semibold";
    } else {
      return "font-semibold";
    }
  };

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
                <span className={getNetWinsClass(item.net_wins)}>
                  {item.net_wins}
                </span>
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

        {/* Table view for larger devices */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opponent Title</TableHead>
                <TableHead>Average Opponent Rating</TableHead>
                <TableHead>Games Played</TableHead>
                <TableHead>Wins</TableHead>
                <TableHead>Losses</TableHead>
                <TableHead>Draws</TableHead>
                <TableHead>Net Wins</TableHead>
                <TableHead>Win %</TableHead>
                <TableHead>Points %</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.opponent_title || "No Title"}</TableCell>
                  <TableCell>{row.average_opponent_rating}</TableCell>
                  <TableCell>{row.games_played}</TableCell>
                  <TableCell>{row.wins}</TableCell>
                  <TableCell>{row.losses}</TableCell>
                  <TableCell>{row.draws}</TableCell>
                  <TableCell className={getNetWinsClass(row.net_wins)}>
                    {row.net_wins}
                  </TableCell>
                  <TableCell>{row.win_percentage}%</TableCell>
                  <TableCell>{row.points_percentage}%</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </main>
  );
}
