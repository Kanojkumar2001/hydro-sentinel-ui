import { useState } from "react";
import { ArrowUpRight, BarChart3, CheckCircle2, FileDown, Info, Settings2, TrendingUp } from "lucide-react";
import { Layout, PageHeader } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WaterForm, EMPTY_FORM, type WaterFormValues } from "@/components/water/WaterForm";
import {
  ExplanationChart,
  ParameterSummary,
  RiskIndicator,
} from "@/components/water/QualityResult";
import { ImageUploader, useImageFile } from "@/components/image/ImageUploader";
import {
  LOCATION_QUALITY,
  PH_DISTRIBUTION,
  QUALITY_DISTRIBUTION,
  SAMPLES,
  TDS_DISTRIBUTION,
  TREATMENT_STAGES,
  TURBIDITY_DISTRIBUTION,
} from "@/data/mockData";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  analyzeCombined,
  analyzeImage,
  analyzeWater,
  type ImagePrediction,
  type NumericalPrediction,
} from "@/services/api";

const copy = {
  "/analytics": ["Analytics", "Track quality patterns across locations and parameters."],
  "/history": ["Analysis history", "Review recent field readings and model outcomes."],
  "/recommendations": [
    "Treatment recommendations",
    "Explore system-generated next steps for a sample.",
  ],
  "/reports": ["Reports", "Prepare a clear water-quality report for your next review."],
  "/settings": ["Settings", "Manage workspace preferences and alert behavior."],
  "/about": [
    "About AquaGuard AI",
    "Understand how this demonstration system supports water monitoring.",
  ],
} as const;

