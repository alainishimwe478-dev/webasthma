import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';

const pharmacies = [
  {
    id: 1,
    name: 'Rwanda Pharmacy Ltd',
    address: 'KN 4 Ave, Kigali',
    phone: '+250 788 123 456',
    hours: 'Mon-Sat 8am-8pm, Sun 9am-5pm',
    location: 'Kigali',
    coordinates: { lat: -1.9441, lng: 30.0619 },
  },
  {
    id: 2,
    name: 'CHUK Pharmacy',
    address: 'Kigali University Teaching Hospital',
    phone: '+250 788 234 567',
    hours: '24/7',
    location: 'Kigali',
  },
  {
    id: 3,
    name: 'Pharma Plus',
    address: 'Muhanga Center',
    phone: '+250 788 345 678',
    hours: 'Mon-Fri 8am-6pm, Sat 9am-4pm',
    location: 'Muhanga',
  },
  {
    id: 4,
    name: 'Life Pharmacy',
    address: 'Kigali Heights',
    phone: '+250 788 456 789',
    hours: 'Mon-Sat 9am-9pm, Sun 10am-6pm',
    location: 'Kigali',
  },
  {
    id: 5,
    name: 'Kibuye Pharmacy',
    address: 'Karongi District',
    phone: '+250 788 567 890',
    hours: 'Mon-Fri 8am-5pm',
    location: 'Karongi',
  },
  {
    id: 6,
    name: 'Musanze Pharmacy',
    address: 'Musanze Town',
    phone: '+250 788 678 901',
    hours: 'Mon-Sat 8am-6pm',
    location: 'Musanze',
  },
];

const PharmacyLocator = () => {
  const [search, setSearch] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  const filtered = pharmacies.filter((pharmacy) =>
    pharmacy.name.toLowerCase().includes(search.toLowerCase()) ||
    pharmacy.location.toLowerCase().includes(search.toLowerCase()) ||
    pharmacy.address.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, pharmacy) => {
    if (!acc[pharmacy.location]) acc[pharmacy.location] = [];
    acc[pharmacy.location].push(pharmacy);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pharmacy Locator</h1>
        <p className="text-gray-600">Find pharmacies near you in Rwanda.</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, location, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-center text-gray-500">No pharmacies found.</p>
      ) : (
        Object.entries(grouped).map(([location, items]) => (
          <div key={location} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              {location}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
                  onClick={() => setSelectedPharmacy(pharmacy)}
                >
                  <h3 className="font-semibold text-gray-800">{pharmacy.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{pharmacy.address}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <FaPhone className="mr-1" />
                    <span>{pharmacy.phone}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FaClock className="mr-1" />
                    <span>{pharmacy.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {selectedPharmacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-2">{selectedPharmacy.name}</h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Address:</strong> {selectedPharmacy.address}
              </p>
              <p>
                <strong>Phone:</strong> {selectedPharmacy.phone}
              </p>
              <p>
                <strong>Hours:</strong> {selectedPharmacy.hours}
              </p>
              <p>
                <strong>Location:</strong> {selectedPharmacy.location}
              </p>
            </div>
            <button
              onClick={() => setSelectedPharmacy(null)}
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

export default PharmacyLocator;
