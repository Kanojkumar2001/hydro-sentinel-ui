"""Train the optional MobileNetV2 visual branch.

Expected data layout:
water_images/clear/*.jpg
water_images/slightly_turbid/*.jpg
water_images/turbid/*.jpg
water_images/muddy/*.jpg

The API intentionally refuses image predictions until this model exists.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATASET = ROOT / "water_images"
OUTPUT = ROOT / "backend" / "models" / "water_image_model.keras"
CLASS_NAMES = ("clear", "slightly_turbid", "turbid", "muddy")
SUPPORTED_EXTENSIONS = {".bmp", ".gif", ".jpeg", ".jpg", ".png"}


def main() -> None:
    try:
        import tensorflow as tf
    except ImportError as error:
        raise SystemExit("Install tensorflow to train the CNN: pip install tensorflow") from error

    if not DATASET.exists():
        raise SystemExit(f"Create the labeled image folders first: {DATASET}")

    class_directories = {name: DATASET / name for name in CLASS_NAMES}
    missing = [name for name, directory in class_directories.items() if not directory.is_dir()]
    if missing:
        flat_images = [path for path in DATASET.iterdir() if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS]
        flat_hint = f" Found {len(flat_images)} image(s) directly in water_images; move each into its correct label folder." if flat_images else ""
        raise SystemExit(
            "Missing labeled water-image folders: "
            + ", ".join(missing)
            + ". Expected water_images/clear, water_images/slightly_turbid, water_images/turbid, and water_images/muddy."
            + flat_hint
        )

    counts = {
        name: sum(path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS for path in directory.rglob("*"))
        for name, directory in class_directories.items()
    }
    if sum(counts.values()) < 10 or any(count < 2 for count in counts.values()):
        raise SystemExit(
            "Add at least 2 supported images to every class folder (10 images recommended minimum); "
            f"current counts: {counts}. Do not place unrelated images in these folders."
        )

    train = tf.keras.utils.image_dataset_from_directory(DATASET, validation_split=0.2, subset="training", seed=42, image_size=(224, 224), batch_size=32)
    validation = tf.keras.utils.image_dataset_from_directory(DATASET, validation_split=0.2, subset="validation", seed=42, image_size=(224, 224), batch_size=32)
    base = tf.keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights="imagenet")
    base.trainable = False
    model = tf.keras.Sequential([tf.keras.layers.RandomFlip("horizontal"), tf.keras.layers.RandomRotation(0.05), tf.keras.layers.Rescaling(1 / 127.5, offset=-1), base, tf.keras.layers.GlobalAveragePooling2D(), tf.keras.layers.Dropout(0.25), tf.keras.layers.Dense(len(train.class_names), activation="softmax")])
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    model.fit(train, validation_data=validation, epochs=8)
    OUTPUT.parent.mkdir(exist_ok=True)
    model.save(OUTPUT)
    (OUTPUT.parent / "water_image_classes.txt").write_text("\n".join(train.class_names))


if __name__ == "__main__":
    main()
