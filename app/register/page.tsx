import { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "注册 | 点子 Lab",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20 px-4 py-20">
      <RegisterForm />
    </main>
  );
}
