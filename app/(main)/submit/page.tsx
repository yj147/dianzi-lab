import Link from "next/link";
import { getSession } from "@/lib/auth";
import SubmitForm from "./SubmitForm";

export default async function SubmitPage() {
  const session = await getSession();

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full flex justify-center">
        {session ? (
          <SubmitForm />
        ) : (
          <div className="w-full max-w-md bg-white/20 backdrop-blur-xl rounded-xl shadow-2xl p-8 ring-1 ring-white/30 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              登录后即可提交点子
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              分享你的创意，让大家一起完善它
            </p>
            <Link
              href="/login?callbackUrl=/submit"
              className="inline-block w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all"
            >
              立即登录
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
