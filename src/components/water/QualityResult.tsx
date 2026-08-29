import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { RiskLevel, WaterStatus } from "@/data/mockData";
import type { NumericalPrediction } from "@/services/api";

export function RiskIndicator({
  status,
  risk,
  confidence,
}: {
  status: WaterStatus;
  risk: RiskLevel;
  confidence: number;
}) {
  const Icon =
    status === "SAFE"
      ? CheckCircle2
      : status === "NORMAL" || status === "MODERATE"
        ? AlertCircle
        : XCircle;
  const tone =
    status === "SAFE"
      ? "text-success"
      : status === "NORMAL"
        ? "text-info"
        : status === "MODERATE"
          ? "text-warning"
          : "text-destructive";

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-8 text-center">
      <Icon className={`size-14 ${tone}`} />
      <p className={`text-3xl font-bold tracking-tight ${tone}`}>{status}</p>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        <span>
          Risk level: <StatusBadge status={risk} />
        </span>
        <span>Confidence: {confidence}%</span>
      </div>
      <div className="w-full max-w-xs">
        <Progress value={confidence} />
      </div>
    </div>
  );
}

export function ParameterSummary({ prediction }: { prediction: NumericalPrediction }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameter summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {prediction.parameters.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.hint}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold tabular-nums">
                {p.value}
                {p.unit ? (
                  <span className="ml-1 text-xs text-muted-foreground">{p.unit}</span>
                ) : null}
              </span>
              {p.ok ? (
                <CheckCircle2 className="size-5 text-success" />
              ) : (
                <XCircle className="size-5 text-destructive" />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ExplanationChart({
  items,
}: {
  items: { feature: string; weight: number; level: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction explanation</CardTitle>
        <p className="text-sm text-muted-foreground">
          Relative contribution of each parameter to the model's decision.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.feature} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.feature}</span>
              <span className="text-muted-foreground">{item.level}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-hero"
                style={{ width: `${item.weight * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
