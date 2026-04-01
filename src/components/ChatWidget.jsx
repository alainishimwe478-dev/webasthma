import React, { useState, useEffect, useRef } from 'react';
import { RWANDA_DEFAULT_LOCATION } from '../utils/environmentAPI';

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const messagesEndRef = useRef(null);

  // Get user location on mount, fallback to Rwanda default
  useEffect(() => {
    getUserLocation();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
          // Add system message about detected location
          addSystemMessage(`📍 Location detected: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          console.warn('Location error:', error);
          setLocationError(error.message);
          // Fallback to Rwanda default location
          setUserLocation(RWANDA_DEFAULT_LOCATION);
          addSystemMessage(`📍 Using Rwanda default location (${RWANDA_DEFAULT_LOCATION.lat}, ${RWANDA_DEFAULT_LOCATION.lng})`);
        }
      );
    } else {
      setLocationError('Geolocation not supported');
      setUserLocation(RWANDA_DEFAULT_LOCATION);
      addSystemMessage(`📍 Using Rwanda default location (${RWANDA_DEFAULT_LOCATION.lat}, ${RWANDA_DEFAULT_LOCATION.lng})`);
    }
  };

  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'system',
      timestamp: new Date()
    }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, userLocation);
      const aiMsg = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (message, location) => {
    const locationText = location 
      ? `(${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
      : '(location unavailable)';
    
    // Check if message mentions location-related queries
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('weather') || lowerMsg.includes('climate')) {
      return `Based on your location ${locationText}, I can help with weather information for Rwanda. The coordinates ${RWANDA_DEFAULT_LOCATION.lat}, ${RWANDA_DEFAULT_LOCATION.lng} are set as the default Rwanda reference point.`;
    }
    
    if (lowerMsg.includes('where') || lowerMsg.includes('location')) {
      return `📍 You're currently at coordinates ${locationText}. The default Rwanda coordinates are (${RWANDA_DEFAULT_LOCATION.lat}, ${RWANDA_DEFAULT_LOCATION.lng}).`;
    }
    
    return `I see you're asking about "${message}". Using Rwanda's reference coordinates (${RWANDA_DEFAULT_LOCATION.lat}, ${RWANDA_DEFAULT_LOCATION.lng}), I can provide location-based assistance. Your current position is ${locationText}.`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="0ru5wpyf chat-widget-container">
      <div className="086tx063 chat-header">
        <h3>🌍 Rwanda Environmental Assistant</h3>
        {userLocation && (
          <div className="0dyckaiw location-badge">
            📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            {userLocation.lat === RWANDA_DEFAULT_LOCATION.lat && 
             userLocation.lng === RWANDA_DEFAULT_LOCATION.lng && 
             ' (Default)'}
          </div>
        )}
        {locationError && (
          <div className="0bljylvd location-error" title={locationError}>
            ⚠️ Using default location
          </div>
        )}
      </div>

      <div className="0in7hk2n messages-container">
        {messages.length === 0 ? (
          <div className="0nbu99yf welcome-message">
            <p>👋 Welcome! Ask me about:</p>
            <ul>
              <li>📍 Your current location</li>
              <li>🌤️ Weather in Rwanda</li>
              <li>🗺️ Rwanda's coordinates</li>
              <li>🌱 Environmental info</li>
            </ul>
            <small>Default location: {RWANDA_DEFAULT_LOCATION.lat}, {RWANDA_DEFAULT_LOCATION.lng}</small>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`02msei7h message ${msg.sender}`}>
              <div className="0sd0eac2 message-text">{msg.text}</div>
              <div className="0syaybf2 message-time">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="037mvisj message ai loading">
            <div className="0hqw8qfv typing-indicator">...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="047von50 input-container">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send)"
          rows="2"
        />
        <button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>

      <style jsx>{`
        .chat-widget-container {
          display: flex;
          flex-direction: column;
          height: 500px;
          width: 100%;
          max-width: 400px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .chat-header {
          padding: 12px;
          background: #2c5f2d;
          color: white;
          border-radius: 8px 8px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .chat-header h3 {
          margin: 0;
          font-size: 16px;
        }
        
        .location-badge, .location-error {
          font-size: 12px;
          background: rgba(255,255,255,0.2);
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .location-error {
          background: rgba(255,0,0,0.3);
          cursor: help;
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .welcome-message {
          text-align: center;
          color: #666;
          padding: 20px;
        }
        
        .welcome-message ul {
          text-align: left;
          display: inline-block;
        }
        
        .message {
          padding: 8px 12px;
          border-radius: 8px;
          max-width: 85%;
          animation: fadeIn 0.3s ease;
        }
        
        .message.user {
          background: #2c5f2d;
          color: white;
          align-self: flex-end;
        }
        
        .message.ai {
          background: #f0f0f0;
          color: #333;
          align-self: flex-start;
        }
        
        .message.system {
          background: #fff3cd;
          color: #856404;
          align-self: center;
          font-size: 12px;
          max-width: 90%;
        }
        
        .message-time {
          font-size: 10px;
          opacity: 0.7;
          margin-top: 4px;
        }
        
        .typing-indicator {
          padding: 4px 0;
        }
        
        .input-container {
          padding: 12px;
          border-top: 1px solid #ddd;
          display: flex;
          gap: 8px;
        }
        
        .input-container textarea {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: none;
          font-family: inherit;
        }
        
        .input-container button {
          padding: 8px 16px;
          background: #2c5f2d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .input-container button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
