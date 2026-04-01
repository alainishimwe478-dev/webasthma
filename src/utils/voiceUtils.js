import { useState, useEffect, useRef, useCallback } from 'react';

export const useVoiceRecognition = ({ continuous = false, lang = 'en-US' } = {}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognition);
    if (!SpeechRecognition) {
      setError('Voice recognition not supported in this browser. Use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Voice recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permission.');
      } else {
        setError(`Voice error: ${event.error}`);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [continuous, lang]);

  const startVoice = useCallback(async () => {
    if (!voiceSupported || !recognitionRef.current) {
      setError('Voice not supported');
      return false;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.start();
      return true;
    } catch (err) {
      console.error('Mic permission error:', err);
      setError('Microphone permission denied');
      return false;
    }
  }, [voiceSupported]);

  const stopVoice = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    transcript,
    isListening,
    error,
    voiceSupported,
    startVoice,
    stopVoice,
    setTranscript,
    setError
  };
};
