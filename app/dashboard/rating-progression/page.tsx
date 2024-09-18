import { lusitana } from "@/app/ui/fonts";
import { RatingChart } from "./rating-chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDailyRatings } from "@/app/db/queries/select";

export default async function Page() {
  const playerName = "bodya17";
  const event = "Rated blitz game";
  const ratingChange = await getDailyRatings(playerName, event);

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Rating change
      </h1>

      <RatingChart chartData={ratingChange} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratingChange.map(({ date, rating }) => (
            <TableRow>
              <TableCell>{date}</TableCell>
              <TableCell>{rating}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
