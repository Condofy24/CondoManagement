export default async function PropertyPage({
  params,
}: {
  params: { id: string };
}) {
  return <div>{params.id}</div>;
}
