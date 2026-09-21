import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GicaBooks — sua estante de leituras" },
      {
        name: "description",
        content:
          "Guarde os livros que está lendo, marque seu progresso e descubra a próxima leitura pelas mãos de quem também lê.",
      },
      { property: "og:title", content: "GicaBooks — sua estante de leituras" },
      {
        property: "og:description",
        content:
          "Guarde os livros que está lendo, marque seu progresso e descubra a próxima leitura pelas mãos de quem também lê.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/gicabooks.html"
      title="GicaBooks"
      className="h-screen w-screen border-0"
    />
  );
}