export function ModulePage({ mode }: { mode: "water" | "image" | "combined" | keyof typeof copy }) {
  const [values, setValues] = useState<WaterFormValues>({
    ...EMPTY_FORM,
    sampleId: "WS013",
    ph: "7.18",
    turbidity: "3.6",
    tds: "280",
    temperature: "21.4",
  });
  const [prediction, setPrediction] = useState<NumericalPrediction | null>(null);
  const [imagePrediction, setImagePrediction] = useState<ImagePrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const image = useImageFile();
  const isAnalysis = mode === "water" || mode === "combined";
  const heading =
    mode === "water"
      ? "Water analysis"
      : mode === "image"
        ? "Image analysis"
        : mode === "combined"
          ? "Combined analysis"
          : copy[mode][0];
  const description =
    mode === "water"
      ? "Enter field measurements to assess a water sample."
      : mode === "image"
        ? "Upload a sample image for a visual quality assessment."
        : mode === "combined"
          ? "Bring numerical readings and visual evidence together."
          : copy[mode][1];

  async function runWater(input: Parameters<typeof analyzeWater>[0]) {
    setLoading(true);
    setError(null);
    try {
      if (mode === "combined") {
        const result = await analyzeCombined(input, image.file);
        setPrediction(result.numerical);
        setImagePrediction(result.image.visualClass === "Not provided" ? null : result.image);
      } else {
        setPrediction(await analyzeWater(input));
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "The ML service is unavailable.");
    }
    setLoading(false);
  }

  async function runImage() {
    if (!image.file) return;
    setLoading(true);
    setError(null);
    try {
      setImagePrediction(await analyzeImage(image.file));
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "The CNN service is unavailable.");
    }
    setLoading(false);
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-[1500px] space-y-6">
        <PageHeader title={heading} description={description} />
        {error ? (
          <div className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        {isAnalysis ? (
          <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>
                  {mode === "combined" ? "Numerical data" : "Sample parameters"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Connected to the FastAPI tabular model.
                </p>
              </CardHeader>
              <CardContent>
                <WaterForm
                  values={values}
                  onChange={setValues}
                  onSubmit={runWater}
                  loading={loading}
                  submitLabel={mode === "combined" ? "Run combined analysis" : "Analyze water"}
                />
                {mode === "combined" ? (
                  <div className="mt-6 border-t border-border pt-6">
                    <p className="mb-3 text-sm font-semibold">
                      Water image{" "}
                      <span className="font-normal text-muted-foreground">(optional)</span>
                    </p>
                    <ImageUploader
                      {...image}
                      onSelect={image.select}
                      onClear={image.clear}
                      actions={
                        image.file ? (
                          <Button onClick={runImage} disabled={loading}>
                            {loading ? "Analysing..." : "Analyze image"}
                          </Button>
                        ) : undefined
                      }
                    />
                  </div>
                ) : null}
              </CardContent>
            </Card>
            {prediction ? (
              <div className="space-y-6">
                <RiskIndicator
                  status={prediction.status}
                  risk={prediction.risk}
                  confidence={prediction.confidence}
                />
                <ParameterSummary prediction={prediction} />
                <ExplanationChart items={prediction.explanation} />
              </div>
            ) : (
              <Card className="flex min-h-[320px] items-center justify-center border-dashed">
                <CardContent className="max-w-sm text-center">
                  <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <CheckCircle2 />
                  </span>
                  <h3 className="mt-4 font-semibold">Your result will appear here</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Submit the sample parameters to see a status, risk level, and explainable
                    summary.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : mode === "image" ? (
          <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
            <Card>
              <CardHeader>
                <CardTitle>Upload sample image</CardTitle>
                <p className="text-sm text-muted-foreground">JPG, PNG, or WEBP up to 5 MB.</p>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  {...image}
                  onSelect={image.select}
                  onClear={image.clear}
                  actions={
                    image.file ? (
                      <Button onClick={runImage} disabled={loading}>
                        {loading ? "Analysing..." : "Analyze image"}
                      </Button>
                    ) : undefined
                  }
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Visual result</CardTitle>
              </CardHeader>
              <CardContent>
                {imagePrediction ? (
                  <div className="space-y-5">
                    <div className="rounded-2xl bg-muted p-6 text-center">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Classification
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-primary">
                        {imagePrediction.visualClass}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Confidence {imagePrediction.confidence}%
                      </p>
                      {imagePrediction.modelSource ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Source: {imagePrediction.modelSource}
                        </p>
                      ) : null}
                    </div>
                    {imagePrediction.notice ? (
                      <p className="rounded-xl border border-warning/25 bg-warning/10 p-3 text-xs leading-5 text-warning-foreground">
                        {imagePrediction.notice}
                      </p>
                    ) : null}
                    {imagePrediction.probabilities.map((item) => (
                      <div key={item.label} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.label}</span>
                          <span className="font-semibold">{item.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-hero"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-12 text-center text-sm leading-6 text-muted-foreground">
                    Upload an image to see the visual model estimate.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <ContentModule mode={mode} />
        )}
      </div>
    </Layout>
  );
}

function ContentModule({ mode }: { mode: keyof typeof copy }) {
  if (mode === "/analytics") return <AnalyticsModule />;
  if (mode === "/reports") return <ReportsModule />;
  if (mode === "/history")
    return (
      <Card>
        <CardHeader>
          <CardTitle>All samples</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-y bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  {["Sample", "Location", "pH", "TDS", "Turbidity", "Status"].map((h) => (
                    <th key={h} className="px-6 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {SAMPLES.map((sample) => (
                  <tr key={sample.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-semibold text-primary">{sample.id}</td>
                    <td className="px-6 py-4">{sample.location}</td>
                    <td className="px-6 py-4">{sample.ph}</td>
                    <td className="px-6 py-4">{sample.tds}</td>
                    <td className="px-6 py-4">{sample.turbidity}</td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          sample.status === "SAFE"
                            ? "font-semibold text-success"
                            : "font-semibold text-destructive"
                        }
                      >
                        {sample.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  if (mode === "/recommendations")
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TREATMENT_STAGES.map((stage) => (
          <Card key={stage.step}>
            <CardContent className="p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                0{stage.step}
              </span>
              <h3 className="mt-5 font-semibold">{stage.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{stage.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  if (mode === "/about")
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <InfoCard
          icon={Info}
          title="The purpose"
          text="AquaGuard AI brings water measurements and visual context into one calm workspace for demonstration and future ML integration."
        />
        <InfoCard
          icon={BarChart3}
          title="How it works"
          text="Enter parameters, upload imagery, review a model estimate, and use the explanation and recommendations to guide the next field action."
        />
        <InfoCard
          icon={Settings2}
          title="Technology"
          text="Built with React, TanStack Router, Tailwind CSS, Recharts, Lucide, and an API-ready service layer."
        />
        <InfoCard
          icon={CheckCircle2}
          title="Important limitation"
          text="Results are estimates for demonstration only. Laboratory testing remains essential before making health or treatment decisions."
        />
      </div>
    );
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <InfoCard
        icon={BarChart3}
        title="Alert preferences"
        text={
          "Unsafe water and high-risk alerts are enabled for this demonstration workspace."
        }
      />
      <Card>
        <CardContent className="flex min-h-48 flex-col justify-between p-6">
          <div>
            <p className="text-sm font-semibold">Next step</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This module is wired to the shared shell and mock service layer, so backend data can
              replace the placeholder response later.
            </p>
          </div>
          <Button variant="outline" className="mt-6 w-fit" asChild>
            <a href="/combined-analysis">
              Open combined analysis <ArrowUpRight />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsModule() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricTile label="Samples analysed" value="1,250" detail="Across 6 monitored locations" icon={BarChart3} />
        <MetricTile label="Safe water rate" value="65.6%" detail="820 samples within range" icon={CheckCircle2} tone="text-success" />
        <MetricTile label="High-risk trend" value="14.5%" detail="182 samples need review" icon={TrendingUp} tone="text-warning" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader><CardTitle>Quality distribution</CardTitle><p className="text-sm text-muted-foreground">Current classification across monitored samples.</p></CardHeader>
          <CardContent className="grid items-center gap-4 sm:grid-cols-[1fr_0.8fr]">
            <div className="h-64"><ResponsiveContainer><PieChart><Pie data={QUALITY_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={68} outerRadius={96} paddingAngle={3} stroke="none">{QUALITY_DISTRIBUTION.map((item) => <Cell key={item.name} fill={item.name === "Safe" ? "var(--color-success)" : item.name === "Moderate" ? "var(--color-warning)" : "var(--color-destructive)"} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
            <div className="space-y-4">{QUALITY_DISTRIBUTION.map((item) => <div key={item.name} className="flex items-center justify-between border-b pb-3 text-sm"><span className="flex items-center gap-2"><span className={`size-2 rounded-full ${item.name === "Safe" ? "bg-success" : item.name === "Moderate" ? "bg-warning" : "bg-destructive"}`} />{item.name}</span><strong>{item.value}</strong></div>)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Location risk profile</CardTitle><p className="text-sm text-muted-foreground">Safe and unsafe results by source.</p></CardHeader>
          <CardContent><div className="h-64"><ResponsiveContainer><BarChart data={LOCATION_QUALITY} layout="vertical" margin={{ left: 8, right: 8 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" hide /><YAxis dataKey="location" type="category" width={76} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="safe" stackId="quality" fill="var(--color-success)" radius={[4, 0, 0, 4]} /><Bar dataKey="unsafe" stackId="quality" fill="var(--color-destructive)" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div></CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <DistributionCard title="pH range" data={PH_DISTRIBUTION} />
        <DistributionCard title="TDS range" data={TDS_DISTRIBUTION} />
        <DistributionCard title="Turbidity range" data={TURBIDITY_DISTRIBUTION} />
      </div>
    </div>
  );
}

function DistributionCard({ title, data }: { title: string; data: { range: string; count: number }[] }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><div className="h-52"><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="range" tick={{ fontSize: 10 }} /><YAxis hide /><Tooltip /><Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></CardContent></Card>;
}

function MetricTile({ label, value, detail, icon: Icon, tone = "text-primary" }: { label: string; value: string; detail: string; icon: typeof BarChart3; tone?: string }) {
  return <Card><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p></div><Icon className={`size-5 ${tone}`} /></div><p className="mt-3 text-xs text-muted-foreground">{detail}</p></CardContent></Card>;
}

function ReportsModule() {
  const [selectedId, setSelectedId] = useState(SAMPLES[1].id);
  const sample = SAMPLES.find((item) => item.id === selectedId) ?? SAMPLES[1];
  return <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
    <Card className="h-fit border-primary/20 bg-primary/[0.03]"><CardHeader><CardTitle>Build a report</CardTitle><p className="text-sm text-muted-foreground">Select a completed analysis to prepare a review-ready summary.</p></CardHeader><CardContent className="space-y-5"><label className="block text-sm font-medium">Sample<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{SAMPLES.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.location}</option>)}</select></label><Button className="w-full" onClick={() => window.print()}><FileDown /> Export report</Button><p className="text-xs leading-5 text-muted-foreground">The browser print dialog can save this report as PDF. Results remain model estimates and require laboratory confirmation.</p></CardContent></Card>
    <Card><CardHeader className="border-b"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">AquaGuard AI</p><CardTitle className="mt-2 text-2xl">Water quality report</CardTitle><p className="mt-1 text-sm text-muted-foreground">Prepared {sample.date}</p></div><span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">{sample.status}</span></div></CardHeader><CardContent className="space-y-6 p-6"><div><p className="text-xs uppercase tracking-widest text-muted-foreground">Sample</p><p className="mt-1 text-lg font-semibold">{sample.id} · {sample.location}</p></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[["pH", sample.ph], ["TDS", `${sample.tds} ppm`], ["Turbidity", `${sample.turbidity} NTU`], ["Temperature", `${sample.temperature} °C`]].map(([label, value]) => <div key={label} className="rounded-lg border bg-muted/30 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 font-semibold">{value}</p></div>)}</div><div className="border-t pt-5"><p className="text-sm font-semibold">Assessment</p><p className="mt-2 text-sm leading-6 text-muted-foreground">This sample is marked {sample.status.toLowerCase()} with {sample.risk.toLowerCase()} risk and model confidence of {sample.confidence}%. Recommended treatment should be reviewed by a qualified professional.</p></div></CardContent></Card>
  </div>;
}

function InfoCard({ icon: Icon, title, text }: { icon: typeof Info; title: string; text: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <Icon className="size-5 text-primary" />
        <h3 className="mt-5 font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
