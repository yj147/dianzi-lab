import Link from "next/link";

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          提交点子
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300 sm:text-lg">
          功能开发中...
        </p>
        <Link
          href="/"
          className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          返回首页
        </Link>
      </section>
    </main>
  );
}
