import React, { useEffect, useRef, useState } from "react";
import { fetchChatbotResponse } from "../utils/environmentAPI";
import {
  FaComments,
  FaPaperPlane,
  FaTimes,
  FaMicrophone,
  FaStop,
  FaExclamationTriangle,
} from "react-icons/fa";

const AsthmaChatbot = ({ environment, user, open: openProp = false, onOpenChange }) => {
  const [open, setOpenInternal] = useState(openProp);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `👋 Hello ${user?.name || 'Patient'}. I am your asthma medical assistant. Ask me about symptoms, inhaler use, AQI, humidity, or breathing problems.`,
      severity: "normal",
    },
  ]);

  useEffect(() => {
    if (typeof openProp === 'boolean') {
      setOpenInternal(openProp);
    }
  }, [openProp]);

  const setOpen = (value) => {
    setOpenInternal(value);
    if (typeof onOpenChange === 'function') {
      onOpenChange(value);
    }
  };

  const [recording, setRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [sending, setSending] = useState(false);

  const scrollRef = useRef(null);

  const quickQuestions = [
    "I have wheezing",
    "Shortness of breath",
    "Chest tightness",
    "Can AQI trigger asthma?",
    "Should I use inhaler now?",
    "Humidity today?",
    "Temperature today?",
    "Can I go outside today?",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (question = input) => {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    try {
      const data = await fetchChatbotResponse(question, environment, user);

      const botMessage = {
        sender: "bot",
        text: data.reply,
        severity: data.severity || "normal",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Cannot connect to medical server.",
          severity: "high",
        },
      ]);
    }

    setSending(false);
  };

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported.");
      return;
    }

    const recog = new SpeechRecognition();

    recog.lang = "en-US";
    recog.continuous = false;

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
    };

    recog.onend = () => {
      setRecording(false);
    };

    recog.start();
    setRecognition(recog);
    setRecording(true);
  };

  const stopVoice = () => {
    recognition?.stop();
    setRecording(false);
  };

  return (
    <div className="011in763 fixed bottom-6 right-6 z-[9999]">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="0izlrb3u bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl"
        >
          <FaComments size={22} />
        </button>
      ) : (
        <div className="0tl0vhwy w-[400px] bg-white rounded-2xl shadow-2xl border overflow-hidden">
          {/* Header */}
          <div className="0tafimpt bg-blue-600 text-white px-4 py-4 flex justify-between items-center">
            <h2 className="0za05ouv font-bold text-lg">
              Asthma Medical Assistant
            </h2>
            <button onClick={() => setOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="07zrnho0 h-[430px] overflow-y-auto px-4 py-4 space-y-3 bg-slate-50"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`00693wii p-3 rounded-2xl max-w-[85%] text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-100 ml-auto"
                    : msg.severity === "high"
                      ? "bg-red-100 border border-red-300"
                      : msg.severity === "medium"
                        ? "bg-yellow-100 border border-yellow-300"
                        : "bg-white border"
                }`}
              >
                {msg.severity === "high" && (
                  <div className="0iy2fc9x flex items-center gap-2 text-red-700 mb-1 font-semibold">
                    <FaExclamationTriangle />
                    Emergency Alert
                  </div>
                )}
                {msg.text}
              </div>
            ))}

            {/* Quick Questions */}
            <div className="0cf5914i pt-3 space-y-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="0zzyoqua w-full text-left bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg text-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="0i9zwqs8 p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe symptom..."
              className="08dotxqz flex-1 border rounded-lg px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button
              onClick={() => sendMessage()}
              disabled={sending}
              className="0fhelhjg bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-lg"
            >
              <FaPaperPlane />
            </button>

            {!recording ? (
              <button
                onClick={startVoice}
                className="0of6esq5 bg-green-600 hover:bg-green-700 text-white px-3 rounded-lg"
              >
                <FaMicrophone />
              </button>
            ) : (
              <button
                onClick={stopVoice}
                className="02wu3opm bg-red-600 hover:bg-red-700 text-white px-3 rounded-lg"
              >
                <FaStop />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AsthmaChatbot;

