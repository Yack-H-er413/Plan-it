import { AppShell } from "@/components/layout/AppShell";

export default function Page({ params }: { params: { id: string } }) {
  return <AppShell workspaceId={params.id} />;
}
