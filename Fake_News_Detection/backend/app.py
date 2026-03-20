from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "..", "models", "fake_news_model.pkl"))
vectorizer = joblib.load(os.path.join(BASE_DIR, "..", "models", "tfidf_vectorizer.pkl"))

@app.route("/")
def home():
    return "Fake News Detection API is running!"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data["text"]

    vector = vectorizer.transform([text])
    prediction = model.predict(vector)[0]
    prob = model.predict_proba(vector)[0]

    return jsonify({
        "prediction": "Real News" if prediction == 1 else "Fake News",
        "confidence": float(max(prob))
    })

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=True)
