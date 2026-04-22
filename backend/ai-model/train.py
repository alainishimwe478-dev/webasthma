import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.DataFrame([
    [20,0,0,0,0,450,2,0,0],
    [35,1,1,1,1,300,6,1,2],
    [50,1,1,1,1,200,8,1,2],
    [25,0,1,0,0,400,3,0,1],
], columns=[
    "age","wheezing","cough","breathlessness",
    "chest_tightness","peak_flow","pollution","smoking","risk"
])

X = data.drop("risk", axis=1)
y = data["risk"]

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "asthma.pkl")

print("Model trained successfully")