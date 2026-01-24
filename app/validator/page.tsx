import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ValidatorClient from "./ValidatorClient";

export default async function ValidatorPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?callbackUrl=/validator");
  }
  return <ValidatorClient />;
}
