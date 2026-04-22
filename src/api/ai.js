import axios from "axios";

// Your FastAPI backend URL
const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Send patient data to AI backend and get risk prediction
 */
export const getRiskPrediction = async (patientData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/predict`,
      patientData
    );

    return response.data; // { risk_level, confidence }
  } catch (error) {
    console.error("❌ AI Prediction Error:", error.message);

    return null;
  }
};