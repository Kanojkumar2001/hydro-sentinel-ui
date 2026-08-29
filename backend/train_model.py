from pathlib import Path
import json
import joblib
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

ROOT = Path(__file__).resolve().parents[1]
DATASET = ROOT / "water_quality_data.csv"
MODEL_DIR = ROOT / "backend" / "models"
FEATURES = ["pH", "Turbidity_NTU", "TDS_ppm", "Temperature_C"]


def main() -> None:
    frame = pd.read_csv(DATASET).dropna(subset=FEATURES + ["Quality_Label"])
    frame[FEATURES] = frame[FEATURES].apply(pd.to_numeric, errors="coerce")
    frame = frame.dropna(subset=FEATURES)
    frame["Quality_Label"] = frame["Quality_Label"].str.upper()
    if set(frame["Quality_Label"].unique()) != {"SAFE", "UNSAFE"}:
        raise ValueError("The attached dataset must contain exactly SAFE/UNSAFE labels for this binary model.")

    x_train, x_test, y_train, y_test = train_test_split(
        frame[FEATURES], frame["Quality_Label"], test_size=0.2, random_state=42, stratify=frame["Quality_Label"]
    )
    candidates = {
        "logistic_regression": Pipeline([("scale", StandardScaler()), ("model", LogisticRegression(max_iter=2000))]),
        "decision_tree": DecisionTreeClassifier(max_depth=5, random_state=42),
        "knn": Pipeline([("scale", StandardScaler()), ("model", KNeighborsClassifier(n_neighbors=7))]),
        "svm": Pipeline([("scale", StandardScaler()), ("model", SVC(probability=True, random_state=42))]),
        "random_forest": RandomForestClassifier(n_estimators=300, random_state=42, class_weight="balanced"),
        "gradient_boosting": GradientBoostingClassifier(random_state=42),
    }
    scores = {}
    for name, candidate in candidates.items():
        candidate.fit(x_train, y_train)
        predictions = candidate.predict(x_test)
        probabilities = candidate.predict_proba(x_test)[:, list(candidate.classes_).index("UNSAFE")]
        scores[name] = {
            "accuracy": round(accuracy_score(y_test, predictions), 4),
            "precision": round(precision_score(y_test, predictions, pos_label="UNSAFE"), 4),
            "recall": round(recall_score(y_test, predictions, pos_label="UNSAFE"), 4),
            "f1": round(f1_score(y_test, predictions, pos_label="UNSAFE"), 4),
            "roc_auc": round(roc_auc_score((y_test == "UNSAFE").astype(int), probabilities), 4),
        }

    best_name = max(scores, key=lambda name: (scores[name]["f1"], scores[name]["roc_auc"]))
    best_model = candidates[best_name]
    best_model.fit(frame[FEATURES], frame["Quality_Label"])
    MODEL_DIR.mkdir(exist_ok=True)
    joblib.dump({"model": best_model, "features": FEATURES, "classes": list(best_model.classes_)}, MODEL_DIR / "water_quality_model.pkl")
    (MODEL_DIR / "metrics.json").write_text(json.dumps({"selected_model": best_name, "models": scores}, indent=2))
    print(json.dumps({"selected_model": best_name, "metrics": scores[best_name]}, indent=2))


if __name__ == "__main__":
    main()
