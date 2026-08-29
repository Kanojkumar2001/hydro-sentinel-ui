import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/ModulePage";
export const Route = createFileRoute("/image-analysis")({
  component: () => <ModulePage mode="image" />,
});
