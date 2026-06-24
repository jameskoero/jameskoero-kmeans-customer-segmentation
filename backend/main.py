
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import joblib
import numpy as np
import pandas as pd
import io

app = FastAPI(
    title="K-Means Customer Segmentation API",
    description="Predict customer segments using K-Means clustering. Built by James Koero, Kisumu Kenya.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

SEGMENTS = {
    0: {
        "name": "Careful Spenders",
        "color": "#E17055",
        "profile": "High income, very low spending",
        "strategy": "Target with premium loyalty cards and exclusive early access offers. These customers have purchasing power but need a compelling reason to spend.",
        "mpesa": "M-Pesa loyalty cashback program"
    },
    1: {
        "name": "High Value Champions",
        "color": "#00B894",
        "profile": "High income, high spending",
        "strategy": "VIP treatment. Protect at all costs. Dedicated relationship managers, VIP-only events, proactive retention.",
        "mpesa": "Premium M-Pesa concierge service"
    },
    2: {
        "name": "Average Segment",
        "color": "#0984E3",
        "profile": "Mid income, mid spending",
        "strategy": "Largest group at 40.5% of base. Bundle offers, time-limited promotions and loyalty points to nudge spending upward.",
        "mpesa": "Timed SMS offers via Safaricom"
    },
    3: {
        "name": "Enthusiastic Spenders",
        "color": "#FDCB6E",
        "profile": "Low income, high spending",
        "strategy": "Young customers spending beyond income. BNPL options, affordable product lines and budget-friendly bundles.",
        "mpesa": "M-Pesa Lipa Mdogo Mdogo BNPL"
    },
    4: {
        "name": "Budget Conscious",
        "color": "#A29BFE",
        "profile": "Low income, low spending",
        "strategy": "Price-sensitive but present. Discount days, value packs and loss-leader products to drive footfall.",
        "mpesa": "Naivas/Quickmart-style value deals"
    }
}

class CustomerInput(BaseModel):
    age: float
    annual_income: float
    spending_score: float

class BatchInput(BaseModel):
    customers: List[CustomerInput]

def predict_single(age, income, score):
    features = np.array([[age, income, score]])
    scaled = scaler.transform(features)
    cluster = int(model.predict(scaled)[0])
    segment = SEGMENTS[cluster]
    distances = model.transform(scaled)[0]
    confidence = round((1 - distances[cluster] / distances.sum()) * 100, 1)
    return {
        "cluster": cluster,
        "segment_name": segment["name"],
        "color": segment["color"],
        "profile": segment["profile"],
        "strategy": segment["strategy"],
        "mpesa_channel": segment["mpesa"],
        "confidence": confidence,
        "input": {
            "age": age,
            "annual_income": income,
            "spending_score": score
        }
    }

@app.get("/")
def root():
    return {
        "message": "K-Means Customer Segmentation API",
        "author": "James Koero - Kisumu, Kenya",
        "docs": "/docs",
        "endpoints": ["/predict", "/predict/batch", "/predict/csv", "/segments", "/health"]
    }

@app.get("/health")
def health():
    return {"status": "healthy", "model": "K-Means K=5", "features": ["Age", "AnnualIncome", "SpendingScore"]}

@app.get("/segments")
def get_segments():
    return {"segments": SEGMENTS}

@app.post("/predict")
def predict(customer: CustomerInput):
    return predict_single(customer.age, customer.annual_income, customer.spending_score)

@app.post("/predict/batch")
def predict_batch(batch: BatchInput):
    results = []
    for c in batch.customers:
        results.append(predict_single(c.age, c.annual_income, c.spending_score))
    summary = {}
    for r in results:
        name = r["segment_name"]
        summary[name] = summary.get(name, 0) + 1
    return {
        "total": len(results),
        "predictions": results,
        "summary": summary
    }

@app.post("/predict/csv")
async def predict_csv(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    required = {"Age", "AnnualIncome", "SpendingScore"}
    if not required.issubset(df.columns):
        return {"error": f"CSV must contain columns: {required}. Found: {list(df.columns)}"}
    results = []
    for _, row in df.iterrows():
        results.append(predict_single(row["Age"], row["AnnualIncome"], row["SpendingScore"]))
    summary = {}
    for r in results:
        name = r["segment_name"]
        summary[name] = summary.get(name, 0) + 1
    return {
        "total": len(results),
        "predictions": results,
        "summary": summary
    }
