import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "登录 | 点子 Lab",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20 px-4 py-20">
      <LoginForm />
    </main>
  );
}