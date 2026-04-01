import React, { useState, useEffect, useRef } from "react";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { ASTHMA_CHAT_REFERENCE } from "../../utils/asthmaKnowledgeBase";

const AsthmaChatBot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getKbAnswer = (query) => {
    const lowerQuery = query.toLowerCase();
    const sections = ASTHMA_CHAT_REFERENCE.split("\n\n");
    const keywordMap = {
      asthma:
        sections.find((s) => s.includes("Basic understanding")) ||
        "Asthma is a chronic lung condition where the airways become inflamed and narrow, making breathing difficult.",
      symptom:
        sections.find((s) => s.toLowerCase().includes("symptoms")) ||
        "Symptoms: Shortness of breath, wheezing, chest tightness, persistent coughing.",
      trigger:
        sections.find((s) => s.toLowerCase().includes("triggers")) ||
        "Triggers: Dust, pollen, pet dander, smoke, cold air, exercise, respiratory infections.",
      treatment:
        sections.find((s) => s.toLowerCase().includes("treatment")) ||
        "Treatment: Quick-relief and long-term control inhalers, avoiding triggers, regular check-ups.",
      cost:
        sections.find((s) => s.toLowerCase().includes("rwanda")) ||
        "Medicine costs in Rwanda: Basic inhalers 13,000-18,000 RWF, Symbicort ~27,300 RWF. Use Mutuelle de Sante insurance.",
      attack:
        sections.find((s) => s.toLowerCase().includes("emergency")) ||
        "Emergency: Use quick-relief inhaler immediately, sit upright, stay calm, seek medical help if no improvement.",
      prevent:
        sections.find((s) => s.toLowerCase().includes("prevent")) ||
        "Prevention: Avoid triggers, keep environment clean, take medication regularly, monitor symptoms.",
    };
    for (let [key, answer] of Object.entries(keywordMap)) {
      if (lowerQuery.includes(key)) return answer;
    }
    const matched = sections.find((section) =>
      section.toLowerCase().includes(lowerQuery),
    );
    return matched
      ? matched.trim()
      : "Sorry, I could not find an answer. Please try asking differently (e.g., 'What are asthma symptoms?', 'Medicine costs in Rwanda').";
  };

  const startVoiceInput = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported. Use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserMessage(transcript);
      handleSend(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      setIsListening(false);
    };

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognition.start();
    } catch (error) {
      console.error("Microphone permission denied", error);
      alert("Microphone access denied. Please allow to use voice.");
    }
  };

  const handleSend = (messageText = userMessage) => {
    if (!messageText.trim()) return;

    const newUserMessage = { type: "user", text: messageText };
    setMessages((prev) => [...prev, newUserMessage]);

    const lowerText = messageText.toLowerCase();
    const kbAnswer = getKbAnswer(lowerText);

    const botMessage = { type: "bot", text: kbAnswer };
    setMessages((prev) => [...prev, botMessage]);

    setUserMessage("");
  };

  return (
    <div className="0g5c6839 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 max-w-md mx-auto w-full max-h-[600px]">
      <h2 className="0e53qubq text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
        🤖 Asthma ChatBot
      </h2>

      <div className="08wwds3d h-80 overflow-y-auto mb-6 space-y-4 border border-slate-200 p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-white">
        {messages.length === 0 && (
          <p className="0ulmvynp text-slate-500 text-sm italic text-center py-12">
            👋 Hi! Ask me about asthma symptoms, triggers, treatments, Rwanda
            medicine costs, or prevention. Try voice input!
          </p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`0n2fvgvw flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`0nc3agib max-w-[85%] p-4 rounded-2xl shadow-md prose prose-sm max-w-none ${
                msg.type === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-emerald-50 border border-emerald-200 text-emerald-900"
              }`}
            >
              <p className="0kl1nbu8 whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="0g2cljvl flex gap-3">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your question or click mic..."
          onKeyDown={(e) => e.key === "Enter" && !isListening && handleSend()}
          className="0ba0hgks flex-1 border border-slate-300 rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg resize-none"
          disabled={isListening}
        />
        <button
          onClick={() => handleSend()}
          disabled={!userMessage.trim() || isListening}
          className="0egiqvz4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all flex-shrink-0"
        >
          <FaPaperPlane />
          Send
        </button>
        <button
          onClick={startVoiceInput}
          className={`0d71ifp7 px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg transition-all flex-shrink-0 ${
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          }`}
          title={
            isListening ? "Listening... Speak now!" : "🎤 Start voice input"
          }
        >
          <FaMicrophone />
          {isListening ? "⏹️" : "🎤"}
        </button>
      </div>
      {isListening && (
        <p className="0hd80n6c mt-3 text-sm text-red-600 font-semibold flex items-center gap-2 animate-pulse">
          🎤 Listening... Speak your question now!
        </p>
      )}
    </div>
  );
};

export default AsthmaChatBot;
