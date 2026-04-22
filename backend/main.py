from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

model = joblib.load("ai-model/asthma.pkl")

class Patient(BaseModel):
    age: int
    wheezing: int
    cough: int
    breathlessness: int
    chest_tightness: int
    peak_flow: int
    pollution: int
    smoking: int

@app.get("/")
def home():
    return {"message": "Asthma AI Backend Running 🚀"}

@app.post("/predict")
def predict(data: Patient):
    features = np.array([[
        data.age,
        data.wheezing,
        data.cough,
        data.breathlessness,
        data.chest_tightness,
        data.peak_flow,
        data.pollution,
        data.smoking
    ]])

    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]
    confidence = max(probabilities) * 100

    return {
        "risk_level": int(prediction),
        "confidence": round(confidence, 2)
    }