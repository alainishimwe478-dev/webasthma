import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AsthmaShieldLanding = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "patient",
    district: "",
  });

const [submitted, setSubmitted] = useState(false);

// ✅ FORCE SCROLL TO TOP WHEN PAGE LOADS
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("✅ Page scrolled to top");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", userType: "patient", district: "" });
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: auto !important;
          scroll-padding-top: 80px;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: "#fbfefe";
          color: "#1A2C3E";
          line-height: 1.5;
        }
        
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <header style={{
        padding: "20px 0",
        background: "white",
        borderBottom: "1px solid #E9F0F0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.95)"
      }}>
        <div className="0gcd1onv container" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="45" height="45" viewBox="0 0 100 100" fill="none">
              <path d="M50 10L15 25V50C15 70 30 85 50 90C70 85 85 70 85 50V25L50 10Z" stroke="#1C7E7C" strokeWidth="4" fill="#EFF9F8"/>
              <path d="M50 25L35 40L40 45L50 35L60 45L65 40L50 25Z" fill="#1C7E7C"/>
              <path d="M50 50L35 65L40 70L50 60L60 70L65 65L50 50Z" fill="#1C7E7C"/>
              <circle cx="50" cy="55" r="5" fill="#0B3B5F"/>
            </svg>
            <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0B3B5F" }}>Asthma Shield</span>
          </div>
          <nav style={{ display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap" }}>
            <a href="#features" style={{ textDecoration: "none", color: "#2C4A6E", fontWeight: 500 }}>Features</a>
            <a href="#dashboard" style={{ textDecoration: "none", color: "#2C4A6E", fontWeight: 500 }}>Dashboard</a>
            <a href="#contact" style={{ textDecoration: "none", color: "#2C4A6E", fontWeight: 500 }}>Early Access</a>
            <Link to="/login" style={{
              background: "#1C7E7C",
              color: "white",
              padding: "8px 24px",
              borderRadius: "40px",
              textDecoration: "none",
              fontWeight: 600,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}>
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #f5f9ff 0%, #e6f0fa 100%)",
        padding: "80px 0",
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        overflow: "hidden"
      }}>
        <div className="0v5d1cjx container" style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "48px"
        }}>
          <div style={{ flex: 1.2 }} className="09oq05ep animate-fadeInUp">
            <div style={{
              background: "#E0F2F1",
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "40px",
              marginBottom: "20px",
              color: "#1C7E7C",
              fontWeight: 600,
              fontSize: "0.85rem"
            }}>
              📍 Designed for Rwanda | Smart predictive care
            </div>
            <h1 style={{
              fontSize: "3.5rem",
              lineHeight: "1.2",
              marginBottom: "1.25rem",
              background: "linear-gradient(135deg, #0B3B5F, #1C7E7C)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent"
            }}>
              Predict. Prevent. Protect.
              <br />
              Breathe freely with <span style={{ color: "#1C7E7C" }}>Asthma Shield</span>
            </h1>
            <p style={{
              fontSize: "1.2rem",
              color: "#4A627A",
              marginBottom: "2rem",
              maxWidth: "600px"
            }}>
              AI-powered health monitoring that combines symptom tracking, real-time environmental data, and intelligent risk alerts to prevent asthma attacks across Rwanda.
            </p>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <a href="#contact" style={{
                background: "#1C7E7C",
                color: "white",
                padding: "12px 32px",
                borderRadius: "40px",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}>
                📅 Join Early Access
              </a>
              <a href="#features" style={{
                border: "2px solid #1C7E7C",
                color: "#1C7E7C",
                padding: "10px 28px",
                borderRadius: "40px",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}>
                ▶ Discover how it works
              </a>
            </div>
            <div style={{
              marginTop: "32px",
              display: "flex",
              gap: "24px",
              fontSize: "0.9rem",
              color: "#4A627A"
            }}>
              <span>✓ Mobile + Web platform</span>
              <span>📊 Predictive risk engine</span>
              <span>🌿 Environmental triggers</span>
            </div>
          </div>
          
          {/* Risk Card */}
          <div style={{ flex: 1 }} className="0pvrc84m animate-fadeInUp">
            <div style={{
              background: "white",
              borderRadius: "32px",
              padding: "28px",
              boxShadow: "0 20px 35px -12px rgba(0,0,0,0.1)",
              border: "1px solid #D4E6E5"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.2rem", color: "#0B3B5F" }}>🖥️ Live risk prediction</h3>
                <span style={{ background: "#E0F2F1", padding: "4px 12px", borderRadius: "40px", fontSize: "0.8rem", fontWeight: 600, color: "#1C7E7C" }}>AI model v2.1</span>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span>📍 Kigali, Rwanda</span>
                  <span>Risk score: <strong style={{ color: "#2C9C8F" }}>Low (18%)</strong></span>
                </div>
                <div style={{ height: "8px", background: "#E0E7E6", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ width: "18%", background: "#2C9C8F", height: "100%" }}></div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
                <div style={{ background: "#F4FAF9", padding: "8px 16px", borderRadius: "28px", flex: 1, textAlign: "center" }}>🌡️ 22°C</div>
                <div style={{ background: "#F4FAF9", padding: "8px 16px", borderRadius: "28px", flex: 1, textAlign: "center" }}>💧 68% RH</div>
                <div style={{ background: "#F4FAF9", padding: "8px 16px", borderRadius: "28px", flex: 1, textAlign: "center" }}>🌫️ AQI 42</div>
                <div style={{ background: "#F4FAF9", padding: "8px 16px", borderRadius: "28px", flex: 1, textAlign: "center" }}>🌾 Pollen: Moderate</div>
              </div>
              <div style={{ background: "#EFF8FF", borderLeft: "4px solid #1C7E7C", padding: "12px 16px", borderRadius: "16px" }}>
                🔔 <strong>Proactive alert</strong> — Humidity rising tonight in Western Province: keep rescue medication accessible.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: "60px 0", background: "#EFF9F8" }}>
        <div className="0rql8jh5 container">
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "48px",
            textAlign: "center"
          }}>
            {[
              { value: "-42%", label: "expected asthma emergencies", icon: "📈" },
              { value: "5+", label: "environmental triggers monitored", icon: "☁️" },
              { value: "70%", label: "improved medication adherence", icon: "👥" },
              { value: "30 districts", label: "scalable across Rwanda", icon: "🗺️" }
            ].map((stat, idx) => (
              <div key={idx} style={{ minWidth: "150px" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{stat.icon}</div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#1C7E7C" }}>{stat.value}</div>
                <div style={{ color: "#4A627A" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "80px 0" }}>
        <div className="0an8olct container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span style={{ background: "#E0F2F1", padding: "6px 16px", borderRadius: "40px", display: "inline-block", marginBottom: "20px", color: "#1C7E7C", fontWeight: 600 }}>🎯 Our mission in action</span>
            <h2 style={{ fontSize: "2.2rem", color: "#0B3B5F", marginBottom: "15px" }}>Intelligent features built for every objective</h2>
            <p style={{ color: "#4A627A", maxWidth: "700px", margin: "0 auto" }}>From real‑time tracking to AI risk alerts — Asthma Shield delivers on all core goals to protect Rwandan asthma patients.</p>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px"
          }}>
            {[
              { icon: "📱", title: "Symptom & medication tracking", desc: "Mobile & web app to record daily symptoms, peak flow, medication use. Real-time logging for patients and caregivers." },
              { icon: "🌡️", title: "Environmental monitoring", desc: "Integrates temperature, humidity, air quality, pollen & seasonal triggers — hyperlocal for Rwanda's regions." },
              { icon: "🧠", title: "Predictive risk analysis", desc: "ML engine estimates attack likelihood by combining personal health patterns + environmental factors, giving early warning." },
              { icon: "🔔", title: "Real-time alerts", desc: "Instant push notifications & preventive guidance: 'High pollen — take antihistamine' or 'avoid morning jog'." },
              { icon: "📊", title: "Healthcare dashboard", desc: "Doctors & admins view patient trends, high-risk zones, environmental risk heatmaps, population-level insights." },
              { icon: "📅", title: "Self‑management & adherence", desc: "Personalized reminders, educational content, and asthma action plans to improve daily self-care." }
            ].map((feature, idx) => (
              <div key={idx} style={{
                background: "white",
                padding: "28px",
                borderRadius: "28px",
                border: "1px solid #E3EFEE",
                transition: "all 0.3s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 24px 36px -12px rgba(28,126,124,0.15)";
                e.currentTarget.style.borderColor = "#C2E0DE";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#E3EFEE";
              }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#1C7E7C" }}>{feature.icon}</div>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "12px", color: "#0B3B5F" }}>{feature.title}</h3>
                <p style={{ color: "#4A627A", lineHeight: "1.6" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" style={{ padding: "80px 0", background: "#E9F4F3" }}>
        <div className="06w020ba container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <h2 style={{ fontSize: "2.2rem", color: "#0B3B5F", marginBottom: "15px" }}>💻 Clinician dashboard & population insights</h2>
            <p style={{ color: "#4A627A", maxWidth: "700px", margin: "0 auto" }}>Empower doctors and public health officials with real-time asthma trends, high-risk areas, and environmental risk mapping.</p>
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "40px"
          }}>
            <div style={{ background: "white", padding: "30px", borderRadius: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
              <h3 style={{ marginBottom: "20px", color: "#0B3B5F" }}>📊 Patient cohort overview</h3>
              <div style={{ background: "#E4F0EF", padding: "20px", borderRadius: "20px", marginBottom: "20px", textAlign: "center" }}>
                High-risk patients: 23% | Adherence rate: 78%
              </div>
              <p>🗺️ <strong>Hotspots:</strong> Musanze, Rubavu, Kigali City</p>
              <hr style={{ margin: "20px 0", borderColor: "#E3EFEE" }} />
              <p>📈 Track intervention impact & emergency reduction KPIs</p>
            </div>
            
            <div style={{ background: "white", padding: "30px", borderRadius: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
              <h3 style={{ marginBottom: "20px", color: "#0B3B5F" }}>🔔 Risk alert manager</h3>
              <div style={{ background: "#FEF7E0", padding: "15px", borderRadius: "20px", marginBottom: "20px" }}>
                ⚠️ District-level alert: High mold spore count in Northern Province — notifications sent to 342 patients.
              </div>
              <p>📊 Environmental asthma risk patterns: weekly summary, predictive outbreak zones</p>
              <Link to="/patient-dashboard" style={{
                display: "inline-block",
                marginTop: "20px",
                color: "#1C7E7C",
                textDecoration: "none",
                fontWeight: "bold"
              }}>
                👁️ View demo dashboard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" style={{ padding: "80px 0" }}>
        <div className="0jtvkca5 container">
          <div style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "#1A3E48",
            borderRadius: "32px",
            padding: "48px",
            color: "white",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ textAlign: "center", color: "white", marginBottom: "15px", fontSize: "1.8rem" }}>Join Early Access</h2>
            <p style={{ textAlign: "center", marginBottom: "30px", opacity: 0.9 }}>
              Be part of Rwanda's first smart predictive asthma network.
            </p>
            
            {submitted && (
              <div style={{
                background: "#4CAF50",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                textAlign: "center"
              }}>
                ✅ Thank you! We'll contact you soon.
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  marginBottom: "16px",
                  borderRadius: "60px",
                  border: "none",
                  fontSize: "1rem"
                }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  marginBottom: "16px",
                  borderRadius: "60px",
                  border: "none",
                  fontSize: "1rem"
                }}
              />
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  marginBottom: "16px",
                  borderRadius: "60px",
                  border: "none",
                  fontSize: "1rem"
                }}
              >
                <option value="patient">I am a patient / caregiver</option>
                <option value="professional">I am a healthcare professional</option>
                <option value="partner">I am a public health partner</option>
              </select>
              <input
                type="text"
                name="district"
                placeholder="District / City (Rwanda)"
                value={formData.district}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  marginBottom: "24px",
                  borderRadius: "60px",
                  border: "none",
                  fontSize: "1rem"
                }}
              />
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#F4A261",
                  color: "#1E2F3A",
                  border: "none",
                  borderRadius: "60px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
              >
                ✉️ Request Early Access
              </button>
            </form>
            <p style={{ fontSize: "0.8rem", marginTop: "24px", textAlign: "center", opacity: 0.8 }}>
              📊 Effectiveness trials start Q3 2026 — contribute to reducing asthma emergencies across Rwanda.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#0B2B36",
        color: "#CDE4E2",
        padding: "48px 0 24px",
        marginTop: "40px"
      }}>
        <div className="0fbg4h8h container">
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "40px",
            marginBottom: "40px"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                <svg width="35" height="35" viewBox="0 0 100 100" fill="none">
                  <path d="M50 10L15 25V50C15 70 30 85 50 90C70 85 85 70 85 50V25L50 10Z" stroke="#CDE4E2" strokeWidth="4" fill="#1A3E48"/>
                  <path d="M50 25L35 40L40 45L50 35L60 45L65 40L50 25Z" fill="#CDE4E2"/>
                  <path d="M50 50L35 65L40 70L50 60L60 70L65 65L50 50Z" fill="#CDE4E2"/>
                  <circle cx="50" cy="55" r="5" fill="#0B3B5F"/>
                </svg>
                <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Asthma Shield</span>
              </div>
              <p style={{ maxWidth: "300px", opacity: 0.8, fontSize: "0.9rem" }}>
                Smart predictive monitoring for asthma patients in Rwanda. Real-time risk, early prevention, and integrated care.
              </p>
            </div>
            
            <div>
              <h4 style={{ marginBottom: "15px", color: "white" }}>Core Objectives</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "8px" }}>✅ Symptom tracking</li>
                <li style={{ marginBottom: "8px" }}>✅ Environmental monitoring</li>
                <li style={{ marginBottom: "8px" }}>✅ Predictive alerts</li>
                <li style={{ marginBottom: "8px" }}>✅ Clinician dashboard</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: "15px", color: "white" }}>Resources</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: "8px" }}><a href="#" style={{ color: "#CDE4E2", textDecoration: "none" }}>About Rwanda initiative</a></li>
                <li style={{ marginBottom: "8px" }}><a href="#" style={{ color: "#CDE4E2", textDecoration: "none" }}>Asthma education hub</a></li>
                <li style={{ marginBottom: "8px" }}><a href="#" style={{ color: "#CDE4E2", textDecoration: "none" }}>Partner with us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: "15px", color: "white" }}>Contact</h4>
              <p>📧 support@asthmashield.rw</p>
              <p>📍 Kigali, Rwanda</p>
            </div>
          </div>
          
          <hr style={{ borderColor: "#2A555E", margin: "20px 0" }} />
          
          <p style={{ textAlign: "center", fontSize: "0.8rem", opacity: 0.7 }}>
            © 2026 Asthma Shield — Designed to empower Rwandan communities. Reducing asthma emergencies through predictive intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AsthmaShieldLanding;