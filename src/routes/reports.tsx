import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/common/ModulePage";
export const Route = createFileRoute("/reports")({
  component: () => <ModulePage mode="/reports" />,
});
