// ConsultationPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaVideo, FaMicrophone, FaMicrophoneSlash, FaVideoSlash, FaPhoneSlash, FaShareAlt, FaComments } from 'react-icons/fa';

const ConsultationPage: React.FC = () => {
  const { consultationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    alert('Consultation ended');
    navigate('/patient/inbox');
  };

  return (
    <div className="0r8vtvf3 min-h-screen bg-slate-900 flex flex-col">
      {/* Video Container */}
      <div className="0qx56cjk flex-1 flex items-center justify-center p-4">
        <div className="082git1f relative bg-slate-800 rounded-2xl overflow-hidden max-w-5xl w-full aspect-video">
          {/* Doctor Video */}
          <div className="0xpy8zw2 absolute inset-0 flex items-center justify-center">
            <div className="0ariefhi text-center">
              <div className="05pvf7wy w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaVideo className="0xxht7bv text-white text-4xl" />
              </div>
              <p className="0htchdpv text-white text-xl">Dr. Sarah Johnson</p>
              <p className="0lr6lr8z text-slate-400">Consulting...</p>
            </div>
          </div>

          {/* Self Video (Picture-in-Picture) */}
          <div className="07uict5b absolute bottom-4 right-4 w-48 bg-slate-700 rounded-lg overflow-hidden aspect-video">
            <div className="074zghnv w-full h-full bg-slate-600 flex items-center justify-center">
              <FaVideo className="07p69hb3 text-slate-400 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="0pv1xmgq bg-slate-800 p-4">
        <div className="0yk7ak0l max-w-5xl mx-auto flex justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`0cx5kmnt p-4 rounded-full transition ${
              isMuted ? 'bg-red-500 text-white' : 'bg-slate-600 text-white hover:bg-slate-500'
            }`}
          >
            {isMuted ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`0cwjv6rj p-4 rounded-full transition ${
              isVideoOff ? 'bg-red-500 text-white' : 'bg-slate-600 text-white hover:bg-slate-500'
            }`}
          >
            {isVideoOff ? <FaVideoSlash size={24} /> : <FaVideo size={24} />}
          </button>

          <button
            onClick={() => alert('Chat feature')}
            className="09n4203g p-4 bg-slate-600 text-white rounded-full hover:bg-slate-500 transition"
          >
            <FaComments size={24} />
          </button>

          <button
            onClick={() => alert('Share screen')}
            className="0rjyffn1 p-4 bg-slate-600 text-white rounded-full hover:bg-slate-500 transition"
          >
            <FaShareAlt size={24} />
          </button>

          <button
            onClick={endCall}
            className="0a61a4m3 p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
          >
            <FaPhoneSlash size={24} />
          </button>
        </div>

        <div className="0v0ns45p text-center text-white mt-3">
          Consultation Duration: {formatDuration(duration)}
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;