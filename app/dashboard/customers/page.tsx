import { getNotAnalyzedGameIds } from "@/app/db/queries/select";

export default async function Page() {
  const games = await getNotAnalyzedGameIds("bodya17");
  return (
    <p>
      {games.map((id) => (
        <>
          {id}
          <br />
        </>
      ))}
    </p>
  );
}
