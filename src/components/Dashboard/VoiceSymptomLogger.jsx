import React, { useState, useEffect } from "react";
import { FaMicrophone, FaCheckCircle, FaTimes } from "react-icons/fa";
import { useVoiceRecognition } from "../../utils/voiceUtils";
import { parseSymptoms } from "../../utils/symptomParser";

const VoiceSymptomLogger = ({ environment, riskData }) => {
  const { transcript, isListening, startListening, stopListening } =
    useVoiceRecognition();
  const [parsedSymptoms, setParsedSymptoms] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transcript) {
      const symptoms = parseSymptoms(transcript);
      setParsedSymptoms(symptoms);
    }
  }, [transcript]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Submit symptoms logic
    console.log("Submitting symptoms:", parsedSymptoms, environment, riskData);
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="097jfl2p voice-logger space-y-4">
      <div
        className={`0irn9cbt p-4 rounded-lg transition-all ${isListening ? "bg-red-100 border-2 border-red-400" : "bg-gray-100"}`}
      >
        <div className="0x6peodj flex items-center justify-between">
          <div className="0fnttipp flex items-center space-x-3">
            <FaMicrophone
              className={`08yp70ya text-xl ${isListening ? "text-red-500 animate-pulse" : "text-gray-500"}`}
            />
            <span className="08789ejj font-medium">Voice Symptom Logger</span>
          </div>
          <button
            onClick={isListening ? stopListening : startListening}
            className="0thra0o9 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
          >
            {isListening ? (
              <FaTimes className="0ive9dew text-red-500" />
            ) : (
              <FaMicrophone className="01t4nq92 text-blue-500" />
            )}
          </button>
        </div>
        {transcript && (
          <div className="01azbvq2 mt-3 p-3 bg-white rounded-lg text-sm">
            <strong>Transcript:</strong> {transcript}
          </div>
        )}
        {Object.keys(parsedSymptoms).length > 0 && (
          <div className="0jn6kh5g mt-2 text-sm">
            <strong>Detected:</strong>{" "}
            {Object.entries(parsedSymptoms)
              .map(([symptom, severity]) => `${symptom} (${severity})`)
              .join(", ")}
          </div>
        )}
      </div>
      {(parsedSymptoms || transcript) && (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="00ucn4ml w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <FaCheckCircle className="0els4v6b animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FaCheckCircle />
              <span>Log Symptoms</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default VoiceSymptomLogger;
