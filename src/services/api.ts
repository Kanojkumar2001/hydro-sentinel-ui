/**
 * API service layer.
 *
 * Every function currently resolves mock data after a short delay so the UI
 * behaves like a real async client. When the FastAPI/ML backend exists, swap
 * the bodies for axios calls — component code does not need to change.
 */
import {
  DASHBOARD_STATS,
  FEATURE_IMPORTANCE,
  SAMPLES,
  TREATMENT_STAGES,
  type RiskLevel,
  type WaterSample,
  type WaterStatus,
} from "@/data/mockData";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface WaterInput {
  sampleId: string;
  location: string;
  ph: number;
  turbidity: number;
  tds: number;
  temperature: number;
}

export interface NumericalPrediction {
  status: WaterStatus;
  risk: RiskLevel;
  confidence: number;
  unsafeProbability: number;
  parameters: { name: string; value: number; unit: string; ok: boolean; hint: string }[];
  explanation: typeof FEATURE_IMPORTANCE;
}

export interface ImagePrediction {
  visualClass: "Clear" | "Turbid" | "Muddy";
  confidence: number;
  probabilities: { label: string; value: number }[];
  visualRisk: RiskLevel;
}

export interface CombinedPrediction {
  status: WaterStatus;
  risk: RiskLevel;
  confidence: number;
  numerical: NumericalPrediction;
  image: ImagePrediction;
  reasons: string[];
}

function evaluate(input: WaterInput): NumericalPrediction {
  const checks = [
    { name: "pH", value: input.ph, unit: "", ok: input.ph >= 6.5 && input.ph <= 8.5, hint: "Acceptable range 6.5 – 8.5" },
    { name: "Turbidity", value: input.turbidity, unit: "NTU", ok: input.turbidity <= 5, hint: "Should stay below 5 NTU" },
    { name: "TDS", value: input.tds, unit: "ppm", ok: input.tds <= 500, hint: "Should stay below 500 ppm" },
    { name: "Temperature", value: input.temperature, unit: "°C", ok: input.temperature >= 5 && input.temperature <= 30, hint: "Typical range 5 – 30 °C" },
  ];
  const failures = checks.filter((c) => !c.ok).length;
  const status: WaterStatus = failures === 0 ? "SAFE" : failures === 1 ? "MODERATE" : "UNSAFE";
  const risk: RiskLevel = failures === 0 ? "LOW" : failures === 1 ? "MEDIUM" : "HIGH";
  const unsafeProbability = Math.min(96, 8 + failures * 26);
  return {
    status,
    risk,
    confidence: Math.round((78 + failures * 4 + Math.random() * 6) * 10) / 10,
    unsafeProbability,
    parameters: checks,
    explanation: FEATURE_IMPORTANCE,
  };
}

export async function getDashboardStats() {
  await delay(400);
  return DASHBOARD_STATS;
}

export async function getHistory(): Promise<WaterSample[]> {
  await delay(400);
  return SAMPLES;
}

export async function getSampleDetails(id: string): Promise<WaterSample | undefined> {
  await delay(300);
  return SAMPLES.find((s) => s.id.toLowerCase() === id.toLowerCase());
}

export async function analyzeWater(input: WaterInput): Promise<NumericalPrediction> {
  await delay(1400);
  return evaluate(input);
}

export async function analyzeImage(file: File): Promise<ImagePrediction> {
  await delay(1800);
  const seeded = file.size % 3;
  const visualClass = (["Turbid", "Clear", "Muddy"] as const)[seeded];
  const probabilities =
    visualClass === "Clear"
      ? [
          { label: "Clear", value: 88 },
          { label: "Turbid", value: 9 },
          { label: "Muddy", value: 3 },
        ]
      : visualClass === "Turbid"
        ? [
            { label: "Clear", value: 7 },
            { label: "Turbid", value: 91 },
            { label: "Muddy", value: 2 },
          ]
        : [
            { label: "Clear", value: 3 },
            { label: "Turbid", value: 12 },
            { label: "Muddy", value: 85 },
          ];
  return {
    visualClass,
    confidence: probabilities.find((p) => p.label === visualClass)!.value,
    probabilities,
    visualRisk: visualClass === "Clear" ? "LOW" : visualClass === "Turbid" ? "HIGH" : "HIGH",
  };
}

export async function analyzeCombined(input: WaterInput, file: File | null): Promise<CombinedPrediction> {
  const numerical = await analyzeWater(input);
  const image = file
    ? await analyzeImage(file)
    : ({
        visualClass: "Clear",
        confidence: 62,
        probabilities: [
          { label: "Clear", value: 62 },
          { label: "Turbid", value: 30 },
          { label: "Muddy", value: 8 },
        ],
        visualRisk: "LOW",
      } as ImagePrediction);

  const unsafeScore = numerical.unsafeProbability * 0.6 + (image.visualClass === "Clear" ? 10 : 85) * 0.4;
  const status: WaterStatus = unsafeScore > 60 ? "UNSAFE" : unsafeScore > 35 ? "MODERATE" : "SAFE";
  const risk: RiskLevel = unsafeScore > 60 ? "HIGH" : unsafeScore > 35 ? "MEDIUM" : "LOW";

  const reasons = numerical.parameters
    .filter((p) => !p.ok)
    .map((p) => `${p.name} reading of ${p.value}${p.unit ? " " + p.unit : ""} is outside the acceptable range. ${p.hint}.`);
  if (image.visualClass !== "Clear") {
    reasons.push(`Visual model classified the sample as ${image.visualClass} with ${image.confidence}% confidence.`);
  }
  if (reasons.length === 0) reasons.push("All measured parameters and the visual assessment are within acceptable limits.");

  return {
    status,
    risk,
    confidence: Math.round(unsafeScore > 50 ? unsafeScore * 10 : (100 - unsafeScore) * 10) / 10,
    numerical,
    image,
    reasons,
  };
}

export async function getRecommendations(status: WaterStatus = "UNSAFE") {
  await delay(300);
  return status === "SAFE" ? TREATMENT_STAGES.slice(3) : TREATMENT_STAGES;
}
