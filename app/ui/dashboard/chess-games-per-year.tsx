import { getYearlyGameCount } from "@/app/db/queries/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function GamesOverYears() {
  const playerName = "bodya17";
  const chess_games = await getYearlyGameCount(playerName);
  return (
    <Table>
      <TableHeader>
        <TableHead>year</TableHead>
        <TableHead>games</TableHead>
      </TableHeader>
      <TableBody>
        {chess_games.map(({ count, year }) => (
          <TableRow>
            <TableCell>{year}</TableCell>
            <TableCell>{count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>total</TableCell>
          <TableCell>
            {chess_games.reduce((total, { count }) => total + Number(count), 0)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
