import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner, FaSun, FaTint, FaWind, FaCloudRain, FaLeaf, FaExclamationTriangle, FaExternalLinkAlt } from 'react-icons/fa';
import { asthmaKnowledgeBase } from '../../utils/asthmaKnowledgeBase';

const AsthmaChatbot = ({ symptoms = [], goToSymptomsPage, goToEnvironmentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const messagesEndRef = useRef(null);

  const climateData = {
    current: {
      temperature: 26,
      feelsLike: 28,
      humidity: 65,
      windSpeed: 12,
      rainfall: 2,
      pollenCount: 'Medium',
      condition: 'partly_cloudy'
    },
    forecast: [
      { day: 'Mon', high: 27, low: 19, sun: 70, rain: 20, condition: 'sunny' },
      { day: 'Tue', high: 25, low: 18, sun: 60, rain: 40, condition: 'rainy' },
      { day: 'Wed', high: 28, low: 20, sun: 80, rain: 10, condition: 'sunny' },
      { day: 'Thu', high: 24, low: 17, sun: 50, rain: 60, condition: 'stormy' },
      { day: 'Fri', high: 29, low: 21, sun: 85, rain: 5, condition: 'sunny' }
    ],
    climateTrends: {
      temperatureIncrease: 1.2,
      extremeWeatherEvents: '↑ 30%',
      pollenSeason: '↑ 2 weeks',
      rainfallPatterns: 'Unpredictable'
    },
    alerts: [
      'High pollen today - take antihistamine if needed',
      'Thunderstorm asthma risk this afternoon'
    ]
  };

  const getAsthmaRiskLevel = () => {
    const humidity = climateData.current.humidity;
    const temp = climateData.current.temperature;

    if (humidity > 70 || temp > 30) return { level: 'High', color: 'red' };
    if (humidity > 60 || temp > 28) return { level: 'Medium', color: 'yellow' };
    return { level: 'Low', color: 'green' };
  };

  const getWeatherIcon = (condition) => {
    if (condition.includes('sun')) return '☀️';
    if (condition.includes('rain')) return '🌧️';
    if (condition.includes('storm')) return '⛈️';
    return '⛅';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (msg) => {
    msg = msg.toLowerCase();

    if (msg.includes('environment') || msg.includes('weather') || msg.includes('climate')) {
      return '#environment **Current Environment Status:**\n\n' +
        `🌡️ **Temperature:** ${climateData.current.temperature}°C (feels like ${climateData.current.feelsLike}°C)\n` +
        `💧 **Humidity:** ${climateData.current.humidity}% (high humidity increases triggers)\n` +
        `💨 **Wind:** ${climateData.current.windSpeed} km/h\n` +
        `🌿 **Pollen:** ${climateData.current.pollenCount}\n\n` +
        `**Risk Level: ${getAsthmaRiskLevel().level}** - Type "forecast" for 5-day view.`;
    }

    if (msg.includes('symptoms') || msg.includes('recent') || msg.includes('today')) {
      let symptomResponse = '**Recent Activity Summary:**\n\n';
      const recentSymptoms = symptoms.slice(-10);
      
      if (recentSymptoms.length > 0) {
        symptomResponse += `📊 **Last ${recentSymptoms.length} entries:**\n\n`;
        recentSymptoms.slice(0, 3).forEach(symptom => {
          symptomResponse += `• ${symptom.timestamp ? new Date(symptom.timestamp).toLocaleDateString() : 'Recent'}: Medication/symptom logged\n`;
        });
        symptomResponse += '\n💡 **View full history:** Type "symptoms history" or click the symptoms link above.\n';
      }
      
      symptomResponse += '\nTrack your symptoms daily for better management!';
      return symptomResponse;
    }

    if (msg.includes('action plan') || msg.includes('zone') || msg.includes('peak flow')) {
      const greenZone = asthmaKnowledgeBase.action_plan?.green || 'All good - continue normal activity and maintenance medications';
      const yellowZone = asthmaKnowledgeBase.action_plan?.yellow || 'Caution - increase quick-relief medication, monitor closely';
      const redZone = asthmaKnowledgeBase.action_plan?.red || 'Medical alert - seek emergency treatment immediately';
      return '**Asthma Action Plan Zones:**\n\n🟢 **Green Zone (80-100%):** ' + greenZone + '\n\n🟡 **Yellow Zone (50-79%):** ' + yellowZone + '\n\n🔴 **Red Zone (<50%):** ' + redZone + '\n\nWhat is your current peak flow reading?';
    }

    if (msg.includes('peak flow') || msg.includes('monitor')) {
      return '**Peak Flow Monitoring:**\n\n📏 **How to measure:**\n1. Stand up straight\n2. Take deepest breath possible\n3. Blast out as hard and fast as you can\n4. Do 3 times, record the highest\n\n📊 **Personal best:** Find your best reading when feeling well\n🎯 **Zones:** Green (80-100%), Yellow (50-80%), Red (<50%)\n\nTrack daily to predict attacks 12-24 hours in advance!';
    }

    return 'I can help with asthma management, climate monitoring, symptoms tracking, action plans, and peak flow. Try asking about weather, symptoms, or your action plan!';
  };

  const getDayAdvice = (day) => {
    if (day.rain > 70) return 'High rain - thunderstorm asthma risk possible';
    if (day.sun > 80) return 'High UV - stay hydrated, limit peak sun exposure';
    if (day.condition === 'stormy') return 'Storm alert - stay indoors, monitor air quality';
    if (day.high > 30) return 'Heat warning - high ozone levels possible';
    return 'Moderate conditions - normal precautions advised';
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    setTimeout(() => {
      const responseText = getBotResponse(input);
      const botResponse = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      if (responseText.includes('#environment')) {
        botResponse.hasEnvironmentLink = true;
      }
      if (responseText.includes('#symptoms')) {
        botResponse.hasSymptomsLink = true;
      }
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (msg) => {
    if (msg.text.includes('#environment') || msg.hasEnvironmentLink) {
      return (
        <div className="0eew7abp flex flex-col space-y-2">
          <p className="0e8hjweu text-sm whitespace-pre-wrap">{msg.text.replace('#environment', '')}</p>
          <button
            onClick={goToEnvironmentPage}
            className="0s8n5o45 inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-all"
          >
            <FaExternalLinkAlt className="0aa9f42q text-xs" />
            Open Environment Dashboard
          </button>
        </div>
      );
    }
    
    if (msg.text.includes('#symptoms') || msg.hasSymptomsLink) {
      return (
        <div className="0p3kcede flex flex-col space-y-2">
          <p className="0y3buxuz text-sm whitespace-pre-wrap">{msg.text.replace('#symptoms', '')}</p>
          <button
            onClick={goToSymptomsPage}
            className="0aj7mxbq inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-all"
          >
            <FaExternalLinkAlt className="0cce86d4 text-xs" />
            View Symptoms History
          </button>
        </div>
      );
    }
    
    return <p className="07v5p9lw text-sm whitespace-pre-wrap">{msg.text}</p>;
  };

  const bubbleClass = (sender) => {
    return sender === 'user' 
      ? 'max-w-[80%] p-3 rounded-2xl bg-purple-600 text-white rounded-br-none ml-auto' 
      : 'max-w-[80%] p-3 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-sm';
  };

  // Climate Dashboard Component
  const ClimateDashboard = () => {
    const risk = getAsthmaRiskLevel();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="0qxc8vw8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-4 shadow-lg"
      >
        <div className="0nnxvxd2 flex justify-between items-center mb-3">
          <h4 className="09u01bk3 font-bold text-gray-800 flex items-center gap-2">
            <FaSun className="0u3amhgy text-yellow-500" />
            Climate & Weather Dashboard
          </h4>
          <span className={'0mspi41c text-xs px-2 py-1 rounded-full bg-' + risk.color + '-100 text-' + risk.color + '-700'}>
            Risk: {risk.level}
          </span>
        </div>

        {/* Current Weather */}
        <div className="0fncoba2 bg-white rounded-lg p-3 mb-3">
          <div className="08upvzj0 flex justify-between items-center">
            <div className="0w0s3stw text-center">
              {getWeatherIcon(climateData.current.condition)}
              <div className="06d09lfk text-2xl font-bold mt-1">{climateData.current.temperature}°C</div>
              <div className="0h7rbn8w text-xs text-gray-600">Feels like {climateData.current.feelsLike}°C</div>
            </div>
            <div className="0qconn33 flex-1 ml-4">
              <div className="0j4klpa8 grid grid-cols-2 gap-2 text-xs">
                <div className="03yjir52 flex items-center gap-1">
                  <FaTint className="0rmk7s3w text-blue-500" />
                  <span>{climateData.current.humidity}%</span>
                </div>
                <div className="0lrkmmoc flex items-center gap-1">
                  <FaWind className="0kyqjgtv text-gray-500" />
                  <span>{climateData.current.windSpeed} km/h</span>
                </div>
                <div className="0zyiffcv flex items-center gap-1">
                  <FaCloudRain className="02ch4uy6 text-blue-500" />
                  <span>{climateData.current.rainfall} mm</span>
                </div>
                <div className="0kgjw9vh flex items-center gap-1">
                  <FaLeaf className="088yirnq text-green-500" />
                  <span>Pollen: {climateData.current.pollenCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="0xj6z3z6 mb-3">
          <div className="0kczvh9e flex justify-between items-center mb-2">
            <span className="0a6y2ut3 text-sm font-semibold">5-Day Forecast</span>
            <FaExclamationTriangle className="0d4b0qr6 text-yellow-500 text-xs" />
          </div>
          <div className="04ulcywf grid grid-cols-5 gap-1">
            {climateData.forecast.map((day, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={'0e9f3jwb text-center p-2 rounded-lg cursor-pointer transition-all ' +
                  (selectedDay === idx ? 'bg-purple-100 shadow-md' : 'hover:bg-gray-100')}
              >
                <div className="09lzot46 text-xs font-semibold">{day.day.substring(0, 3)}</div>
                <div className="0n7bz4yf text-lg">
                  {day.condition === 'sunny' ? '☀️' : day.condition === 'rainy' ? '🌧️' : day.condition === 'stormy' ? '⛈️' : '⛅'}
                </div>
                <div className="0lep3kx2 text-xs">{day.high}°</div>
                <div className="0ftx8pbm text-xs text-gray-500">{day.low}°</div>
                <div className="0wdczsb6 text-xs flex justify-center gap-1 mt-1">
                  <span>☀️{day.sun}%</span>
                  <span>🌧️{day.rain}%</span>
                </div>
              </div>
            ))}
          </div>
          {selectedDay !== null && (
            <div className="0psl8vcb mt-2 text-xs text-center text-gray-600 bg-white rounded-lg p-2">
              {getDayAdvice(climateData.forecast[selectedDay])}
            </div>
          )}
        </div>

        {/* Climate Change Indicators */}
        <div className="01npo37u border-t border-gray-200 pt-3">
          <div className="05i7mlfb flex items-center gap-2 mb-2">
            <FaExclamationTriangle className="06bf21t1 text-red-500 text-sm" />
            <span className="0hguvyvg text-sm font-semibold">Climate Change Impact</span>
          </div>
          <div className="02mme96q grid grid-cols-2 gap-2 text-xs">
            <div className="0redi3fc bg-red-50 rounded p-2">
              <div className="0j35cr5b font-semibold">🌡️ +{climateData.climateTrends.temperatureIncrease}°C</div>
              <div className="0xn3scnk text-gray-600">Temperature rise</div>
            </div>
            <div className="0smesdqd bg-orange-50 rounded p-2">
              <div className="04k7v8a6 font-semibold">{climateData.climateTrends.extremeWeatherEvents}</div>
              <div className="0puwbty6 text-gray-600">Extreme events</div>
            </div>
            <div className="05hv7bad bg-yellow-50 rounded p-2">
              <div className="04cuf7sy font-semibold">{climateData.climateTrends.pollenSeason}</div>
              <div className="0nrgxf56 text-gray-600">Longer pollen season</div>
            </div>
            <div className="0vobz7p5 bg-blue-50 rounded p-2">
              <div className="00pwg0np font-semibold">{climateData.climateTrends.rainfallPatterns}</div>
              <div className="0upb4r8q text-gray-600">Rain patterns</div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {climateData.alerts.length > 0 && (
          <div className="0pm7y2tt mt-3 bg-yellow-50 border-l-4 border-yellow-400 rounded p-2">
            <div className="0tpeonwq flex items-start gap-2">
              <FaExclamationTriangle className="0px9qbb7 text-yellow-600 text-sm mt-0.5" />
              <div>
                <div className="0li6ydtp text-xs font-semibold">Active Alerts</div>
                <div className="01pdjj8a text-xs text-gray-700">
                  {climateData.alerts.map((alert, idx) => (
                    <div key={idx}>• {alert}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="0i7wacsb fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl border-4 border-white flex items-center justify-center z-50 hover:scale-105 active:scale-95"
        style={{ bottom: '100px' }}
      >
        <FaRobot className="0cwfy6k9 text-2xl" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="0knyxxja fixed bottom-32 right-8 w-96 h-[650px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="02ty0h44 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex justify-between items-center">
              <div className="0klk7rud flex items-center gap-2">
                <FaRobot className="0blew9ib text-xl" />
                <div>
                  <h3 className="0w6iv8mq font-bold">Asthma Assistant</h3>
                  <p className="011uh5pk text-xs opacity-90">24/7 - Climate & Health Monitor</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="015v76w6 hover:bg-white/20 rounded-full p-1 transition-all"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="0lpp1sh1 flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              <ClimateDashboard />
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={'0c6y26y3 flex ' + (msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div className={bubbleClass(msg.sender)}>
                    {renderMessage(msg)}
                    <span className="0rsw7v22 text-xs opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="0gcdppij flex justify-start">
                  <div className="0290zki0 bg-white p-3 rounded-2xl shadow-sm">
                    <FaSpinner className="0loqoq2r animate-spin text-purple-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="0mif84s6 p-4 bg-white border-t border-gray-200">
              <div className="0da3v0bp flex gap-2 mb-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about asthma, climate, medications, triggers..."
                  className="0pdxharu flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="0796l526 bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  <FaPaperPlane />
                </button>
              </div>
              <div className="08wwf1aj flex gap-2 text-xs mb-2">
                <button
                  onClick={goToEnvironmentPage}
                  className="0i8o1kkx flex-1 bg-purple-50 text-purple-600 py-1 rounded-lg hover:bg-purple-100 transition-all"
                >
                  📊 Environment Data
                </button>
                <button
                  onClick={goToSymptomsPage}
                  className="00wr0nek flex-1 bg-green-50 text-green-600 py-1 rounded-lg hover:bg-green-100 transition-all"
                >
                  📋 Symptoms History
                </button>
                <button
                  onClick={() => {
                    setInput('weather');
                    handleSend();
                  }}
                  className="0fjp03dw flex-1 bg-blue-50 text-blue-600 py-1 rounded-lg hover:bg-blue-100 transition-all"
                >
                  🌤️ Weather Update
                </button>
              </div>
              <p className="0vubhi0i text-xs text-gray-500 mt-2 text-center">
                Not for emergencies. Call emergency services for urgent care.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AsthmaChatbot;

