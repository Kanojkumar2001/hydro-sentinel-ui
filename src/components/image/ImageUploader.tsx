import { useRef, useState } from "react";
import { ImageUp, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

export function useImageFile() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const select = (next: File | null) => {
    if (!next) return;
    if (!TYPES.includes(next.type)) {
      setError("Please upload a JPG, PNG or WEBP image.");
      return;
    }
    if (next.size > MAX_BYTES) {
      setError("Image size must be less than 5 MB.");
      return;
    }
    setError(null);
    setFile(next);
    setPreview(URL.createObjectURL(next));
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return { file, preview, error, select, clear };
}

export function ImageUploader({
  preview,
  file,
  error,
  onSelect,
  onClear,
  actions,
}: {
  preview: string | null;
  file: File | null;
  error: string | null;
  onSelect: (f: File | null) => void;
  onClear: () => void;
  actions?: React.ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  if (preview && file) {
    return (
      <div className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          <img src={preview} alt="Selected water sample" className="max-h-80 w-full object-cover" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClear}>
              <Trash2 className="size-4" /> Remove
            </Button>
            {actions}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onSelect(e.dataTransfer.files?.[0] ?? null);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors",
          dragging ? "border-accent bg-accent/10" : "border-border bg-card hover:border-primary/50",
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-2xl bg-hero text-primary-foreground">
          <ImageUp className="size-7" />
        </span>
        <span className="text-base font-semibold">Upload water sample image</span>
        <span className="text-sm text-muted-foreground">
          Drag &amp; drop your image here, or click to browse
        </span>
        <span className="mt-2 inline-flex rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
          Choose image
        </span>
        <span className="text-xs text-muted-foreground">JPG / PNG / WEBP · maximum 5 MB</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
      />
      {error ? (
        <p className="flex items-center gap-1.5 text-sm font-medium text-destructive">
          <AlertTriangle className="size-4" /> {error}
        </p>
      ) : null}
    </div>
  );
}
