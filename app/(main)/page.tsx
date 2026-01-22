import Hero from '@/components/Hero'
import IdeaCard from "@/components/IdeaCard";
import EmptyState from '@/components/EmptyState'
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
    <main className="min-h-dvh text-slate-700">
      <Hero />

      <section id="tools" className="bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div className="min-w-0">
              <h2 className="text-4xl font-bold text-slate-900">已完成的工具</h2>
              <p className="mt-2 text-slate-600">这些点子已经被赋予生命。</p>
            </div>
          </div>

          {ideas.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          ) : (
            <EmptyState message="暂无已完成的工具，敬请期待！" />
          )}
        </div>
      </section>
    </main>
  );
}
