import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/ModulePage";
export const Route = createFileRoute("/settings")({
  component: () => <ModulePage mode="/settings" />,
});
