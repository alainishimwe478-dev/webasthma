import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot } from "react-icons/fa";
import { ASTHMA_SUGGESTED_QUESTIONS } from "../utils/asthmaKnowledgeBase";

const CHAT_STORAGE_KEY = "chat_messages";

const getFriendlyChatError = (message) => {
  const normalized = (message || "").toLowerCase();

  if (
    normalized.includes("incorrect api key") ||
    normalized.includes("invalid api key") ||
    normalized.includes("invalid_api_key")
  ) {
    return "The chatbot OpenAI API key is invalid. Update OPENAI_API_KEY in the server .env file and restart the app.";
  }

  if (normalized.includes("openai_api_key is not configured")) {
    return "The chatbot OpenAI API key is missing. Add OPENAI_API_KEY to the server .env file and restart the app.";
  }

  if (
    normalized.includes("quota") ||
    normalized.includes("billing") ||
    normalized.includes("insufficient_quota")
  ) {
    return "The chatbot OpenAI account has no available quota right now. Check billing on the OpenAI account.";
  }

  return message || "Chat service is unavailable right now.";
};

const ChatWidget = ({ positionClassName = "bottom-4 right-4" }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState("");
  const messagesEndRef = useRef(null);

  // Load messages from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  // Save messages to localStorage
  const saveMessages = useCallback((newMessages) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (msg) => {
    const newMessages = [...messages, msg];
    setMessages(newMessages);
    saveMessages(newMessages);
  };

  const requestAIResponse = async (conversation) => {
    setIsTyping(true);
    setApiError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: user?.name,
          messages: conversation.map((message) => ({
            sender: message.sender,
            text: message.text,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data?.error || "The asthma assistant could not respond right now.",
        );
      }

      addMessage({
        id: Date.now(),
        text:
          data.reply ||
          "I could not find a response right now. Please try again.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const friendlyError = getFriendlyChatError(error.message);
      setApiError(friendlyError);
      addMessage({
        id: Date.now(),
        text: friendlyError,
        sender: "ai",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMsg = {
      id: Date.now(),
      text: input.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    saveMessages(nextMessages);
    setInput("");
    requestAIResponse(nextMessages);
  };

  const handleSuggestedQuestion = (question) => {
    if (!user) return;

    const userMsg = {
      id: Date.now(),
      text: question,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    saveMessages(nextMessages);
    setInput("");
    requestAIResponse(nextMessages);
  };

  if (!user) return null;

  const unreadCount = messages.filter(
    (m) => m.sender !== "user" && !m.read,
  ).length;

  return (
    <div className={`fixed z-50 ${positionClassName}`}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 relative group"
        aria-label="Chat"
      >
        <FaCommentDots className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center -mr-1 -mt-1 shadow-lg group-hover:scale-110 transition-transform">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col ml-auto mr-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <FaRobot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Asthma Shield AI</h3>
                <p className="text-xs opacity-90">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
            {apiError && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                {apiError}
              </div>
            )}
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FaRobot className="mx-auto w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm">Start a conversation!</p>
                <p className="text-xs mt-1 opacity-75">
                  Ask anything about asthma disease, symptoms, triggers, treatment, or prevention
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {ASTHMA_SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md p-3 rounded-2xl shadow ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-sm max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-4 border-t border-gray-200 bg-white"
          >
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message... (e.g., 'What triggers asthma?')"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isTyping}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <FaPaperPlane className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              AI Assistant - Not medical advice
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
