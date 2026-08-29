import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/ModulePage";
export const Route = createFileRoute("/analytics")({
  component: () => <ModulePage mode="/analytics" />,
});
