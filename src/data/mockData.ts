export type WaterStatus = "SAFE" | "NORMAL" | "MODERATE" | "UNSAFE";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface WaterSample {
  id: string;
  location: string;
  ph: number;
  tds: number;
  turbidity: number;
  temperature: number;
  status: WaterStatus;
  risk: RiskLevel;
  confidence: number;
  date: string;
  visualClass: "Clear" | "Turbid" | "Muddy";
}

export const LOCATIONS = [
  "Tap-Water-2",
  "Pond-Sample",
  "Lake-Sample",
  "River-Sample",
  "Borewell-1",
  "Industrial-Zone",
];

function makeSample(
  id: string,
  location: string,
  ph: number,
  tds: number,
  turbidity: number,
  temperature: number,
  status: WaterStatus,
  risk: RiskLevel,
  confidence: number,
  date: string,
  visualClass: WaterSample["visualClass"],
): WaterSample {
  return {
    id,
    location,
    ph,
    tds,
    turbidity,
    temperature,
    status,
    risk,
    confidence,
    date,
    visualClass,
  };
}

export const SAMPLES: WaterSample[] = [
  makeSample(
    "WS001",
    "Tap-Water-2",
    7.42,
    250.6,
    3.19,
    19.2,
    "SAFE",
    "LOW",
    96.1,
    "2026-08-26",
    "Clear",
  ),
  makeSample(
    "WS002",
    "Pond-Sample",
    4.74,
    1349.2,
    24.43,
    19.2,
    "UNSAFE",
    "HIGH",
    94.2,
    "2026-08-25",
    "Turbid",
  ),
  makeSample(
    "WS003",
    "Lake-Sample",
    6.95,
    553.2,
    3.25,
    21.4,
    "SAFE",
    "LOW",
    91.7,
    "2026-08-25",
    "Clear",
  ),
  makeSample(
    "WS004",
    "Industrial-Zone",
    9.31,
    1875.0,
    18.6,
    27.8,
    "UNSAFE",
    "HIGH",
    97.3,
    "2026-08-24",
    "Muddy",
  ),
  makeSample(
    "WS005",
    "Borewell-1",
    7.05,
    712.4,
    6.42,
    23.1,
    "MODERATE",
    "MEDIUM",
    82.4,
    "2026-08-24",
    "Clear",
  ),
  makeSample(
    "WS006",
    "River-Sample",
    6.32,
    940.8,
    11.7,
    24.9,
    "MODERATE",
    "MEDIUM",
    78.9,
    "2026-08-23",
    "Turbid",
  ),
  makeSample(
    "WS007",
    "Tap-Water-2",
    7.18,
    198.3,
    1.84,
    18.6,
    "SAFE",
    "LOW",
    98.0,
    "2026-08-23",
    "Clear",
  ),
  makeSample(
    "WS008",
    "Pond-Sample",
    5.11,
    1180.5,
    21.06,
    26.2,
    "UNSAFE",
    "HIGH",
    93.5,
    "2026-08-22",
    "Muddy",
  ),
  makeSample(
    "WS009",
    "Lake-Sample",
    7.61,
    486.9,
    4.02,
    20.8,
    "SAFE",
    "LOW",
    89.4,
    "2026-08-22",
    "Clear",
  ),
  makeSample(
    "WS010",
    "Borewell-1",
    8.24,
    1024.7,
    8.31,
    22.5,
    "MODERATE",
    "MEDIUM",
    80.2,
    "2026-08-21",
    "Turbid",
  ),
  makeSample(
    "WS011",
    "River-Sample",
    5.86,
    1305.1,
    16.42,
    25.7,
    "UNSAFE",
    "HIGH",
    90.8,
    "2026-08-20",
    "Turbid",
  ),
  makeSample(
    "WS012",
    "Tap-Water-2",
    7.34,
    231.5,
    2.11,
    19.9,
    "SAFE",
    "LOW",
    95.2,
    "2026-08-19",
    "Clear",
  ),
];

