import React, { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaPlus,
  FaTrash,
  FaUserInjured,
  FaUserMd,
  FaUserShield,
} from "react-icons/fa";
import toast from "react-hot-toast";
import AdminShell from "../components/Layout/AdminShell";
import { useAuth } from "../context/AuthContext";
import {
  addManagedUser,
  deleteManagedUser,
  getUsers,
  updateManagedUser,
} from "../utils/mockData";

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

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "patient",
  district: "Kigali",
  phone: "",
  age: "",
  specialty: "",
  assignedDoctorId: "",
};

const districts = ["Kigali", "Muhanga", "Rubavu", "Huye", "Musanze", "Nyamagabe"];

const ManageUsers = () => {
  const { user, updateUser, logout } = useAuth();
  const [directory, setDirectory] = useState(() => getUsers());
  const [formData, setFormData] = useState(emptyForm);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    const syncUsers = () => setDirectory(getUsers());
    window.addEventListener("managed-users-updated", syncUsers);
    return () => window.removeEventListener("managed-users-updated", syncUsers);
  }, []);

  const doctors = useMemo(
    () => directory.filter((account) => account.role === "doctor"),
    [directory],
  );

  const stats = useMemo(
    () => ({
      total: directory.length,
      doctors: directory.filter((account) => account.role === "doctor").length,
      patients: directory.filter((account) => account.role === "patient").length,
    }),
    [directory],
  );

  const resetForm = () => {
    setEditingUserId(null);
    setFormData(emptyForm);
  };

  const handleChange = (field, value) => {
    setFormData((currentForm) => ({
      ...currentForm,
      [field]: value,
      ...(field === "role" && value !== "patient" ? { assignedDoctorId: "" } : {}),
      ...(field === "role" && value !== "doctor" ? { specialty: "" } : {}),
    }));
  };

  const handleEdit = (account) => {
    setEditingUserId(account.id);
    setFormData({
      name: account.name || "",
      email: account.email || "",
      password: account.password || "",
      role: account.role || "patient",
      district: account.district || "Kigali",
      phone: account.phone || "",
      age: account.age ? String(account.age) : "",
      specialty: account.specialty || "",
      assignedDoctorId: account.assignedDoctorId ? String(account.assignedDoctorId) : "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (account) => {
    if (!window.confirm(`Delete ${account.name} (${account.role})?`)) {
      return;
    }

    deleteManagedUser(account.id);
    setDirectory(getUsers());

    if (editingUserId === account.id) {
      resetForm();
    }

    if (user?.id === account.id) {
      toast.success("Your account was deleted. Logging out.");
      logout();
      return;
    }

    toast.success("Account deleted successfully.");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const trimmedPassword = formData.password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      toast.error("Name, email, and password are required.");
      return;
    }

    const duplicateEmail = directory.find(
      (account) =>
        account.email?.toLowerCase() === trimmedEmail && account.id !== editingUserId,
    );

    if (duplicateEmail) {
      toast.error("That email is already used by another account.");
      return;
    }

    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
      role: formData.role,
      district: formData.district,
      phone: formData.phone.trim(),
      ...(formData.age ? { age: Number(formData.age) } : {}),
      ...(formData.role === "doctor" && formData.specialty.trim()
        ? { specialty: formData.specialty.trim() }
        : {}),
      ...(formData.role === "patient" && formData.assignedDoctorId
        ? { assignedDoctorId: Number(formData.assignedDoctorId) }
        : {}),
      ...(formData.role === "patient"
        ? {
            location: formData.district,
            chronicDiseases: ["asthma"],
            triggerProfile: ["pollen"],
            medicationRegimen: [],
          }
        : {}),
    };

    if (editingUserId) {
      updateManagedUser(editingUserId, payload);
      if (user?.id === editingUserId) {
        updateUser(payload);
      }
      toast.success("Account updated successfully.");
    } else {
      addManagedUser(payload);
      toast.success("Account created successfully.");
    }

    setDirectory(getUsers());
    resetForm();
  };

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            Add, edit, and delete doctor, patient, or admin accounts from one form.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total accounts" value={stats.total} tone="text-gray-900" />
          <StatCard label="Doctors" value={stats.doctors} tone="text-blue-700" />
          <StatCard label="Patients" value={stats.patients} tone="text-emerald-700" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[360px,1fr] gap-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingUserId ? "Edit Account" : "Create Account"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Use this form to manage doctors and patients directly from admin.
                </p>
              </div>
              {editingUserId && (
                <button
                  onClick={resetForm}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Full Name">
                <input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter full name"
                />
              </FormField>

              <FormField label="Email">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="name@example.com"
                />
              </FormField>

              <FormField label="Password">
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter password"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Role">
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </FormField>

                <FormField label="District">
                  <select
                    value={formData.district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Phone">
                  <input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="+250..."
                  />
                </FormField>

                <FormField label="Age">
                  <input
                    type="number"
                    min="0"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Optional"
                  />
                </FormField>
              </div>

              {formData.role === "doctor" && (
                <FormField label="Specialty">
                  <input
                    value={formData.specialty}
                    onChange={(e) => handleChange("specialty", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Pulmonology"
                  />
                </FormField>
              )}

              {formData.role === "patient" && (
                <FormField label="Assigned Doctor">
                  <select
                    value={formData.assignedDoctorId}
                    onChange={(e) => handleChange("assignedDoctorId", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">No doctor assigned</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              )}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <FaPlus />
                {editingUserId ? "Save Changes" : "Create Account"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Directory</h2>
              <p className="mt-1 text-sm text-gray-500">
                Edit or delete accounts directly from this admin table.
              </p>
            </div>

            <div className="divide-y">
              {directory.map((account) => {
                const Icon = roleIcons[account.role] || FaUserShield;
                const assignedDoctor = doctors.find(
                  (doctor) => doctor.id === account.assignedDoctorId,
                );

                return (
                  <div
                    key={account.id}
                    className="p-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <Icon className="text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-500">{account.email}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                          <span>{account.district || "No district"}</span>
                          {account.phone && <span>{account.phone}</span>}
                          {account.specialty && <span>{account.specialty}</span>}
                          {assignedDoctor && <span>Doctor: {assignedDoctor.name}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${roleStyles[account.role] || "bg-gray-50 text-gray-700"}`}
                      >
                        {account.role}
                      </span>
                      <button
                        onClick={() => handleEdit(account)}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(account)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
};

const StatCard = ({ label, value, tone }) => (
  <div className="bg-white rounded-2xl shadow-sm border p-6">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-3xl font-bold mt-2 ${tone}`}>{value}</p>
  </div>
);

const FormField = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
    {children}
  </label>
);

export default ManageUsers;
