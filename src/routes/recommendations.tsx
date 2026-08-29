import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/ModulePage";
export const Route = createFileRoute("/recommendations")({
  component: () => <ModulePage mode="/recommendations" />,
});
