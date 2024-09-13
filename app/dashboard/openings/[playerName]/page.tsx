import { lusitana } from "@/app/ui/fonts";
import { fetchOpenings } from "@/app/lib/data";

export default async function Page({
  params,
}: {
  params: { playerName: string };
}) {
  const openings = await fetchOpenings(params.playerName);

  return (
    <main className="p-6 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6">
        <h1
          className={`${lusitana.className} mb-6 text-2xl md:text-3xl font-semibold text-gray-800`}
        >
          Popular Openings
        </h1>
        <ul className="space-y-4">
          {openings.rows.map(({ opening, count }) => (
            <li
              key={opening}
              className="flex justify-between items-center bg-gray-50 p-4 m-4 rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              <span className="text-lg font-medium text-gray-700">
                {opening}
              </span>
              <span className="text-sm text-gray-500">Count: {count}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
