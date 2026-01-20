import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero />

      <section
        id="tools"
        className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-4 px-6 py-24 text-center"
      >
        <h2 className="text-3xl font-bold">浏览工具</h2>
        <p className="text-base text-gray-600 dark:text-gray-300">
          工具区域（#22 实现）
        </p>
      </section>
    </main>
  );
}
