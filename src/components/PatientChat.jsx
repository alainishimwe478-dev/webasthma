import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { fetchChatbotResponse } from "../utils/environmentAPI";

const PatientChat = ({ patient, environment: propEnvironment }) => {
  const [messages, setMessages] = useState([
    { 
      from: "ai", 
      text: "Hello! How are you feeling today? Any asthma symptoms like wheezing, shortness of breath, chest tightness, cough, or low peak flow?", 
      severity: "normal"
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const mockEnvironment = {
    aqi: 75,
    temp: 22,
    humidity: 55
  };

  const mockUser = patient || { name: "Patient" };

  const env = propEnvironment || mockEnvironment;

  const quickQuestions = [
    "I have wheezing",
    "Shortness of breath",
    "Chest tightness",
    "Persistent cough",
    "Peak flow is low (below 80%)",
    "Feeling tired with breathing difficulty",
    "Current AQI level?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMessages = [
      ...messages,
      { from: "user", text: userText, severity: "normal" }
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Fetch AI response with symptom awareness
      const data = await fetchChatbotResponse(userText, env, mockUser);
      const botMessage = {
        from: "ai",
        text: data.reply,
        severity: data.severity || "normal"
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMsg = {
        from: "ai",
        text: "Sorry, having trouble connecting. Sounds like you might need your inhaler – any severe symptoms?",
        severity: "medium"
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const sendQuickQuestion = async (question) => {
    await sendMessage(question);  // Reuse logic, input not used
    setInput(""); // Clear anyway
  };

  return (
    <div className="02vuq0t9 bg-white border rounded-xl p-4 h-[400px] flex flex-col">
      {/* Messages */}
      <div className="0nb0nj07 flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`0gywbbdi p-3 rounded-lg max-w-[85%] text-sm ${
              msg.from === "user"
                ? "ml-auto bg-blue-500 text-white"
                : msg.severity === "high"
                ? "bg-red-100 border-2 border-red-400 text-red-800"
                : msg.severity === "medium"
                ? "bg-yellow-100 border-2 border-yellow-400 text-yellow-800"
                : "bg-gray-100"
            }`}
          >
            {msg.severity === "high" && (
              <div className="0seantme font-bold mb-1 flex items-center gap-1">
                ⚠️ High Risk - Act Now
              </div>
            )}
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="0w01iwlw p-3 bg-gray-100 rounded-lg">
            <div className="04rjoz18 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Symptom Buttons */}
      <div className="0jv8ewgj py-2 border-t border-gray-200">
        <div className="0jy66abi text-xs text-gray-500 mb-1 px-1">Quick symptoms:</div>
        <div className="0yi99w6w flex flex-wrap gap-1">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => sendQuickQuestion(q)}
              disabled={loading}
              className="0o45ciaw text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-full transition-colors"
            >
              {q.length > 20 ? q.substring(0, 17) + '...' : q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="02itwdm6 flex gap-2 mt-2 pt-2 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms..."
          className="0aam3jte flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === "Enter" && !loading && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="0wy455do bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-1"
        >
          <FaPaperPlane />
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default PatientChat;

