import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from flask import Flask, request, jsonify

# Load dataset (create fake_profiles.csv)
data = pd.read_csv("fake_profiles.csv")
X = data.drop("is_fake", axis=1)
y = data["is_fake"]

model = RandomForestClassifier()
model.fit(X, y)

# Save model
pickle.dump(model, open("fake_profile_model.pkl", "wb"))

# Flask API
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    user_data = request.json
    model = pickle.load(open("fake_profile_model.pkl", "rb"))
    prediction = model.predict([list(user_data.values())])
    return jsonify({"is_fake": bool(prediction[0])})

if __name__ == '__main__':
    app.run(port=5001)