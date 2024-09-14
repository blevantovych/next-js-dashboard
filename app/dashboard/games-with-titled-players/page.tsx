import { fetchGamesWithTitledPlayers } from "@/app/lib/data";
import { lusitana } from "@/app/ui/fonts";

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
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b-2 text-left">
                  Opponent Title
                </th>
                <th className="px-4 py-2 border-b-2 text-right">
                  Average Opponent Rating
                </th>
                <th className="px-4 py-2 border-b-2 text-right">
                  Games Played
                </th>
                <th className="px-4 py-2 border-b-2 text-right">Wins</th>
                <th className="px-4 py-2 border-b-2 text-right">Losses</th>
                <th className="px-4 py-2 border-b-2 text-right">Draws</th>
                <th className="px-4 py-2 border-b-2 text-right">Net Wins</th>
                <th className="px-4 py-2 border-b-2 text-right">Win %</th>
                <th className="px-4 py-2 border-b-2 text-right">Points %</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2 border-b text-left">
                    {row.opponent_title || "No Title"}
                  </td>
                  <td className="px-4 py-2 border-b text-right">
                    {row.average_opponent_rating}
                  </td>
                  <td className="px-4 py-2 border-b text-right">
                    {row.games_played}
                  </td>
                  <td className="px-4 py-2 border-b text-right">{row.wins}</td>
                  <td className="px-4 py-2 border-b text-right">
                    {row.losses}
                  </td>
                  <td className="px-4 py-2 border-b text-right">{row.draws}</td>
                  <td
                    className={`px-4 py-2 border-b text-right ${getNetWinsClass(row.net_wins)}`}
                  >
                    {row.net_wins}
                  </td>
                  <td className="px-4 py-2 border-b text-right">
                    {row.win_percentage}%
                  </td>
                  <td className="px-4 py-2 border-b text-right">
                    {row.points_percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