export const DASHBOARD_STATS = {
  totalSamples: 1250,
  safeSamples: 820,
  unsafeSamples: 430,
  highRisk: 182,
  totalChange: 12.5,
  safePct: 65.6,
  unsafePct: 34.4,
  highRiskPct: 14.5,
};

export const QUALITY_DISTRIBUTION = [
  { name: "Safe", value: 820 },
  { name: "Moderate", value: 248 },
  { name: "Unsafe", value: 182 },
];

export const TRENDS = [
  { month: "Jan", ph: 7.1, tds: 420, turbidity: 4.2, temperature: 18.1 },
  { month: "Feb", ph: 7.3, tds: 468, turbidity: 5.1, temperature: 19.4 },
  { month: "Mar", ph: 7.6, tds: 512, turbidity: 6.8, temperature: 21.6 },
  { month: "Apr", ph: 7.9, tds: 604, turbidity: 8.4, temperature: 24.2 },
  { month: "May", ph: 7.4, tds: 690, turbidity: 9.9, temperature: 26.7 },
  { month: "Jun", ph: 6.9, tds: 742, turbidity: 12.4, temperature: 28.3 },
  { month: "Jul", ph: 6.7, tds: 688, turbidity: 10.6, temperature: 27.5 },
  { month: "Aug", ph: 7.0, tds: 601, turbidity: 7.8, temperature: 25.1 },
];

export const PH_DISTRIBUTION = [
  { range: "<5", count: 68 },
  { range: "5-6", count: 122 },
  { range: "6-7", count: 340 },
  { range: "7-8", count: 465 },
  { range: "8-9", count: 178 },
  { range: ">9", count: 77 },
];

export const TDS_DISTRIBUTION = [
  { range: "0-250", count: 310 },
  { range: "250-500", count: 402 },
  { range: "500-1000", count: 356 },
  { range: "1000-1500", count: 132 },
  { range: ">1500", count: 50 },
];

export const TURBIDITY_DISTRIBUTION = [
  { range: "0-2", count: 288 },
  { range: "2-5", count: 401 },
  { range: "5-10", count: 305 },
  { range: "10-20", count: 178 },
  { range: ">20", count: 78 },
];

export const LOCATION_QUALITY = [
  { location: "Tap Water", safe: 240, unsafe: 22 },
  { location: "River", safe: 152, unsafe: 96 },
  { location: "Lake", safe: 128, unsafe: 74 },
  { location: "Borewell", safe: 141, unsafe: 63 },
  { location: "Pond", safe: 84, unsafe: 118 },
  { location: "Industrial", safe: 45, unsafe: 137 },
];

export const RISK_DISTRIBUTION = [
  { name: "Low", value: 742 },
  { name: "Medium", value: 326 },
  { name: "High", value: 182 },
];

export interface TreatmentStage {
  step: number;
  title: string;
  description: string;
}

export const TREATMENT_STAGES: TreatmentStage[] = [
  {
    step: 1,
    title: "Sedimentation",
    description: "Allow suspended particles to settle out of the raw water.",
  },
  {
    step: 2,
    title: "Sand Filtration",
    description: "Reduce turbidity by trapping remaining fine particulates.",
  },
  {
    step: 3,
    title: "Activated Carbon",
    description: "Improve colour and odour, adsorb some organic compounds.",
  },
  {
    step: 4,
    title: "RO / Appropriate Treatment",
    description: "Address excessive dissolved solids and hardness.",
  },
  { step: 5, title: "Disinfection", description: "Final microbial-control step before use." },
];

export const FEATURE_IMPORTANCE = [
  { feature: "Turbidity", weight: 0.86, level: "High" },
  { feature: "pH", weight: 0.71, level: "High" },
  { feature: "TDS", weight: 0.48, level: "Medium" },
  { feature: "Temperature", weight: 0.14, level: "Low" },
];
