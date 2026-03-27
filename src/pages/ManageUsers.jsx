import React from "react";
import { FaUserMd, FaUserShield, FaUserInjured } from "react-icons/fa";
import AdminShell from "../components/Layout/AdminShell";
import { users } from "../utils/mockData";

const roleStyles = {
  admin: "bg-purple-50 text-purple-700",
  doctor: "bg-blue-50 text-blue-700",
  patient: "bg-emerald-50 text-emerald-700",
};

const roleIcons = {
  admin: FaUserShield,
  doctor: FaUserMd,
  patient: FaUserInjured,
};

const ManageUsers = () => (
  <AdminShell>
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">
          Review account roles, district assignments, and operational coverage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total accounts</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <p className="text-sm text-gray-500">Doctors</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {users.filter((user) => user.role === "doctor").length}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <p className="text-sm text-gray-500">Patients</p>
          <p className="text-3xl font-bold text-emerald-700 mt-2">
            {users.filter((user) => user.role === "patient").length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Directory</h2>
        </div>
        <div className="divide-y">
          {users.map((user) => {
            const Icon = roleIcons[user.role] || FaUserShield;
            return (
              <div
                key={user.id}
                className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Icon className="text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500">{user.district || "No district"}</span>
                  <span
                    className={`px-3 py-1 rounded-full font-medium ${roleStyles[user.role] || "bg-gray-50 text-gray-700"}`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </AdminShell>
);

export default ManageUsers;
