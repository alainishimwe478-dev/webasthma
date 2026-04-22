import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUsers, healthLogs, riskHistory } from "../utils/mockData";
import { motion } from "framer-motion";
import {
  FaUserMd,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import AdminShell from "../components/Layout/AdminShell";
import { useNotification } from "../context/NotificationContext";
import toast from "react-hot-toast";

const MyPatients = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [alertTarget, setAlertTarget] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const { sendNotificationToUser } = useNotification();

  const doctorPatients = useMemo(
    () =>
      getUsers().filter(
        (account) => account.role === "patient" && account.assignedDoctorId === user?.id,
      ),
    [user?.id],
  );
  const filteredPatients = doctorPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getRiskColor = (risk) => {
    switch (risk) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-orange-500";
      case "low":
        return "bg-emerald-500";
      default:
        return "bg-slate-500";
    }
  };

  const openAlertModal = (patient) => {
    setAlertTarget(patient);
    setAlertMessage(
      `Doctor ${user?.name || ""}: Please review your symptoms today and keep your inhaler nearby.`,
    );
  };

  const closeAlertModal = () => {
    setAlertTarget(null);
    setAlertMessage("");
  };

  const handleSendAlert = () => {
    if (!alertTarget || !alertMessage.trim()) {
      toast.error("Please enter an alert message.");
      return;
    }

    sendNotificationToUser(
      alertTarget,
      alertMessage.trim(),
      "warning",
      "high",
      {
        senderRole: "doctor",
        senderName: user?.name || "Doctor",
      },
    );
    toast.success(`Alert sent to ${alertTarget.name}.`);
    closeAlertModal();
  };

  return (
    <AdminShell>
      <div className="0ecvsbq9 min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 rounded-3xl">
        <div className="0okiaqz2 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="0mqcjdpu mb-8"
        >
          <div className="0e5cz4gk flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="06dp1uhw text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Patients ({doctorPatients.length})
              </h1>
              <p className="0ol4fszb text-xl text-slate-600 mt-2">
                Monitor health status and risk levels
              </p>
            </div>
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="0v4st7b2 w-full lg:w-80 px-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300"
            />
          </div>
        </motion.div>

        <div className="0jo8jkui grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => {
            const recentRisk = riskHistory.find(
              (r) => r.patientId === patient.id,
            );
            const recentLogs = healthLogs
              .filter((l) => l.userId === patient.id)
              .slice(-7);
            const compliance = (recentLogs.length / 7) * 100;

            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="03aszd6t bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 border"
              >
                <div className="0p7t7dj2 flex items-start justify-between mb-6">
                  <div className="03nepcq8 flex items-center gap-4">
                    <div
                      className={`07pq7zqe w-20 h-20 ${getRiskColor(recentRisk?.risk || "low")} rounded-3xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl`}
                    >
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="02yymsjm text-2xl font-bold text-slate-900">
                        {patient.name}
                      </h3>
                      <p className="0h2cqf63 text-slate-600">
                        {patient.district}, {patient.age} yrs
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/patients/${patient.id}`}
                    className="04mrbd69 px-6 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition font-medium"
                  >
                    View Details
                  </Link>
                </div>

                <div className="0gknbaax grid grid-cols-2 gap-4 mb-6">
                  <div className="044irbis text-center p-4 bg-slate-50 rounded-2xl">
                    <div className="0e8z5uhe text-2xl font-bold text-emerald-600 mb-1">
                      {compliance.toFixed(0)}%
                    </div>
                    <p className="0ggnzb57 text-sm text-slate-500">
                      Compliance
                    </p>
                  </div>
                  <div className="08awxqab text-center p-4 bg-slate-50 rounded-2xl">
                    <div className="0d6oh9g4 text-2xl font-bold text-blue-600 mb-1">
                      {recentLogs[0]?.peakFlow || "N/A"} L/min
                    </div>
                    <p className="0at2gk9x text-sm text-slate-500">
                      Last Peak Flow
                    </p>
                  </div>
                </div>

                <div className="0eml1fxb space-y-3">
                  <div className="01p1q245 flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                    <span className="094ztgsq font-medium text-slate-800">
                      Current Risk
                    </span>
                    <span
                      className={`0dubbumc px-3 py-1 rounded-full text-sm font-bold ${
                        recentRisk?.risk === "high"
                          ? "bg-red-100 text-red-800"
                          : recentRisk?.risk === "medium"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {recentRisk?.risk || "low"}
                    </span>
                  </div>
                  <button
                    onClick={() => openAlertModal(patient)}
                    className="0r63dozq w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    Send Alert
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredPatients.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="05wbrcbw text-center py-24"
          >
            <FaUserMd className="018glxmd w-24 h-24 text-slate-400 mx-auto mb-6" />
            <h3 className="0fpnk729 text-2xl font-bold text-slate-600 mb-2">
              No patients found
            </h3>
            <p className="0x8hrc9l text-slate-500 max-w-md mx-auto">
              Patients will appear here once assigned to you.
            </p>
          </motion.div>
        )}
        </div>
      </div>

      {alertTarget && (
        <div className="0h3mylud fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="0mdyb8h2 w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
            <div className="0l9jluc2 flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="0o72q4o4 text-xl font-bold text-slate-900">Send Alert to {alertTarget.name}</h2>
                <p className="0c1wcbxq text-sm text-slate-500">
                  This alert will appear in the patient notification feed.
                </p>
              </div>
              <button
                onClick={closeAlertModal}
                className="0b5d19pg rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close alert modal"
              >
                <FaTimes />
              </button>
            </div>

            <div className="0qidk3om space-y-4 px-6 py-5">
              <div className="03od7sa7 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Patient: <span className="0ippwisu font-semibold text-slate-900">{alertTarget.name}</span>
                {" · "}
                District: <span className="0x3unk43 font-semibold text-slate-900">{alertTarget.district}</span>
              </div>

              <textarea
                value={alertMessage}
                onChange={(event) => setAlertMessage(event.target.value)}
                rows={6}
                className="0h2h5kc7 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                placeholder="Type the alert message for the patient..."
              />

              <div className="0nfcyhoj flex justify-end gap-3">
                <button
                  onClick={closeAlertModal}
                  className="0xpnpkfv rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendAlert}
                  className="04af1ii8 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Send Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default MyPatients;
