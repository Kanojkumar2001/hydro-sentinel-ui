import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/ModulePage";
export const Route = createFileRoute("/combined-analysis")({
  component: () => <ModulePage mode="combined" />,
});
