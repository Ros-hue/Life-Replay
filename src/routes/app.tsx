import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/cosmic/AppShell";

export const Route = createFileRoute("/app")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/app" || location.pathname === "/app/") {
      throw redirect({ to: "/app/timeline" });
    }
  },
  component: AppShell,
});
