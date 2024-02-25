import SpecialityAnalysis from "@/components/diagnose/SpecialityAnalysis";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function QnAPage() {
  const userSession = await getServerSession();
  if (userSession == null) redirect("/");
  const email = userSession?.user?.email || "";

  return <SpecialityAnalysis email={email} />;
}
