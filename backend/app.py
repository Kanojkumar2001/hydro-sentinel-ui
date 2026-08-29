from pathlib import Path
from typing import Annotated
import json
import io
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.ensemble import IsolationForest

ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = ROOT / "backend" / "models" / "water_quality_model.pkl"
IMAGE_MODEL_PATH = ROOT / "backend" / "models" / "water_image_model.keras"
IMAGE_CLASSES_PATH = ROOT / "backend" / "models" / "water_image_classes.txt"
FEATURES = ["pH", "Turbidity_NTU", "TDS_ppm", "Temperature_C"]
ANOMALY_DATASET = ROOT / "water_quality_data.csv"
_anomaly_detector = None
_image_model = None
_image_classes = None
_scene_model = None

app = FastAPI(title="AquaGuard ML API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$", allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


class WaterRequest(BaseModel):
    ph: float = Field(ge=0, le=14)
    turbidity: float = Field(ge=0)
    tds: float = Field(ge=0)
    temperature: float


def load_tabular_model():
    if not MODEL_PATH.exists():
        raise HTTPException(status_code=503, detail="Tabular model is not trained. Run: python backend/train_model.py")
    return joblib.load(MODEL_PATH)


def risk_from_probability(probability: float) -> tuple[str, str]:
    if probability >= 0.66:
        return "HIGH", "UNSAFE"
    if probability >= 0.34:
        return "MEDIUM", "MODERATE"
    return "LOW", "SAFE"


def parameter_items(request: WaterRequest):
    return [
        {"name": "pH", "value": request.ph, "unit": "", "ok": 6.5 <= request.ph <= 8.5, "hint": "Acceptable range 6.5 - 8.5"},
        {"name": "Turbidity", "value": request.turbidity, "unit": "NTU", "ok": request.turbidity <= 5, "hint": "Should stay below 5 NTU"},
        {"name": "TDS", "value": request.tds, "unit": "ppm", "ok": request.tds <= 500, "hint": "Should stay below 500 ppm"},
        {"name": "Temperature", "value": request.temperature, "unit": "C", "ok": 5 <= request.temperature <= 30, "hint": "Typical range 5 - 30 C"},
    ]


def predict_tabular(request: WaterRequest):
    artifact = load_tabular_model()
    vector = pd.DataFrame([[request.ph, request.turbidity, request.tds, request.temperature]], columns=FEATURES)
    model = artifact["model"]
    probabilities = model.predict_proba(vector)[0]
    classes = list(model.classes_)
    unsafe_probability = float(probabilities[classes.index("UNSAFE")])
    items = parameter_items(request)
    failed = [item for item in items if not item["ok"]]
    rule_probability = min(1.0, len(failed) / 2)
    unsafe_probability = max(unsafe_probability, rule_probability)
    risk_level, quality_class = risk_from_probability(unsafe_probability)
    explanations = [
        {"feature": "Turbidity", "weight": min(1, request.turbidity / 20), "level": "High" if request.turbidity > 5 else "Low"},
        {"feature": "pH", "weight": min(1, abs(request.ph - 7) / 4), "level": "High" if not 6.5 <= request.ph <= 8.5 else "Low"},
        {"feature": "TDS", "weight": min(1, request.tds / 1500), "level": "High" if request.tds > 500 else "Medium" if request.tds > 250 else "Low"},
        {"feature": "Temperature", "weight": 0.14, "level": "Low"},
    ]
    return {
        "status": quality_class,
        "risk": risk_level,
        "confidence": round(float(max(probabilities)) * 100, 1),
        "unsafeProbability": round(unsafe_probability * 100, 1),
        "riskScore": round(unsafe_probability, 3),
        "parameters": items,
        "explanation": explanations,
        "reasons": [f"{item['name']} is outside the documented acceptable range." for item in failed],
        "anomaly": anomaly_score(vector.to_numpy()),
    }


def anomaly_score(vector: np.ndarray):
    global _anomaly_detector
    if _anomaly_detector is None and ANOMALY_DATASET.exists():
        training = pd.read_csv(ANOMALY_DATASET)[FEATURES].dropna().to_numpy()
        _anomaly_detector = IsolationForest(contamination=0.08, random_state=42).fit(training)
    if _anomaly_detector is None:
        return {"status": "UNKNOWN", "score": None}
    raw_score = float(_anomaly_detector.decision_function(vector)[0])
    anomaly_score_value = round(max(0.0, min(1.0, 0.5 - raw_score)), 3)
    return {"status": "ANOMALOUS" if _anomaly_detector.predict(vector)[0] == -1 else "NORMAL", "score": anomaly_score_value}


def validate_image(contents: bytes, content_type: str | None):
    from PIL import Image, UnidentifiedImageError

    if content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=415, detail="Upload a JPG, PNG, or WEBP water image.")
    try:
        with Image.open(io.BytesIO(contents)) as image:
            image.verify()
    except (UnidentifiedImageError, OSError) as error:
        raise HTTPException(status_code=415, detail="The uploaded file is not a valid JPG, PNG, or WEBP image.") from error


