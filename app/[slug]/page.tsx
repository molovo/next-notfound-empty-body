import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ slug: "known" }];
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;

  if (slug !== "known") {
    notFound();
  }

  return <h1>Known page</h1>;
}
