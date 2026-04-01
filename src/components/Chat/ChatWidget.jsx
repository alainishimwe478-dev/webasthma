import React, { useState, useEffect } from "react";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { asthmaKnowledgeBase, ASTHMA_SUGGESTED_QUESTIONS } from "../../utils/asthmaKnowledgeBase";
import { fetchLiveEnvData } from "../../utils/environmentAPI";
import { RWANDA_DEFAULT_LOCATION } from "../../utils/rwandaEnvironment";
import { getAqiStandard, getHumidityStandard, getTemperatureStandard } from "../../utils/rwandaEnvironment";

// Helper functions for chart segments
const splitSegments = (data, key, isRiskyFn) => {
  const segments = [];
  let tempSegment = [];
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    tempSegment.push(point);
    const nextPoint = data[i + 1];
    // If next point changes risk status or last point, finalize current segment
    if (!nextPoint || isRiskyFn(point[key]) !== isRiskyFn(nextPoint[key])) {
      segments.push({
        data: [...tempSegment],
        color: isRiskyFn(point[key]) ? "#ef4444" : (key === "temperature" ? "#3b82f6" : key === "humidity" ? "#10b981" : "#f97316")
      });
      tempSegment = [];
    }
  }
  return segments;
};

const isTemperatureRisky = (temp) => temp < 18 || temp > 26;
const isHumidityRisky = (hum) => hum < 30 || hum > 60;
const isAqiRisky = (aqi) => aqi > 100;

// Risk-based recommendation mapping
const riskRecommendations = {
  Low: [
    "Air quality is good today. Normal outdoor activity is safe.",
    "Keep monitoring your symptoms and stay hydrated.",
  ],
  Medium: [
    "Air quality is moderate. Consider limiting long outdoor activities.",
    "Have your rescue inhaler handy just in case.",
  ],
  High: [
    "Air quality is poor! Limit outdoor activity and stay indoors if possible.",
    "Carry your inhaler at all times and avoid strenuous exercise.",
    "Use air purifiers if available and close windows.",
  ],
};

// Risk colors for chat display and badge
const riskColors = {
  Low: "bg-green-100 text-green-800 border-green-200",
  Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  High: "bg-red-100 text-red-800 border-red-200",
};

// Optional emojis for visual cue
const riskEmojis = {
  Low: "✅",
  Medium: "⚠️",
  High: "❌",
};

// GPT API call
async function fetchGPTAnswer(question, envContext) {
  try {
    const systemMessage = `You are an AI assistant for asthma patients. Current environment context: ${envContext}`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: question },
        ],
        max_tokens: 250,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("GPT fetch error:", error);
    return null;
  }
}

