import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { AppShell } from "@/demo/components/app-shell";
import { getDemoAccessFn } from "@/demo/server/functions";

export const Route = createFileRoute("/demo")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const pathname = location.pathname.replace(/\/$/, "") || "/";
    if (pathname !== "/demo" && !(await getDemoAccessFn())) {
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
