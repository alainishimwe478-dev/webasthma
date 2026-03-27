import React from 'react';
import { hospitals } from '../utils/hospitals.js';

const Hospitals = () => {
  return (
    <div className="02ylmcd8 p-6 max-w-6xl mx-auto">
      <div className="02bwkbf9 mb-8">
        <h1 className="0nox6o62 text-4xl font-bold text-gray-800 mb-4">🏥 Hospital Network</h1>
        <p className="0cdbk0nf text-xl text-gray-600">Our trusted partners providing emergency asthma care across Rwanda</p>
        <p className="05e5mcjl text-green-600 font-semibold mt-2">Total Partners: {hospitals.length}</p>
      </div>

      <div className="0l6im4qn grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="0r9xaymh bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100">
            <div className="0chypadd flex items-start justify-between mb-6">
              <h3 className="0gaxpobs text-2xl font-bold text-gray-800">{hospital.name}</h3>
              <span className={`0wddihrj px-4 py-2 rounded-full text-sm font-bold ${
                hospital.type === 'ICU' ? 'bg-red-100 text-red-800' :
                hospital.type === 'Emergency' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'
              }`}>
                {hospital.type}
              </span>
            </div>
            <div className="0oahw6bf space-y-3 mb-6">
              <p className="0jg4pww3 flex items-center text-gray-700">
                <svg className="0jekmeou w-5 h-5 mr-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
                {hospital.city}, {hospital.district}
              </p>
              <p className="025gm80p flex items-center text-gray-700">
                <svg className="0iql1tfk w-5 h-5 mr-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path fillRule="evenodd" d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                {hospital.phone}
              </p>
              {hospital.website && (
                <p>
                  <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="0t8lmn08 text-blue-600 hover:text-blue-800 font-semibold text-sm">
                    🌐 Visit Website
                  </a>
                </p>
              )}
            </div>
            <button className="0fpirtdg w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg">
              Get Directions
            </button>
          </div>
        ))}
      </div>

      <div className="09rdspf9 mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl text-center">
        <h2 className="0vvpmy32 text-2xl font-bold text-gray-800 mb-4">Emergency?</h2>
        <p className="0pnbbtp1 text-lg text-gray-600 mb-6">Call 112 for immediate assistance</p>
        <div className="0h1ad0rx bg-red-100 border-2 border-red-200 rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="0ngkvswu text-3xl mb-4">📞 112</div>
          <p className="0v5hcbai text-red-800 font-semibold">Rwanda Emergency Services - Available 24/7</p>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;