def load_image_model():
    global _image_model, _image_classes
    if not IMAGE_MODEL_PATH.exists() or not IMAGE_CLASSES_PATH.exists():
        raise HTTPException(status_code=503, detail="The water-image model is not trained. Add labeled water_images folders and run: python backend/train_image_model.py")
    if _image_model is None:
        try:
            import tensorflow as tf
            _image_model = tf.keras.models.load_model(IMAGE_MODEL_PATH)
            _image_classes = [label.strip() for label in IMAGE_CLASSES_PATH.read_text().splitlines() if label.strip()]
        except ImportError as error:
            raise HTTPException(status_code=503, detail="TensorFlow is required to serve the trained water-image model.") from error
        except (OSError, ValueError) as error:
            raise HTTPException(status_code=503, detail="The trained water-image model could not be loaded. Retrain the image model.") from error
    if not _image_classes or not set(_image_classes).issubset({"clear", "slightly_turbid", "turbid", "muddy"}):
        raise HTTPException(status_code=503, detail="The image model classes are invalid. Retrain it with the documented water-image folders.")
    return _image_model, _image_classes


def fallback_water_prediction(contents: bytes, filename: str | None = None):
    """Classify demo images with the requested blue, orange, and mixed policy."""
    global _scene_model
    from PIL import Image
    import tensorflow as tf

    filename_terms = ("juice", "soda", "cocktail", "tea", "coffee", "pasta", "rice", "vinegar", "aloe", "coconut", "potato", "cactus", "tonic", "vegetable")
    if filename and any(term in filename.lower() for term in filename_terms):
        raise HTTPException(status_code=422, detail="This file appears to show a beverage or food product, not a water sample. Upload a clear photo of a water sample or water source.")
    if _scene_model is None:
        _scene_model = tf.keras.applications.MobileNetV2(weights="imagenet")
    image = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
    batch = tf.keras.applications.mobilenet_v2.preprocess_input(np.expand_dims(np.asarray(image, dtype=np.float32), axis=0))
    predictions = tf.keras.applications.imagenet_utils.decode_predictions(_scene_model.predict(batch, verbose=0), top=10)[0]
    water_terms = ("lake", "lakeside", "seashore", "sea", "ocean", "coast", "river", "stream", "pool", "fountain", "waterfall", "dam", "canal", "paddle", "water_jug", "water_bottle")
    beverage_terms = ("juice", "eggnog", "cocktail", "coffee", "espresso", "tea", "wine", "beer", "soda", "milk", "smoothie", "bottlecap", "saltshaker", "beaker", "lotion", "perfume", "soap")
    water_score = max((float(score) for _, label, score in predictions if any(term in label.lower() for term in water_terms)), default=0.0)
    beverage_score = max((float(score) for _, label, score in predictions if any(term in label.lower() for term in beverage_terms)), default=0.0)
    natural_water_score = max((float(score) for _, label, score in predictions if any(term in label.lower() for term in water_terms[:13])), default=0.0)
    if water_score < 0.01 or (beverage_score > 0.02 and natural_water_score < 0.01):
        raise HTTPException(status_code=422, detail="This does not appear to be a water scene. Upload a clear photo of a water sample or water source.")

    pixels = np.asarray(image, dtype=np.float32) / 255.0
    red, green, blue = pixels[..., 0], pixels[..., 1], pixels[..., 2]
    bright = pixels.mean(axis=2)
    blue_ratio = float(((blue > red * 1.08) & (blue > green * 1.02) & (blue > 0.25)).mean())
    orange_ratio = float(((red > green * 1.12) & (green > blue * 1.12) & (red > 0.25)).mean())
    midtone_ratio = float(((bright > 0.18) & (bright < 0.78)).mean())
    if orange_ratio >= 0.16:
        visual_class, visual_risk, confidence = "Muddy", "HIGH", min(92, round(60 + orange_ratio * 100))
        probabilities = {"Clear": 4, "Slightly Turbid": 10, "Turbid": 20, "Muddy": 66}
    elif blue_ratio >= 0.18 and blue_ratio > orange_ratio * 1.8:
        visual_class, visual_risk, confidence = "Clear", "LOW", min(92, round(60 + blue_ratio * 100))
        probabilities = {"Clear": 66, "Slightly Turbid": 20, "Turbid": 10, "Muddy": 4}
    else:
        visual_class, visual_risk, confidence = "Mixed / River Water", "MEDIUM", min(82, round(48 + midtone_ratio * 25))
        probabilities = {"Clear": 15, "Slightly Turbid": 25, "Turbid": 25, "Muddy": 15, "Mixed / River Water": 20}
    return {"visualClass": visual_class, "confidence": confidence, "probabilities": [{"label": label, "value": value} for label, value in probabilities.items()], "visualRisk": visual_risk, "modelSource": "Water color policy", "notice": "Demo classification uses blue = clear, orange/brown = muddy, and mixed natural colors = river water. Train a labeled CNN for learned visual classification."}


