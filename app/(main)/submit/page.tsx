import Link from "next/link";
import { getSession } from "@/lib/auth";
import SubmitForm from "./SubmitForm";

export default async function SubmitPage() {
  const session = await getSession();

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px] animate-float-slow opacity-60" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-purple-400/10 blur-[120px] animate-float-slower opacity-50" />
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
              className="inline-block w-full rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 py-3 text-white font-semibold shadow-lg transition-[transform,box-shadow] hover:from-purple-700 hover:to-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              立即登录
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
