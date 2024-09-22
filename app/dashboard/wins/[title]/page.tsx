export default async function Page({ params }: { params: { title: string } }) {
  return <h1>Wins with {params.title}</h1>;
}