@app.get("/")
def root():
    return {"service": "AquaGuard ML API", "status": "ok", "docs": "/docs", "health": "/health"}


@app.get("/health")
def health():
    return {"status": "ok", "tabular_model": MODEL_PATH.exists(), "image_model": IMAGE_MODEL_PATH.exists()}


@app.post("/api/ml/predict-water")
@app.post("/predict-water")
def predict_water(request: WaterRequest):
    return predict_tabular(request)


@app.post("/api/ml/predict-image")
@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")
    validate_image(contents, file.content_type)
    if IMAGE_MODEL_PATH.exists() and IMAGE_CLASSES_PATH.exists():
        model, classes = load_image_model()
    else:
        try:
            return fallback_water_prediction(contents, file.filename)
        except ImportError as error:
            raise HTTPException(status_code=503, detail="TensorFlow is required for image analysis.") from error
    try:
        from PIL import Image
        image = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
        batch = np.expand_dims(np.asarray(image, dtype=np.float32), axis=0)
        probabilities = model.predict(batch, verbose=0)[0]
        best = int(np.argmax(probabilities))
        confidence = float(probabilities[best])
        if confidence < 0.65:
            return {"visualClass": "Inconclusive", "confidence": round(confidence * 100, 1), "probabilities": [{"label": label.replace("_", " ").title(), "value": round(float(value) * 100, 1)} for label, value in zip(classes, probabilities)], "visualRisk": "MEDIUM", "modelSource": "MobileNetV2 water-quality CNN", "notice": "The model confidence is below 65%. Upload a closer water-sample image or review it manually."}
        return {"visualClass": classes[best].replace("_", " ").title(), "confidence": round(confidence * 100, 1), "probabilities": [{"label": label.replace("_", " ").title(), "value": round(float(value) * 100, 1)} for label, value in zip(classes, probabilities)], "visualRisk": "LOW" if classes[best] == "clear" else "HIGH", "modelSource": "MobileNetV2 water-quality CNN"}
    except (OSError, ValueError) as error:
        raise HTTPException(status_code=415, detail="The uploaded file could not be processed as a water image.") from error


@app.post("/api/ml/combined-analysis")
@app.post("/combined-analysis")
async def combined_analysis(ph: Annotated[float, Form()], turbidity: Annotated[float, Form()], tds: Annotated[float, Form()], temperature: Annotated[float, Form()], file: UploadFile | None = File(default=None)):
    numerical = predict_tabular(WaterRequest(ph=ph, turbidity=turbidity, tds=tds, temperature=temperature))
    visual = None
    if file is not None:
        visual = await predict_image(file)
    if visual is None:
        visual_risk = 0.0
        visual = {"visualClass": "Not provided", "confidence": 0.0, "probabilities": [], "visualRisk": "LOW"}
    else:
        visual_risk = 0.0 if visual["visualRisk"] == "LOW" else 0.5 if visual["visualRisk"] == "MEDIUM" else 1.0
    final_score = numerical["riskScore"] * 0.7 + visual_risk * 0.3
    risk, quality_class = risk_from_probability(final_score)
    visual_reason = [] if visual["visualClass"] in ("Clear", "Not provided", "Inconclusive", "Mixed / River Water") else [f"Visual model classified the sample as {visual['visualClass']}."]
    return {"numerical": numerical, "image": visual, "status": quality_class, "risk": risk, "riskScore": round(final_score, 3), "confidence": round((1 - abs(final_score - 0.5)) * 100, 1), "reasons": numerical["reasons"] + visual_reason, "recommendations": ["Sedimentation", "Sand Filtration", "Activated Carbon", "Appropriate dissolved-solids treatment", "Disinfection"] if final_score >= 0.34 else ["Routine monitoring"]}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
