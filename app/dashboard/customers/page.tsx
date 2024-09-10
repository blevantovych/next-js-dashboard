import { fetchRevenue } from "@/app/lib/data";

export default async function Page() {
  await fetchRevenue();
  return <p>Customers Page</p>;
}
