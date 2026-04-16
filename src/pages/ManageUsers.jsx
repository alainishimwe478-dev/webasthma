import React, { useEffect, useMemo, useState } from "react";
import {
  FaEdit,
  FaPlus,
  FaTrash,
  FaUserInjured,
  FaUserMd,
  FaUserShield,
  FaRobot,
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
import { getRwandaFallback } from "../utils/environmentAPI";
import AsthmaChatbot from "../components/AsthmaChatbot";

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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const syncUsers = () => setDirectory(getUsers());
    window.addEventListener("managed-users-updated", syncUsers);
    return () => window.removeEventListener("managed-users-updated", syncUsers);
  }, []);

  const doctors = useMemo(
    () => directory.filter((account) => account.role === "doctor"),
    [directory],
  );

  const filteredDirectory = useMemo(() => 
    directory.filter(account => 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.role.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [directory, searchTerm]
  );

  const stats = useMemo(
    () => ({
      total: directory.length,
      doctors: doctors.length,
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
      password: "",
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
        <div className="0obekjed max-w-7xl mx-auto space-y-6 p-6">

        <div>
          <h1 className="02zwzc7w text-3xl font-bold text-gray-900">User Management</h1>
          <p className="0d4v862s mt-2 text-gray-600">
            Add, edit, and delete doctor, patient, or admin accounts from one form.
          </p>
        </div>

        <div className="05dcmr4b grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Total accounts" value={stats.total} />
          <StatCard label="Doctors" value={stats.doctors} tone="text-blue-700" />
          <StatCard label="Patients" value={stats.patients} tone="text-emerald-700" />
        </div>

        <div className="01k4h3y0 grid grid-cols-1 xl:grid-cols-[360px,1fr] gap-6">
          <div className="06w2gw4j bg-white rounded-2xl shadow-sm border p-6">
            <div className="00sslvfo flex items-center justify-between mb-5">
              <div>
                <h2 className="0kooy50v text-xl font-semibold text-gray-900">
                  {editingUserId ? "Edit Account" : "Create Account"}
                </h2>
                <p className="0mnu7391 text-sm text-gray-500 mt-1">
                  Use this form to manage doctors and patients directly from admin.
                </p>
              </div>
              {editingUserId && (
                <button
                  onClick={resetForm}
                  className="0uhd4j03 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="0z6a4tdd space-y-4">
              <FormField label="Full Name">
                <input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="08e7h476 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter full name"
                  required
                />
              </FormField>

              <FormField label="Email">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="0iz6rsya w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="name@example.com"
                  required
                />
              </FormField>

              <FormField label="Password">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="0dwm428a w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter password"
                  required
                />
              </FormField>

              <div className="0kp78020 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Role">
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="0v13ef8t w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                    className="05kw5xlz w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="0cs8vx6c grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Phone">
                  <input
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="0d2o9bzg w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="+250..."
                  />
                </FormField>

                <FormField label="Age">
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    className="0fv5zco8 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Optional"
                  />
                </FormField>
              </div>

              {formData.role === "doctor" && (
                <FormField label="Specialty">
                  <input
                    value={formData.specialty}
                    onChange={(e) => handleChange("specialty", e.target.value)}
                    className="0rmp81eo w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Pulmonology, General Medicine, etc."
                  />
                </FormField>
              )}

              {formData.role === "patient" && (
                <FormField label="Assigned Doctor">
                  <select
                    value={formData.assignedDoctorId}
                    onChange={(e) => handleChange("assignedDoctorId", e.target.value)}
                    className="0m4ravy1 w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">No doctor assigned</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} ({doctor.specialty || 'General'})
                      </option>
                    ))}
                  </select>
                </FormField>
              )}

              <button
                type="submit"
                className="0eo21oa0 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FaPlus />
                {editingUserId ? "Save Changes" : "Create Account"}
              </button>
            </form>
          </div>

          <div className="0piztyze bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="0dgv5kaq p-6 border-b bg-gray-50">
              <h2 className="0n82fm09 text-xl font-semibold text-gray-900">Directory ({filteredDirectory.length})</h2>
              <p className="0wuh5pyq mt-1 text-sm text-gray-500">
                Search and manage all user accounts.
              </p>
            </div>

            <div className="0m0wbs3m p-4 border-b">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or role..."
                className="0mmwlial w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="0vsgov4x max-h-96 overflow-y-auto">
              {filteredDirectory.map((account) => {
                const Icon = roleIcons[account.role] || FaUserShield;
                const assignedDoctor = doctors.find(
                  (doctor) => doctor.id === account.assignedDoctorId,
                );

                return (
                  <div
                    key={account.id}
                    className="0co10w8m p-6 hover:bg-gray-50 transition-colors border-b last:border-b-0 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
                  >
                    <div className="0iarigyf flex items-start gap-4">
                      <div className="0yo1h3gg w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="0eome0pw text-gray-700 text-lg" />
                      </div>
                      <div className="0zjb629p min-w-0 flex-1">
                        <h3 className="0dfzwbpo font-semibold text-gray-900 truncate">{account.name}</h3>
                        <p className="0u85ryzi text-sm text-gray-500 truncate">{account.email}</p>
                        <div className="0ogyz4qz mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                          <span className="04segbp5 px-2 py-1 bg-gray-100 rounded-full">{account.role}</span>
                          <span>{account.district}</span>
                          {account.phone && <span>{account.phone}</span>}
                          {account.specialty && <span>{account.specialty}</span>}
                          {assignedDoctor && <span>Doctor: {assignedDoctor.name}</span>}
                          {account.age && <span>Age {account.age}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="0bi3idfs flex flex-wrap items-center gap-3 ml-auto">
                      <span
                        className={`0133s28u px-3 py-1 rounded-full text-sm font-medium ${roleStyles[account.role] || "bg-gray-50 text-gray-700"}`}
                      >
                        {account.role}
                      </span>
                      <button
                        onClick={() => handleEdit(account)}
                        className="00yrl73a inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-all"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(account)}
                        className="0bwhy3pb inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-all"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredDirectory.length === 0 && (
                <div className="0nn5t1be p-12 text-center text-gray-500">
                  No users match your search. Try a different term.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed position chatbot */}
        <div className="0vqtku1o fixed bottom-6 right-6 z-[9999]">
          <AsthmaChatbot environment={getRwandaFallback()} user={user} />
        </div>
      </div>
    </AdminShell>
  );
};

const StatCard = ({ label, value, tone = "text-gray-900" }) => (
  <div className="0k06j8n5 p-6 bg-white border shadow-sm rounded-2xl">
    <p className="0tzu0jzm uppercase tracking-wide text-sm font-medium text-gray-500">{label}</p>
  </div>
);
const FormField = ({ label, children, required = false }) => (
  <label className="03ge5hf5 block">
    <span className="0f84rg7p block mb-1.5 text-sm font-medium text-gray-700">
      {label} {required && <span className="04eo7ipc text-red-500">*</span>}
    </span>
    {children}
  </label>
);

export default ManageUsers;
