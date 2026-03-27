import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa';

const HeroSection = ({ aqiData, prediction, loadingAQI, scrollToSection, heroTagline, heroTitle, heroSubtitle, heroSummary, heroSensorNote, heroStart, heroLearn }) => {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative min-h-[70vh] flex items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1600')",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div className="text-white space-y-6">
          <p className="uppercase tracking-[6px] text-cyan-300">
            {heroTagline}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            {heroTitle}
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed">
            {heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/login"
              className="bg-cyan-500 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition inline-flex items-center gap-2"
            >
              <FaArrowRight className="hidden md:inline" />
              {heroStart}
            </Link>
            <button
              onClick={() => scrollToSection('features')}
              className="border border-white px-8 py-4 rounded-full text-white hover:bg-white hover:text-black transition"
            >
              {heroLearn}
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-white shadow-2xl space-y-6">
          <div>
            <h3 className="uppercase tracking-[6px] text-cyan-300 mb-3">
              {t("hero.sensorTitle")}
            </h3>
            <h2 className="text-3xl font-bold">{t("hero.sensorName")}</h2>
          </div>
          <p className="text-lg">{heroSummary}</p>
          <div className="bg-cyan-500/20 rounded-2xl p-5">
            <div className="text-sm uppercase tracking-[2px] text-cyan-100">
              {t("intelligence.model") || 'Confidence'}
            </div>
            <p className="text-xl font-semibold">
              {(prediction?.confidence ?? 75) || 0}%
            </p>
          </div>
          <p className="bg-blue-900/40 rounded-2xl p-5 text-sm">
            {heroSensorNote}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

