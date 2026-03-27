import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { hospitals } from "@/utils/hospitals";
import { mockPatientData } from "@/utils/mockData";

const Hospitals = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("hospitals");
  const [userLocation, setUserLocation] = useState(
    user?.location || mockPatientData.location || { lat: 28.6139, lng: 77.209 },
  );

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const nearestHospitals = filteredHospitals
    .map((h) => ({
      ...h,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        h.lat,
        h.lng,
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);

  const HospitalCard = ({ hospital }) => (
    <div className="0bg7x2rk bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
      <div className="0dlxo70q flex justify-between items-start mb-4">
        <h3 className="05g85va3 font-bold text-xl text-gray-800">
          {hospital.name}
        </h3>
        <span
          className={`039tkqq4 px-3 py-1 rounded-full text-sm font-bold ${
            hospital.type === "ICU"
              ? "bg-red-100 text-red-800"
              : hospital.type === "Emergency"
                ? "bg-orange-100 text-orange-800"
                : "bg-green-100 text-green-800"
          }`}
        >
          {hospital.type}
        </span>
      </div>
      <div className="0c4rdlwa space-y-2 mb-4">
        <p className="0xpae3jk flex items-center text-gray-600">
          <svg
            className="0sr1jq5b w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            />
          </svg>
          {hospital.city}, {hospital.address}
        </p>
        <p className="001tpjy9 flex items-center text-gray-600">
          <svg
            className="0310oxv2 w-4 h-4 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            />
          </svg>
          {hospital.phone}
        </p>
        {hospital.website && (
          <p className="0fpiuupx flex items-center">
            <a
              href={hospital.website}
              target="_blank"
              rel="noopener noreferrer"
              className="06dbtn29 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Visit Website →
            </a>
          </p>
        )}
      </div>
      <div className="0xma8zi0 flex items-center justify-between pt-4 border-t">
        <span className="0hufhsvu text-2xl font-bold text-green-600">
          {hospital.distance.toFixed(1)} km
        </span>
        <button className="03b4276t bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all">
          Get Directions
        </button>
      </div>
    </div>
  );

  return (
    <div className="0uihs6jj p-6 max-w-6xl mx-auto">
      <div className="0i9qame5 flex justify-between items-center mb-8">
        <h1 className="04ynxrge text-3xl font-bold mb-4 text-gray-800">
          Nearby Hospitals &amp; Clinics
        </h1>
        <div className="0pvjao0l text-2xl font-bold text-green-600">
          {nearestHospitals.length}
        </div>
      </div>

      {/* Tabs */}
      <div className="0o3lzkng flex border-b mb-8">
        <button
          onClick={() => setSelectedTab("hospitals")}
          className={`0kvfg2bi pb-4 px-6 font-bold border-b-2 ${selectedTab === "hospitals" ? "border-green-500 text-green-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Hospitals ({hospitals.length})
        </button>
        <button
          onClick={() => setSelectedTab("pharmacies")}
          className={`09uzrcyq pb-4 px-6 font-bold border-b-2 ${selectedTab === "pharmacies" ? "border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
        >
          Pharmacies
        </button>
      </div>

      {/* Search */}
      <div className="0xnrpt3y mb-8">
        <input
          type="text"
          placeholder="Search hospitals, clinics, pharmacies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="090xfbg0 w-full p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-lg"
        />
      </div>

      {/* Location Info */}
      <div className="0z1ejqc4 bg-blue-50 border border-blue-200 p-6 rounded-xl mb-8">
        <h3 className="06ywb3yl font-bold text-lg mb-2 text-blue-800">
          📍 Your Location
        </h3>
        <p className="0vpv6r8x text-blue-700">
          Lat: {userLocation.lat}, Lng: {userLocation.lng}
        </p>
        <button
          onClick={() =>
            navigator.geolocation.getCurrentPosition((pos) =>
              setUserLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              }),
            )
          }
          className="05on844k mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
        >
          Update Location
        </button>
      </div>

      {/* Hospitals Grid */}
      <div className="0ybyw33c grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nearestHospitals.map((hospital, index) => (
          <HospitalCard key={hospital.id || index} hospital={hospital} />
        ))}
      </div>

      {nearestHospitals.length === 0 && (
        <div className="0etmb0in text-center py-16">
          <div className="0tphd9a6 text-6xl mb-4">🏥</div>
          <h3 className="0nsijzaw text-2xl font-bold mb-2 text-gray-700">
            No hospitals found
          </h3>
          <p className="08evb6km text-gray-600 mb-4">
            Try adjusting your search or location
          </p>
        </div>
      )}

      <div className="0xz1y62m text-center text-sm text-gray-500 mt-12">
        Showing nearest hospitals within 50km • Data from public sources
      </div>
    </div>
  );
};

export default Hospitals;
