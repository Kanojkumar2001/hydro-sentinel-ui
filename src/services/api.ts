/**
 * API service layer.
 *
 * Mock reads remain local while prediction requests use the FastAPI service.
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

const API_BASE = (import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  riskScore?: number;
  reasons?: string[];
  anomaly?: { status: string; score: number };
}

export interface ImagePrediction {
  visualClass: "Clear" | "Slightly Turbid" | "Turbid" | "Muddy" | "Mixed / River Water" | "Inconclusive";
  confidence: number;
  probabilities: { label: string; value: number }[];
  visualRisk: RiskLevel;
  modelSource?: string;
  notice?: string;
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
    {
      name: "pH",
      value: input.ph,
      unit: "",
      ok: input.ph >= 6.5 && input.ph <= 8.5,
      hint: "Acceptable range 6.5 – 8.5",
    },
    {
      name: "Turbidity",
      value: input.turbidity,
      unit: "NTU",
      ok: input.turbidity <= 5,
      hint: "Should stay below 5 NTU",
    },
    {
      name: "TDS",
      value: input.tds,
      unit: "ppm",
      ok: input.tds <= 500,
      hint: "Should stay below 500 ppm",
    },
    {
      name: "Temperature",
      value: input.temperature,
      unit: "°C",
      ok: input.temperature >= 5 && input.temperature <= 30,
      hint: "Typical range 5 – 30 °C",
    },
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
  const response = await fetch(`${API_BASE}/api/ml/predict-water`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ph: input.ph,
      turbidity: input.turbidity,
      tds: input.tds,
      temperature: input.temperature,
    }),
  });
  if (!response.ok) throw new Error(await getApiError(response));
  return response.json() as Promise<NumericalPrediction>;
}

export async function analyzeImage(file: File): Promise<ImagePrediction> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${API_BASE}/api/ml/predict-image`, { method: "POST", body: form });
  if (!response.ok) throw new Error(await getApiError(response));
  return response.json() as Promise<ImagePrediction>;
}

export async function analyzeCombined(
  input: WaterInput,
  file: File | null,
): Promise<CombinedPrediction> {
  const form = new FormData();
  form.append("ph", String(input.ph));
  form.append("turbidity", String(input.turbidity));
  form.append("tds", String(input.tds));
  form.append("temperature", String(input.temperature));
  if (file) form.append("file", file);
  const response = await fetch(`${API_BASE}/api/ml/combined-analysis`, {
    method: "POST",
    body: form,
  });
  if (!response.ok) throw new Error(await getApiError(response));
  return response.json() as Promise<CombinedPrediction>;
}

async function getApiError(response: Response) {
  try {
    const body = (await response.json()) as { detail?: string };
    return body.detail ?? `API request failed (${response.status}).`;
  } catch {
    return `API request failed (${response.status}).`;
  }
}

export async function getRecommendations(status: WaterStatus = "UNSAFE") {
  await delay(300);
  return status === "SAFE" ? TREATMENT_STAGES.slice(3) : TREATMENT_STAGES;
}
