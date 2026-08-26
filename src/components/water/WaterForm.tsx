import { useState } from "react";
import { Loader2, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOCATIONS } from "@/data/mockData";
import type { WaterInput } from "@/services/api";

export const EMPTY_FORM = {
  sampleId: "",
  location: LOCATIONS[0],
  ph: "",
  turbidity: "",
  tds: "",
  temperature: "",
};

export type WaterFormValues = typeof EMPTY_FORM;

export function validate(values: WaterFormValues) {
  const errors: Partial<Record<keyof WaterFormValues, string>> = {};
  if (!values.sampleId.trim()) errors.sampleId = "Sample ID is required.";

  const ph = Number(values.ph);
  if (values.ph === "" || Number.isNaN(ph)) errors.ph = "Please enter a valid pH value.";
  else if (ph < 0 || ph > 14) errors.ph = "pH must be between 0 and 14.";

  const turbidity = Number(values.turbidity);
  if (values.turbidity === "" || Number.isNaN(turbidity))
    errors.turbidity = "Please enter a valid turbidity value.";
  else if (turbidity < 0) errors.turbidity = "Turbidity cannot be negative.";

  const tds = Number(values.tds);
  if (values.tds === "" || Number.isNaN(tds)) errors.tds = "Please enter a valid TDS value.";
  else if (tds < 0) errors.tds = "TDS cannot be negative.";

  const temperature = Number(values.temperature);
  if (values.temperature === "" || Number.isNaN(temperature))
    errors.temperature = "Please enter a valid temperature.";

  return errors;
}

export function toInput(values: WaterFormValues): WaterInput {
  return {
    sampleId: values.sampleId,
    location: values.location,
    ph: Number(values.ph),
    turbidity: Number(values.turbidity),
    tds: Number(values.tds),
    temperature: Number(values.temperature),
  };
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  suffix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  suffix?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {suffix ? <span className="ml-1 text-muted-foreground">({suffix})</span> : null}
      </Label>
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        inputMode="decimal"
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
      />
      {error ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertTriangle className="size-3.5" /> {error}
        </p>
      ) : null}
    </div>
  );
}

export function WaterForm({
  values,
  onChange,
  onSubmit,
  loading,
  submitLabel = "Analyze Water",
}: {
  values: WaterFormValues;
  onChange: (v: WaterFormValues) => void;
  onSubmit: (input: WaterInput) => void;
  loading?: boolean;
  submitLabel?: string;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof WaterFormValues, string>>>({});
  const set = (key: keyof WaterFormValues) => (v: string) => onChange({ ...values, [key]: v });

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const next = validate(values);
        setErrors(next);
        if (Object.keys(next).length === 0) onSubmit(toInput(values));
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="sampleId"
          label="Sample ID"
          value={values.sampleId}
          onChange={set("sampleId")}
          error={errors.sampleId}
          placeholder="WS001"
        />
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <Select value={values.location} onValueChange={(v) => onChange({ ...values, location: v })}>
            <SelectTrigger id="location" className="w-full">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Field id="ph" label="pH" value={values.ph} onChange={set("ph")} error={errors.ph} placeholder="7.42" />
        <Field
          id="turbidity"
          label="Turbidity"
          suffix="NTU"
          value={values.turbidity}
          onChange={set("turbidity")}
          error={errors.turbidity}
          placeholder="3.19"
        />
        <Field
          id="tds"
          label="TDS"
          suffix="ppm"
          value={values.tds}
          onChange={set("tds")}
          error={errors.tds}
          placeholder="250.6"
        />
        <Field
          id="temperature"
          label="Temperature"
          suffix="°C"
          value={values.temperature}
          onChange={set("temperature")}
          error={errors.temperature}
          placeholder="19.2"
        />
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onChange(EMPTY_FORM);
            setErrors({});
          }}
        >
          <RotateCcw className="size-4" /> Reset
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Analyzing…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
