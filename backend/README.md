# AquaGuard ML API

## Install and train the tabular model

```powershell
python -m pip install -r backend/requirements.txt
python backend/train_model.py
uvicorn backend.app:app --reload --port 8000
```

The attached `water_quality_data.csv` has binary `Safe`/`Unsafe` labels. The trained service therefore returns `SAFE` or `UNSAFE`; it does not invent a `NORMAL` class. Use a documented three-class dataset before enabling `NORMAL`.

## Optional CNN branch

Place labeled images in `water_images/clear`, `water_images/slightly_turbid`, `water_images/turbid`, and `water_images/muddy`. Every image must be inside the folder matching its real label; files directly inside `water_images` are not labeled and cannot be trained. Use at least 2 images per class for a smoke test and preferably 10 or more per class. Then run `python backend/train_image_model.py`. Until the CNN artifact exists, the image endpoint returns HTTP 503 so the UI cannot present fabricated visual confidence.

Endpoints:

- `GET /health`
- `POST /api/ml/predict-water`
- `POST /api/ml/predict-image`
- `POST /api/ml/combined-analysis`
