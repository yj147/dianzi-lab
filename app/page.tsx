export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-24">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          点子 Lab
        </h1>
        <p className="text-balance text-base text-gray-600 dark:text-gray-300 sm:text-lg">
          创意点子发现平台：收集、整理并发现灵感。
        </p>
      </section>
    </main>
  );
}
