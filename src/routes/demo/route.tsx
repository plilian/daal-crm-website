import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { AppShell } from "@/demo/components/app-shell";
import { getDemoAccessFn } from "@/demo/server/functions";

export const Route = createFileRoute("/demo")({
  ssr: false,
  beforeLoad: async ({ location, context }) => {
    const pathname = location.pathname.replace(/\/$/, "") || "/";
    if (pathname === "/demo") return;

    const hasAccess = await context.queryClient.ensureQueryData({
      queryKey: ["demo-access"],
      queryFn: getDemoAccessFn,
      staleTime: 2 * 60_000,
    });

    if (!hasAccess) {
      throw redirect({ to: "/demo" });
    }
  },
  component: DemoLayout,
});

function DemoLayout() {
  const pathname = useLocation({ select: (location) => location.pathname.replace(/\/$/, "") });
  const isGate = pathname === "/demo";

  if (isGate) return <Outlet />;

  return (
    <AppShell databaseConfigured demoMode>
      <Outlet />
    </AppShell>
  );
}
