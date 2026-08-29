import { useState } from "react";
import { Bell, Menu, Droplets } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarContent } from "./Sidebar";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function Header({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:px-8 lg:py-5">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-sidebar-border p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2 lg:hidden">
        <Droplets className="size-5 text-primary" />
        <span className="font-semibold">AquaGuard AI</span>
      </div>

      <div className="hidden min-w-0 flex-1 lg:block">
        <h1 className="truncate text-xl font-semibold tracking-tight">
          {title ?? `${greeting()}, Admin`}
        </h1>
        <p className="truncate text-sm text-muted-foreground">
          {subtitle ?? "Monitor and analyse water quality intelligently"}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative"
            onClick={() => setNotificationsOpen((value) => !value)}
          >
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
          </Button>
          {notificationsOpen ? (
            <div className="absolute right-0 top-12 z-50 w-72 rounded-xl border border-border bg-card p-4 shadow-elevated">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Notifications</p>
                <span className="rounded-full bg-destructive/10 px-2 py-1 text-[10px] font-semibold text-destructive">1 new</span>
              </div>
              <div className="mt-3 rounded-lg bg-warning/10 p-3 text-xs leading-5 text-warning-foreground">
                <strong>High-risk sample detected.</strong> Review WS002 from Pond-Sample in analysis history.
              </div>
              <a href="/history" onClick={() => setNotificationsOpen(false)} className="mt-3 inline-flex text-xs font-semibold text-primary hover:underline">
                Open history
              </a>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-hero text-xs font-semibold text-primary-foreground">
            K
          </span>
          <span className="hidden text-sm font-medium sm:inline">Kanoj</span>
        </div>
      </div>
    </header>
  );
}
