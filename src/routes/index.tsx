import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Beaker,
  ChevronDown,
  Droplets,
  FlaskConical,
  Image as ImageIcon,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Waves,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Layout, PageHeader } from "@/components/layout/Layout";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DASHBOARD_STATS,
  QUALITY_DISTRIBUTION,
  SAMPLES,
  TRENDS,
} from "@/data/mockData";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [trend, setTrend] = useState<keyof (typeof TRENDS)[number]>("ph");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SAFE" | "UNSAFE">("ALL");
  const filteredSamples = SAMPLES.filter(
    (sample) => statusFilter === "ALL" || sample.status === statusFilter,
  ).slice(0, 5);

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1500px] space-y-6">
        <PageHeader
          title="Dashboard"
          description="A clear view of your water-quality program, updated 26 Aug 2026."
          action={
            <Button asChild className="rounded-xl px-5">
              <a href="/water-analysis"><Plus /> New analysis</a>
            </Button>
          }
        />

        <section className="relative overflow-hidden rounded-2xl bg-hero p-6 text-primary-foreground shadow-elevated sm:p-8">
          <div className="absolute -right-8 -top-12 size-56 rounded-full border-[24px] border-primary-foreground/10" />
          <div className="absolute bottom-[-72px] right-32 size-48 rounded-full border-[18px] border-primary-foreground/10" />
          <div className="relative max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary-foreground/75">
              <Sparkles className="size-4" /> Overview at a glance
            </div>
            <h2 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Keep every sample moving toward safer water.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/75">
              AquaGuard combines field measurements and visual signals so your team can spot risk early and act with confidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="rounded-xl">
                <a href="/combined-analysis"><FlaskConical /> Run combined analysis</a>
              </Button>
              <Button asChild variant="ghost" className="rounded-xl text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <a href="/reports">View latest report <ArrowUpRight /></a>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total samples" value={DASHBOARD_STATS.totalSamples.toLocaleString()} change={`+${DASHBOARD_STATS.totalChange}%`} detail="vs. last month" icon={Droplets} tone="primary" />
          <StatCard label="Safe samples" value={DASHBOARD_STATS.safeSamples.toLocaleString()} change={`${DASHBOARD_STATS.safePct}%`} detail="of total samples" icon={ShieldCheck} tone="success" />
          <StatCard label="Unsafe samples" value={DASHBOARD_STATS.unsafeSamples.toLocaleString()} change={`${DASHBOARD_STATS.unsafePct}%`} detail="need attention" icon={Waves} tone="danger" />
          <StatCard label="High risk" value={DASHBOARD_STATS.highRisk.toLocaleString()} change={`${DASHBOARD_STATS.highRiskPct}%`} detail="of all samples" icon={TrendingUp} tone="warning" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Card className="border-border/70 shadow-card">
            <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">Parameter trends</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Monthly averages across monitored locations</p>
              </div>
              <div className="flex rounded-lg bg-muted p-1">
                {(["ph", "tds", "turbidity", "temperature"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTrend(key)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-semibold capitalize transition-colors ${trend === key ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {key === "ph" ? "pH" : key}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TRENDS} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="4 4" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", boxShadow: "var(--shadow-card)" }} />
                    <Area type="monotone" dataKey={trend} stroke="var(--color-primary)" strokeWidth={3} fill="url(#trendFill)" activeDot={{ r: 5, fill: "var(--color-primary)" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quality mix</CardTitle>
              <p className="text-sm text-muted-foreground">Current sample classification</p>
            </CardHeader>
            <CardContent>
              <div className="relative mx-auto h-[190px] max-w-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={QUALITY_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={3} stroke="none">
                      {QUALITY_DISTRIBUTION.map((entry) => <Cell key={entry.name} fill={entry.name === "Safe" ? "var(--color-success)" : entry.name === "Moderate" ? "var(--color-warning)" : "var(--color-destructive)"} />)}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Samples"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold">66%</span>
                  <span className="text-xs text-muted-foreground">safe</span>
                </div>
              </div>
              <div className="mt-1 grid grid-cols-3 gap-2 text-center">
                {QUALITY_DISTRIBUTION.map((item) => <div key={item.name}><div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><span className={`size-2 rounded-full ${item.name === "Safe" ? "bg-success" : item.name === "Moderate" ? "bg-warning" : "bg-destructive"}`} />{item.name}</div><p className="mt-1 text-lg font-semibold">{item.value}</p></div>)}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <Card className="border-border/70 shadow-card">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <div><CardTitle className="text-lg">Recent samples</CardTitle><p className="mt-1 text-sm text-muted-foreground">The latest field readings in your workspace</p></div>
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-lg border border-input px-3 py-1.5 sm:flex"><Search className="size-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">Search samples</span></div>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-medium"><option value="ALL">All status</option><option value="SAFE">Safe</option><option value="UNSAFE">Unsafe</option></select>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="border-y border-border/70 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-6 py-3 font-medium">Sample</th><th className="px-4 py-3 font-medium">Location</th><th className="px-4 py-3 font-medium">pH</th><th className="px-4 py-3 font-medium">TDS</th><th className="px-4 py-3 font-medium">Turbidity</th><th className="px-6 py-3 font-medium">Status</th></tr></thead><tbody className="divide-y divide-border/60">{filteredSamples.map((sample) => <tr key={sample.id} className="transition-colors hover:bg-muted/30"><td className="px-6 py-4 font-semibold text-primary">{sample.id}</td><td className="px-4 py-4 text-muted-foreground">{sample.location}</td><td className="px-4 py-4 font-medium">{sample.ph}</td><td className="px-4 py-4 text-muted-foreground">{sample.tds}</td><td className="px-4 py-4 text-muted-foreground">{sample.turbidity}</td><td className="px-6 py-4"><StatusBadge status={sample.status} /></td></tr>)}</tbody></table></div>
              <div className="flex justify-end border-t border-border/60 px-6 py-3"><a href="/history" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">View all samples <ArrowUpRight className="size-4" /></a></div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-[color-mix(in_oklab,var(--color-accent)_8%,var(--color-card))] shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Quick actions</CardTitle><p className="text-sm text-muted-foreground">Start with the data you have.</p></CardHeader>
            <CardContent className="space-y-3">
              <QuickAction href="/water-analysis" icon={FlaskConical} title="Analyze water" description="Enter field parameters" />
              <QuickAction href="/image-analysis" icon={ImageIcon} title="Upload image" description="Check visual quality" />
              <QuickAction href="/recommendations" icon={Beaker} title="Review treatments" description="Explore system recommendations" />
              <div className="mt-5 rounded-xl border border-warning/25 bg-warning/10 p-3 text-xs leading-5 text-warning-foreground"><strong>Model note:</strong> Predictions are estimates for demonstration and do not replace laboratory testing.</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, change, detail, icon: Icon, tone }: { label: string; value: string; change: string; detail: string; icon: typeof Droplets; tone: "primary" | "success" | "danger" | "warning" }) {
  const tones = { primary: "bg-primary/10 text-primary", success: "bg-success/12 text-success", danger: "bg-destructive/10 text-destructive", warning: "bg-warning/15 text-warning-foreground" };
  return <Card className="border-border/70 shadow-card"><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p></div><span className={`flex size-10 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="size-5" /></span></div><div className="mt-4 flex items-center gap-2 text-xs"><span className="font-semibold text-success">{change}</span><span className="text-muted-foreground">{detail}</span></div></CardContent></Card>;
}

function QuickAction({ href, icon: Icon, title, description }: { href: string; icon: typeof FlaskConical; title: string; description: string }) {
  return <a href={href} className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card/70 p-3 transition-colors hover:border-primary/40 hover:bg-card"><span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{title}</span><span className="block text-xs text-muted-foreground">{description}</span></span><ChevronDown className="size-4 -rotate-90 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></a>;
}
