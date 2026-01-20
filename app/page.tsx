import Hero from "@/components/Hero";
import IdeaCard from "@/components/IdeaCard";
import { prisma } from "@/lib/db";

async function getCompletedIdeas() {
  return prisma.idea.findMany({
    where: { status: "COMPLETED", isDeleted: false },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, description: true, tags: true },
  });
}

export default async function Home() {
  const ideas = await getCompletedIdeas();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />

      <section id="tools" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-12 text-center text-3xl font-bold">已完成的工具</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </section>
    </main>
  );
}
