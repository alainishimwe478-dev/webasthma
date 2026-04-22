import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Simple AI responses (in production, integrate with OpenAI or similar)
const responses = {
  greeting: [
    "Hello! I'm your asthma assistant. How can I help you today?",
    "Hi there! I'm here to help with your asthma management. What would you like to know?",
    "Welcome! I'm your AI assistant for asthma care. How can I assist you?"
  ],
  symptoms: [
    "If you're experiencing asthma symptoms, please consult your doctor immediately. In the meantime, use your rescue inhaler as prescribed.",
    "Common asthma symptoms include wheezing, shortness of breath, chest tightness, and coughing. Track these in your dashboard.",
    "Monitor your symptoms regularly. If they worsen, seek medical attention promptly."
  ],
  medication: [
    "Always take your medications as prescribed by your doctor. Don't stop or change doses without consulting them.",
    "Controller medications prevent symptoms, while rescue inhalers treat acute attacks. Use them correctly.",
    "Keep track of your medication usage in the app. Set reminders to stay on schedule."
  ],
  triggers: [
    "Common asthma triggers include pollen, dust mites, pet dander, smoke, and exercise. Identify and avoid yours.",
    "Check the environment section for current air quality and pollen levels in your area.",
    "Keep a trigger diary to identify patterns in your asthma symptoms."
  ],
  emergency: [
    "If you have a severe asthma attack, use your rescue inhaler immediately and call emergency services.",
    "Signs of a severe attack: difficulty breathing, blue lips, confusion, or inability to speak in full sentences.",
    "Have an asthma action plan from your doctor and share it with family members."
  ]
};

function getAIResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }

  if (lowerMessage.includes('symptom') || lowerMessage.includes('wheezing') || lowerMessage.includes('breath')) {
    return responses.symptoms[Math.floor(Math.random() * responses.symptoms.length)];
  }

  if (lowerMessage.includes('medication') || lowerMessage.includes('inhaler') || lowerMessage.includes('drug')) {
    return responses.medication[Math.floor(Math.random() * responses.medication.length)];
  }

  if (lowerMessage.includes('trigger') || lowerMessage.includes('pollen') || lowerMessage.includes('dust')) {
    return responses.triggers[Math.floor(Math.random() * responses.triggers.length)];
  }

  if (lowerMessage.includes('emergency') || lowerMessage.includes('attack') || lowerMessage.includes('severe')) {
    return responses.emergency[Math.floor(Math.random() * responses.emergency.length)];
  }

  return "I'm here to help with asthma-related questions. You can ask me about symptoms, medications, triggers, or general asthma management. For medical advice, please consult your doctor.";
}

// Chat with AI
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = getAIResponse(message);

    res.json({
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get health tips
router.get('/tips', authenticate, async (req, res) => {
  try {
    const tips = [
      "Take your controller medication daily, even when you feel well.",
      "Identify and avoid your asthma triggers.",
      "Keep your rescue inhaler with you at all times.",
      "Get your flu shot annually to prevent respiratory infections.",
      "Use a peak flow meter to monitor your lung function.",
      "Maintain a healthy weight and exercise regularly.",
      "Keep your home free of dust mites, mold, and pet dander.",
      "Avoid smoking and secondhand smoke.",
      "Learn proper inhaler technique from your doctor.",
      "Have an asthma action plan and review it regularly."
    ];

    // Return random 3 tips
    const randomTips = tips.sort(() => 0.5 - Math.random()).slice(0, 3);

    res.json({ tips: randomTips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;