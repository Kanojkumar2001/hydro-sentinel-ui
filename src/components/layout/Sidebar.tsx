import { Link } from "@tanstack/react-router";
import {
  Droplets,
  LayoutDashboard,
  FlaskConical,
  Image as ImageIcon,
  Microscope,
  BarChart3,
  ClipboardList,
  Beaker,
  FileText,
  Settings,
  Info,
} from "lucide-react";

export const NAV_MAIN = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/water-analysis", label: "Water Analysis", icon: FlaskConical },
  { to: "/image-analysis", label: "Image Analysis", icon: ImageIcon },
  { to: "/combined-analysis", label: "Combined Analysis", icon: Microscope },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/history", label: "History", icon: ClipboardList },
  { to: "/recommendations", label: "Recommendations", icon: Beaker },
  { to: "/reports", label: "Reports", icon: FileText },
] as const;

export const NAV_FOOTER = [
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/about", label: "About", icon: Info },
] as const;

function NavItem({
  to,
  label,
  icon: Icon,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: typeof Droplets;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      activeOptions={{ exact: to === "/" }}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      activeProps={{
        className:
          "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_3px_0_0_0_var(--sidebar-primary)]",
      }}
    >
      <Icon className="size-4.5 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Droplets className="size-5" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
            AquaGuard AI
          </span>
          <span className="text-xs text-sidebar-foreground/60">Water intelligence</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV_MAIN.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
        <div className="my-3 border-t border-sidebar-border" />
        {NAV_FOOTER.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="m-3 rounded-xl bg-sidebar-accent/60 p-3 text-xs text-sidebar-foreground/70">
        Predictions shown are model estimates for demonstration and are not a substitute for
        laboratory testing.
      </div>
    </div>
  );
}
