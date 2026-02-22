import { AuthScreen } from "@/components/auth/AuthScreen";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session) redirect("/workspaces");
  return <AuthScreen mode="login" />;
}
