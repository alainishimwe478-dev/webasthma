export const SYMPTOM_KEYWORDS = {
  high: [
    'wheezing', 'difficulty breathing', 'shortness of breath', 'severe', 'attack', 'emergency', 'cant breathe',
    'gasping', 'struggling'
  ],
  medium: [
    'chest tightness', 'tight chest', 'coughing', 'persistent cough', 'breathless', 'heavy breathing'
  ],
  low: [
    'mild cough', 'slight tightness', 'fatigue', 'tired'
  ]
};

export const parseSymptoms = (transcript, envData) => {
  const text = transcript.toLowerCase();
  let severity = 'low';

  if (SYMPTOM_KEYWORDS.high.some(kw => text.includes(kw))) severity = 'high';
  else if (SYMPTOM_KEYWORDS.medium.some(kw => text.includes(kw))) severity = 'medium';

  const envContext = envData ? 
    ` (Temp: ${envData.temperature}°C, Humidity: ${envData.humidity}%, AQI: ${envData.aqi})` : '';

  return {
    raw: transcript,
    severity,
    keywords: Object.entries(SYMPTOM_KEYWORDS)
      .flatMap(([level, kws]) => kws.filter(kw => text.includes(kw)).map(kw => `${kw}(${level})`)),
    envContext,
    timestamp: new Date().toLocaleString()
  };
};