// Compute risk level from environment
const buildRiskFromEnvironment = (env) => {
  let score = 18;
  if (env.aqi > 100) score += 28;
  else if (env.aqi > 50) score += 14;
  if (env.humidity < 30 || env.humidity > 70) score += 18;
  else if (env.humidity < 35 || env.humidity > 60) score += 8;
  if (env.temperature < 15 || env.temperature > 30) score += 12;
  else if (env.temperature < 18 || env.temperature > 26) score += 6;

  const riskLevel = score >= 60 ? "High" : score >= 35 ? "Medium" : "Low";
  return { score, riskLevel };
};

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [environment, setEnvironment] = useState({
    temperature: "--",
    humidity: "--",
    aqi: "--",
    location: RWANDA_DEFAULT_LOCATION.label,
  });
  const [envHistory, setEnvHistory] = useState([]);

  // Load environment data and build history
  useEffect(() => {
    const loadEnv = async () => {
      try {
        const liveData = await fetchLiveEnvData(
          RWANDA_DEFAULT_LOCATION.lat,
          RWANDA_DEFAULT_LOCATION.lon,
          RWANDA_DEFAULT_LOCATION.label
        );
        setEnvironment(liveData);

        // Add to history (max 12 points, ~1hr)
        const newHistory = [{ 
          time: new Date(liveData.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}), 
          temperature: liveData.temperature, 
          humidity: liveData.humidity, 
          aqi: liveData.aqi 
        }, ...envHistory].slice(0, 12);
        setEnvHistory(newHistory);
      } catch (err) {
        console.error("Failed to fetch environment data", err);
      }
    };
    loadEnv();
    const interval = setInterval(loadEnv, 5 * 60 * 1000); // refresh every 5 mins
    return () => clearInterval(interval);
  }, [envHistory]);

  const riskData = buildRiskFromEnvironment(environment);

  const envContext = `Temperature: ${environment.temperature}°C (${getTemperatureStandard(environment.temperature).label}), Humidity: ${environment.humidity}% (${getHumidityStandard(environment.humidity).label}), AQI: ${environment.aqi} (${getAqiStandard(environment.aqi).label}), Risk: ${riskData.riskLevel}.`;

  const getRiskAdvice = () => riskRecommendations[riskData.riskLevel] || [];

  // Automatically suggest preventive actions when environment updates
  useEffect(() => {
    if (environment.temperature !== "--") {
      const adviceMessages = getRiskAdvice();
      setMessages((prev) => [
        ...prev,
        {
          type: "bot-risk",
          riskLevel: riskData.riskLevel,
          text: adviceMessages.join("\n"),
        },
      ]);
    }
  }, [environment]);

  // Voice input
  const startVoiceInput = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => handleSend(event.results[0][0].transcript);
    recognition.onerror = (event) => console.error("Voice error:", event.error);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition.start();
    } catch (err) {
      console.error(err);
    }
  };

  // Send user message
  const handleSend = async (messageText = userMessage) => {
    if (!messageText.trim()) return;
    setMessages((prev) => [...prev, { type: "user", text: messageText }]);
    setUserMessage("");
    setLoading(true);

    // Check knowledge base first
    const lowerText = messageText.toLowerCase();
    const kbAnswer =
      asthmaKnowledgeBase.find((qa) =>
        qa.question.toLowerCase().includes(lowerText)
      )?.answer;

    let answer = kbAnswer;

    // If not found, fetch GPT answer with environment context
    if (!answer) {
      answer = await fetchGPTAnswer(messageText, envContext);
      if (!answer) answer = "Sorry, I could not find an answer right now.";
    }

    // Combine answer with risk advice
    const combinedAnswer = `${answer}\n\nEnvironment Advice:\n${getRiskAdvice().join(
      "\n"
    )}`;

    setMessages((prev) => [
      ...prev,
      { type: "bot-risk", riskLevel: riskData.riskLevel, text: combinedAnswer },
    ]);
    setLoading(false);
  };

  return (
    <div className="0ij29nek relative bg-white p-6 rounded-3xl shadow-lg max-w-md mx-auto border">

      {/* Real-time Risk Badge */}
      <div className={`09gxfde1 absolute top-4 right-4 px-3 py-1 rounded-full font-bold text-sm shadow-md border ${riskColors[riskData.riskLevel]}`}>
        {riskEmojis[riskData.riskLevel]} {riskData.riskLevel} Risk
      </div>

      {/* Environment Trends Chart */}
      <div className="0cxlk6xq mb-4 bg-slate-50 p-4 rounded-xl shadow-inner">
        <h3 className="03jpxkld font-bold mb-2 text-slate-700 text-sm">Environment Trends</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={envHistory}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={20} wrapperStyle={{ fontSize: 10 }} />

            {/* Temperature segments */}
            {splitSegments(envHistory, "temperature", isTemperatureRisky).map((seg, idx) => (
              <Line
                key={`temp-${idx}`}
                type="monotone"
                data={seg.data}
                dataKey="temperature"
                stroke={seg.color}
                strokeWidth={2}
                dot={(props) => {
                  const { payload, cx, cy } = props;
                  return <circle cx={cx} cy={cy} r={4} fill={isTemperatureRisky(payload.temperature) ? "#ef4444" : "#3b82f6"} />;
                }}
                isAnimationActive={false}
              />
            ))}

            {/* Humidity segments */}
            {splitSegments(envHistory, "humidity", isHumidityRisky).map((seg, idx) => (
              <Line
                key={`hum-${idx}`}
                type="monotone"
                data={seg.data}
                dataKey="humidity"
                stroke={seg.color}
                strokeWidth={2}
                dot={(props) => {
                  const { payload, cx, cy } = props;
                  return <circle cx={cx} cy={cy} r={4} fill={isHumidityRisky(payload.humidity) ? "#ef4444" : "#10b981"} />;
                }}
                isAnimationActive={false}
              />
            ))}

            {/* AQI segments */}
            {splitSegments(envHistory, "aqi", isAqiRisky).map((seg, idx) => (
              <Line
                key={`aqi-${idx}`}
                type="monotone"
                data={seg.data}
                dataKey="aqi"
                stroke={seg.color}
                strokeWidth={2}
                dot={(props) => {
                  const { payload, cx, cy } = props;
                  return <circle cx={cx} cy={cy} r={4} fill={isAqiRisky(payload.aqi) ? "#ef4444" : "#f97316"} />;
                }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="0i4pm40u text-xl font-bold mb-4 text-gray-900">Asthma ChatBot</h2>

      {/* Messages */}
      <div className="0mugfxvk h-64 overflow-y-auto mb-4 space-y-3 border p-3 rounded-xl bg-slate-50">
        {messages.length === 0 && (
          <p className="0k5mew2p text-slate-400 text-sm italic">
            Ask a question about asthma or your symptoms...
          </p>
        )}
        {messages.map((msg, i) => {
          if (msg.type === "bot-risk") {
            return (
              <div
                key={i}
                className={`03o627qc p-3 rounded-xl shadow-sm border ${riskColors[msg.riskLevel]}`}
              >
                {msg.text.split("\n").map((line, idx) => (
                  <p key={idx} className="0zslazea mb-1">
                    {riskEmojis[msg.riskLevel]} {line}
                  </p>
                ))}
              </div>
            );
          }

          return (
            <div
              key={i}
              className={`0lmxckq3 p-3 rounded-xl shadow-sm max-w-xs ${
                msg.type === "user"
                  ? "bg-blue-100 text-right ml-auto border-blue-200"
                  : "bg-emerald-100 border-emerald-200"
              }`}
            >
              {msg.text}
            </div>
          );
        })}
        {loading && (
          <div className="0cyc3lkf flex items-center space-x-2 text-slate-500 text-sm">
            <div className="0fscd7gi w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      <div className="004ahqox mb-4 flex flex-wrap gap-2">
        {ASTHMA_SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            className="0veuyso3 bg-sky-100 hover:bg-sky-200 text-sky-800 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border border-sky-200 shadow-sm"
            disabled={loading}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input + buttons */}
      <div className="0vvrnydw flex gap-2">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your question..."
          className="034767l9 flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
          onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !userMessage.trim()}
          className="084zuy8r bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium shadow-md transition-all duration-200 disabled:opacity-50 flex-shrink-0"
        >
          <FaPaperPlane />
          Send
        </button>
        <button
          onClick={startVoiceInput}
          disabled={loading}
          className={`0vbylayp px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-medium shadow-md transition-all duration-200 disabled:opacity-50 flex-shrink-0 ${
            isListening 
              ? "bg-red-500 hover:bg-red-600 text-white" 
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          <FaMicrophone />
          {isListening ? "●" : "🎤"}
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;

