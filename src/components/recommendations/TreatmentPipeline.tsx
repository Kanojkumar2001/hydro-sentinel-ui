import { ArrowDown, Beaker, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TREATMENT_STAGES, type TreatmentStage } from "@/data/mockData";

export function TreatmentCard({ stages = TREATMENT_STAGES }: { stages?: TreatmentStage[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="size-5 text-accent" /> Recommended treatment
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on the detected water-quality conditions, the suggested treatment stages are:
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map((stage) => (
          <div
            key={stage.step}
            className="flex gap-4 rounded-xl border border-border bg-background/60 p-4"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-hero text-sm font-semibold text-primary-foreground">
              {stage.step}
            </span>
            <div>
              <p className="font-medium">{stage.title}</p>
              <p className="text-sm text-muted-foreground">{stage.description}</p>
            </div>
          </div>
        ))}
        <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <ShieldAlert className="size-5 shrink-0 text-warning" />
          <p className="text-foreground/80">
            These are system recommendations only. They do not prove the treated water is safe —
            always confirm with certified laboratory testing before consumption.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TreatmentPipeline({ stages = TREATMENT_STAGES }: { stages?: TreatmentStage[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purification process</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-2">
          <span className="rounded-full border border-border bg-muted px-4 py-1.5 text-sm font-medium">
            Raw water
          </span>
          {stages.map((stage) => (
            <div key={stage.step} className="flex w-full flex-col items-center gap-2">
              <ArrowDown className="size-4 text-accent" />
              <div className="w-full max-w-xs rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-center">
                <p className="text-sm font-semibold">{stage.title}</p>
              </div>
            </div>
          ))}
          <ArrowDown className="size-4 text-accent" />
          <span className="rounded-full bg-success/15 px-4 py-1.5 text-sm font-semibold text-success">
            Treated water
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
