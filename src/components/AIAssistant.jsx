import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';

const AIAssistant = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your asthma assistant. I can help you understand triggers, manage symptoms, and remind you about medication. What would you like to know?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getBotResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('trigger')) {
      return "Common asthma triggers include pollen, dust mites, cold air, exercise, stress, and respiratory infections. Keeping a diary can help you identify your personal triggers.";
    } else if (lowerMsg.includes('inhaler') || lowerMsg.includes('medication')) {
      return "Make sure you use your inhaler correctly: shake it, breathe out fully, place the mouthpiece in your mouth, press down while inhaling deeply, and hold your breath for 10 seconds. Always carry your rescue inhaler.";
    } else if (lowerMsg.includes('attack')) {
      return "If you feel an asthma attack coming: sit up straight, take slow deep breaths, use your rescue inhaler (usually 1-2 puffs), and if symptoms don't improve after 10 minutes, seek emergency help. Call your doctor if you're unsure.";
    } else if (lowerMsg.includes('weather') || lowerMsg.includes('temperature') || lowerMsg.includes('humidity')) {
      return "Weather changes can affect asthma. Cold air can narrow airways, high humidity can increase mold and dust mites, and heat can worsen air pollution. Try to stay indoors during extreme conditions and wear a scarf in cold weather.";
    } else if (lowerMsg.includes('exercise')) {
      return "Exercise-induced asthma is common. Warm up before exercise, use your inhaler 15 minutes before activity if prescribed, and choose activities with short bursts of exertion (like swimming or walking).";
    } else if (lowerMsg.includes('pollen')) {
      return "Pollen is a strong trigger. Check daily pollen counts, keep windows closed, shower after being outdoors, and consider an antihistamine if recommended by your doctor.";
    } else if (lowerMsg.includes('diet') || lowerMsg.includes('food')) {
      return "Some foods can trigger asthma in sensitive people (e.g., sulfites in dried fruit, wine). A balanced diet with antioxidants (fruits, vegetables) may help reduce inflammation.";
    } else if (lowerMsg.includes('stress')) {
      return "Stress and anxiety can worsen asthma symptoms. Try deep breathing, meditation, or talking to a counselor. Relaxation techniques help prevent stress-induced flare-ups.";
    } else {
"I can give you tips on asthma triggers, inhaler use, managing attacks, weather effects, exercise, diet, and stress. Just ask! For urgent medical concerns, contact your doctor immediately.";
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Add user message
    setMessages(prev => [...prev, { text: trimmed, sender: 'user' }]);
    setInput('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botReply = getBotResponse(trimmed);
      setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="0fnx4h2o fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col h-96">
      {/* Header */}
      <div className="0ilbitck flex justify-between items-center p-3 bg-blue-600 text-white rounded-t-lg">
        <h3 className="0zq86szh font-semibold">Asthma Assistant</h3>
        <button onClick={onClose} className="06f79h87 text-white hover:text-gray-200">
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div className="0l1ars5r flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`03gldfsw flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`0ilhtd6z max-w-xs p-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="0k7a5qm7 p-3 border-t flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about asthma..."
          className="0fek0774 flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="056y9n6t bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          <FaPaperPlane size={12} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistant;
