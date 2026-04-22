// AddPatientForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { users } from '../utils/mockData';
import { motion } from 'framer-motion';
import {
  FaUserPlus,
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaNotesMedical,
  FaShieldAlt,
  FaHeartbeat,
  FaLungs,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaUpload,
  FaSave,
  FaUserMd,
} from 'react-icons/fa';

interface FormData {
  name: string;
  age: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  district: string;
  phone: string;
  email: string;
  emergencyContact: string;
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  previousHospitalizations: string;
  familyHistory: string;
  assignedDoctorId: string;
}

interface ValidationErrors {
  name?: string;
  age?: string;
  location?: string;
  phone?: string;
}

const AddPatientForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    district: '',
    phone: '',
    email: '',
    emergencyContact: '',
    bloodGroup: '',
    allergies: '',
    chronicConditions: '',
    previousHospitalizations: '',
    familyHistory: '',
    assignedDoctorId: user?.id || '',
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<'basic' | 'medical' | 'contact'>('basic');

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Patient name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        newErrors.age = 'Please enter a valid age (0-120)';
      }
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.phone && !/^[\d\s\-+()]{8,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPatient = {
        id: `patient_${Date.now()}`,
        role: 'patient',
        name: formData.name,
        age: parseInt(formData.age),
        dateOfBirth: formData.dateOfBirth || undefined,
        gender: formData.gender || undefined,
        location: formData.location,
        district: formData.district || formData.location,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        emergencyContact: formData.emergencyContact || undefined,
        bloodGroup: formData.bloodGroup || undefined,
        allergies: formData.allergies || undefined,
        chronicConditions: formData.chronicConditions || undefined,
        previousHospitalizations: formData.previousHospitalizations || undefined,
        familyHistory: formData.familyHistory || undefined,
        assignedDoctorId: formData.assignedDoctorId,
        createdAt: new Date().toISOString(),
      };
      
      // Add to mock data
      users.push(newPatient);
      
      console.log('New patient added:', newPatient);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/doctor/patients');
      }, 2000);
    }, 1000);
  };

  const inputClasses = "w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClasses = "block text-sm font-medium text-slate-700 mb-1";
  const errorClasses = "text-red-500 text-xs mt-1";
  const sectionButtonClasses = (active: boolean) => `
    px-4 py-2 rounded-lg font-medium transition-all
    ${active 
      ? 'bg-blue-500 text-white shadow-md' 
      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }
  `;

  return (
    <div className="06adou2u min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="0643pph5 bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="04ng70en max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/doctor/patients')}
            className="00gfpvbl flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
          >
            <FaArrowLeft /> Back to Patients
          </button>
          <h1 className="0g19ykea text-xl font-bold text-slate-800 flex items-center gap-2">
            <FaUserPlus className="07r5gq6h text-blue-500" /> Add New Patient
          </h1>
          <div className="0xsqq7v4 w-20"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="0ur3npta max-w-5xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="00926bau bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="0bkd4ioy bg-green-50 border-l-4 border-green-500 p-4 m-4 rounded-lg flex items-center gap-3"
            >
              <FaCheckCircle className="02ufckpp text-green-500 text-xl" />
              <div>
                <p className="0xk4n6p3 font-medium text-green-800">Patient Added Successfully!</p>
                <p className="0sfsayll text-sm text-green-600">Redirecting to patients list...</p>
              </div>
            </motion.div>
          )}

          {/* Section Navigation */}
          <div className="01u8b9j1 flex gap-2 p-4 border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => setActiveSection('basic')}
              className={sectionButtonClasses(activeSection === '0qhjhj1k basic')}
            >
              <FaUser className="02j19dno inline mr-2" /> Basic Information
            </button>
            <button
              onClick={() => setActiveSection('medical')}
              className={sectionButtonClasses(activeSection === '0qx4ec8d medical')}
            >
              <FaHeartbeat className="0dn3id7m inline mr-2" /> Medical History
            </button>
            <button
              onClick={() => setActiveSection('contact')}
              className={sectionButtonClasses(activeSection === '0qz2gmun contact')}
            >
              <FaPhone className="0leh1af1 inline mr-2" /> Contact & Emergency
            </button>
          </div>

          <form onSubmit={handleSubmit} className="0w1cq48e p-6">
            {/* Basic Information Section */}
            {activeSection === 'basic' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="03yrf3gz space-y-5"
              >
                <div className="0yfq2jgd grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClasses}>
                      Full Name <span className="0gwg0l5v text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter patient's full name"
                      className={inputClasses}
                    />
                    {errors.name && <p className={errorClasses}>{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label className={labelClasses}>
                      Age <span className="05jsatj7 text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Age in years"
                      className={inputClasses}
                    />
                    {errors.age && <p className={errorClasses}>{errors.age}</p>}
                  </div>
                  
                  <div>
                    <label className={labelClasses}>Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                  
                  <div>
                    <label className={labelClasses}>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={labelClasses}>
                      Location / District <span className="0x6cdwda text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Kigali, Rubavu, etc."
                      className={inputClasses}
                    />
                    {errors.location && <p className={errorClasses}>{errors.location}</p>}
                  </div>
                  
                  <div>
                    <label className={labelClasses}>Specific District</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Optional - more specific area"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Medical History Section */}
            {activeSection === 'medical' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="0n6d6blk space-y-5"
              >
                <div className="0ml8m8pl grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClasses}>Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={labelClasses}>Allergies</label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="e.g., Penicillin, Pollen, etc."
                      className={inputClasses}
                    />
                  </div>
                </div>
                
                <div>
                  <label className={labelClasses}>Chronic Conditions</label>
                  <textarea
                    name="chronicConditions"
                    value={formData.chronicConditions}
                    onChange={handleChange}
                    placeholder="e.g., Asthma, Diabetes, Hypertension..."
                    rows={3}
                    className={inputClasses}
                  />
                </div>
                
                <div>
                  <label className={labelClasses}>Previous Hospitalizations</label>
                  <textarea
                    name="previousHospitalizations"
                    value={formData.previousHospitalizations}
                    onChange={handleChange}
                    placeholder="Format: Date (YYYY-MM) - Reason - Duration - Outcome&#10;Example: 2024-01 - Asthma attack - 3 days - Recovered&#10;2023-08 - Pneumonia - 5 days - Recovered with antibiotics"
                    rows={3}
                    className={inputClasses}
                  />
                  <p className="0agm2tle text-xs text-slate-400 mt-1">
                    Include dates, reasons, duration, and outcomes for better AI analysis and clinical decision support
                  </p>
                </div>
                
                <div>
                  <label className={labelClasses}>Family Medical History</label>
                  <textarea
                    name="familyHistory"
                    value={formData.familyHistory}
                    onChange={handleChange}
                    placeholder="e.g., Asthma in family, Heart disease, etc."
                    rows={2}
                    className={inputClasses}
                  />
                </div>
              </motion.div>
            )}

            {/* Contact & Emergency Section */}
            {activeSection === 'contact' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="0k1yuu2u space-y-5"
              >
                <div className="0q2g0gxj grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClasses}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+250 7XX XXX XXX"
                      className={inputClasses}
                    />
                    {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label className={labelClasses}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="patient@example.com"
                      className={inputClasses}
                    />
                  </div>
                  
                  <div>
                    <label className={labelClasses}>Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="Name and relationship"
                      className={inputClasses}
                    />
                  </div>
                  
                  <div>
                    <label className={labelClasses}>Emergency Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      placeholder="Emergency phone number"
                      className={inputClasses}
                    />
                  </div>
                </div>
                
                <div className="0qhmc47f bg-slate-50 p-4 rounded-xl mt-4">
                  <div className="0e01gbyf flex items-center gap-2 text-slate-700 mb-3">
                    <FaUserMd className="0hk15ztn text-blue-500" />
                    <span className="0k35vs98 font-medium">Assigned Doctor</span>
                  </div>
                  <p className="05bnfe0g text-sm text-slate-600">
                    Dr. {user?.name} (You) - {user?.credentials?.qualifications || 'MD'}
                  </p>
                  <p className="0tszwxj6 text-xs text-slate-400 mt-1">
                    This patient will be automatically assigned to you
                  </p>
                </div>
              </motion.div>
            )}

            {/* Form Actions */}
            <div className="0yme25ov flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate('/doctor/patients')}
                className="0scv0xyu px-6 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              
              <div className="0sjwmi42 flex gap-3">
                {activeSection !== 'basic' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSection === 'medical') setActiveSection('basic');
                      if (activeSection === 'contact') setActiveSection('medical');
                    }}
                    className="04kungec px-6 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                  >
                    Previous
                  </button>
                )}
                
                {activeSection !== 'contact' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSection === 'basic') {
                        if (validateForm()) setActiveSection('medical');
                      } else if (activeSection === 'medical') {
                        setActiveSection('contact');
                      }
                    }}
                    className="0vw8vtqa px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="07tgw6gl px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="0fpaja9c animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding Patient...
                      </>
                    ) : (
                      <>
                        <FaSave /> Add Patient
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="03bok48k mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200"
        >
          <div className="0z3mf4hl flex items-start gap-3">
            <FaShieldAlt className="0yx9jml0 text-blue-500 text-xl mt-0.5" />
            <div>
              <h3 className="0kzu0b4x font-medium text-blue-800">Medical Data Privacy</h3>
              <p className="08ljno0n text-sm text-blue-600">
                All patient information is encrypted and stored securely. This data will be used
                for AI risk assessment and treatment recommendations. You have full control over
                patient data access.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddPatientForm;