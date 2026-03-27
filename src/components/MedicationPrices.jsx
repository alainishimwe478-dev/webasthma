import React, { useState } from 'react';
import { FaSearch, FaPills, FaMapMarkerAlt } from 'react-icons/fa';

const medications = [
  {
    id: 1,
    name: 'Salbutamol Inhaler',
    generic: 'Albuterol',
    dosage: '100mcg',
    form: 'Inhaler',
    price: 3500,
    pharmacy: 'Rwanda Pharmacy Ltd',
    location: 'Kigali',
  },
  {
    id: 2,
    name: 'Budesonide Inhaler',
    generic: 'Pulmicort',
    dosage: '200mcg',
    form: 'Inhaler',
    price: 12500,
    pharmacy: 'CHUK Pharmacy',
    location: 'Kigali',
  },
  {
    id: 3,
    name: 'Montelukast Tablets',
    generic: 'Singulair',
    dosage: '10mg',
    form: 'Tablet',
    price: 4500,
    pharmacy: 'Pharma Plus',
    location: 'Muhanga',
  },
  {
    id: 4,
    name: 'Fluticasone Inhaler',
    generic: 'Flixotide',
    dosage: '125mcg',
    form: 'Inhaler',
    price: 9800,
    pharmacy: 'Life Pharmacy',
    location: 'Kigali',
  },
  {
    id: 5,
    name: 'Theophylline Tablets',
    generic: 'Theolair',
    dosage: '300mg',
    form: 'Tablet',
    price: 2800,
    pharmacy: 'Kibuye Pharmacy',
    location: 'Karongi',
  },
];

const MedicationPrices = () => {
  const [search, setSearch] = useState('');
  const [selectedMed, setSelectedMed] = useState(null);

  const filtered = medications.filter((med) =>
    med.name.toLowerCase().includes(search.toLowerCase()) ||
    med.generic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Medication Prices</h1>
        <p className="text-gray-600">Compare prices for asthma medications across pharmacies in Rwanda.</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or generic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((med) => (
          <div
            key={med.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedMed(med)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{med.name}</h3>
                <p className="text-sm text-gray-500">
                  {med.generic} ? {med.dosage}
                </p>
              </div>
              <span className="text-lg font-bold text-blue-600">RWF {med.price.toLocaleString()}</span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <FaPills className="mr-1" />
              <span>{med.form}</span>
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <FaMapMarkerAlt className="mr-1" />
              <span>
                {med.pharmacy}, {med.location}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedMed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-2">{selectedMed.name}</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Generic Name:</strong> {selectedMed.generic}
              </p>
              <p>
                <strong>Dosage:</strong> {selectedMed.dosage}
              </p>
              <p>
                <strong>Form:</strong> {selectedMed.form}
              </p>
              <p>
                <strong>Price:</strong> RWF {selectedMed.price.toLocaleString()}
              </p>
              <p>
                <strong>Pharmacy:</strong> {selectedMed.pharmacy}
              </p>
              <p>
                <strong>Location:</strong> {selectedMed.location}
              </p>
            </div>
            <button
              onClick={() => setSelectedMed(null)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationPrices;
