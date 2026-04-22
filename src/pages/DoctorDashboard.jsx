// src/pages/Dashboard.jsx - Complete Dashboard with Working Chatbot
import React, { useState, useRef, useEffect } from "react";

const Dashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAllPatients, setShowAllPatients] = useState(false);
  const [activeWeatherTab, setActiveWeatherTab] = useState("Temperature");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your medical assistant. How can I help you today?",
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const dashboardData = {
    patients: [
      {
        id: 1,
        name: "John Smith",
        age: 45,
        lastVisit: "2024-03-15",
        condition: "Moderate Asthma",
        medications: ["Albuterol", "Fluticasone"],
        peakFlow: 450,
        phone: "(555) 123-4567",
        email: "john.smith@email.com",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        age: 32,
        lastVisit: "2024-03-10",
        condition: "Mild Asthma",
        medications: ["Albuterol"],
        peakFlow: 480,
        phone: "(555) 234-5678",
        email: "sarah.j@email.com",
      },
      {
        id: 3,
        name: "Michael Brown",
        age: 28,
        lastVisit: "2024-03-12",
        condition: "Severe Asthma",
        medications: ["Albuterol", "Fluticasone", "Montelukast"],
        peakFlow: 380,
        phone: "(555) 345-6789",
        email: "michael.b@email.com",
      },
      {
        id: 4,
        name: "Emma Wilson",
        age: 52,
        lastVisit: "2024-03-14",
        condition: "Moderate Asthma",
        medications: ["Albuterol", "Fluticasone"],
        peakFlow: 420,
        phone: "(555) 456-7890",
        email: "emma.w@email.com",
      },
      {
        id: 5,
        name: "James Davis",
        age: 39,
        lastVisit: "2024-03-13",
        condition: "Mild Asthma",
        medications: ["Albuterol"],
        peakFlow: 460,
        phone: "(555) 567-8901",
        email: "james.d@email.com",
      },
      {
        id: 6,
        name: "Lisa Martinez",
        age: 41,
        lastVisit: "2024-03-11",
        condition: "Severe Asthma",
        medications: ["Albuterol", "Fluticasone", "Prednisone"],
        peakFlow: 360,
        phone: "(555) 678-9012",
        email: "lisa.m@email.com",
      },
    ],
    appointments: [
      {
        id: 1,
        patientName: "John Smith",
        time: "10:00 AM",
        date: "2024-03-20",
        type: "Follow-up",
        status: "confirmed",
      },
      {
        id: 2,
        patientName: "Sarah Johnson",
        time: "11:30 AM",
        date: "2024-03-20",
        type: "Consultation",
        status: "confirmed",
      },
      {
        id: 3,
        patientName: "Michael Brown",
        time: "2:00 PM",
        date: "2024-03-20",
        type: "Emergency",
        status: "pending",
      },
      {
        id: 4,
        patientName: "Emma Wilson",
        time: "3:30 PM",
        date: "2024-03-21",
        type: "Follow-up",
        status: "confirmed",
      },
    ],
    alerts: [
      {
        id: 1,
        patient: "Michael Brown",
        message: "Peak flow below 80% for 3 days",
        severity: "high",
        time: "2 hours ago",
      },
      {
        id: 2,
        patient: "John Smith",
        message: "Missed medication dose yesterday",
        severity: "medium",
        time: "5 hours ago",
      },
      {
        id: 3,
        patient: "Lisa Martinez",
        message: "Scheduled follow-up overdue",
        severity: "low",
        time: "1 day ago",
      },
    ],
    stats: {
      totalPatients: 156,
      activePatients: 142,
      emergencyCases: 3,
      upcomingAppointments: 8,
      avgPeakFlow: 425,
      satisfaction: 94,
    },
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi")) {
      return "Hello! How can I assist you with patient care today?";
    } else if (msg.includes("patient")) {
      return `You have ${dashboardData.patients.length} patients. ${dashboardData.stats.activePatients} are active, and ${dashboardData.stats.emergencyCases} need emergency attention.`;
    } else if (msg.includes("appointment")) {
      return `Today you have 3 appointments. The next one is at 10:00 AM with John Smith.`;
    } else if (msg.includes("alert")) {
      return `You have ${dashboardData.alerts.length} active alerts. ${dashboardData.alerts.filter((a) => a.severity === "high").length} are high priority.`;
    } else if (msg.includes("peak flow")) {
      return `Average peak flow is ${dashboardData.stats.avgPeakFlow} L/min. 65% of patients are in excellent range.`;
    } else if (msg.includes("medication")) {
      return "Common asthma medications: Albuterol (rescue), Fluticasone (controller), Montelukast (oral).";
    } else if (msg.includes("help")) {
      return "I can help with: Patients, Appointments, Alerts, Medications, Peak Flow data. What would you like?";
    } else {
      return "I'm your medical assistant. Ask me about patients, appointments, alerts, medications, or peak flow data!";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const displayedPatients = showAllPatients
    ? dashboardData.patients
    : dashboardData.patients.slice(0, 5);

  const getConditionColor = (condition) => {
    if (condition === "Severe Asthma") return "#e74c3c";
    if (condition === "Moderate Asthma") return "#f39c12";
    return "#27ae60";
  };

  const getPeakFlowStatus = (peakFlow) => {
    if (peakFlow >= 400) return { text: "Excellent", color: "#27ae60" };
    if (peakFlow >= 300) return { text: "Good", color: "#3498db" };
    if (peakFlow >= 200) return { text: "Warning", color: "#f39c12" };
    return { text: "Critical", color: "#e74c3c" };
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏥 Medical Dashboard</h1>
          <p style={styles.subtitle}>Welcome back, Dr. Anderson</p>
        </div>
        <div style={styles.headerStats}>
          <div style={styles.headerStat}>
            <span style={styles.headerStatValue}>
              {dashboardData.stats.totalPatients}
            </span>
            <span style={styles.headerStatLabel}>Total Patients</span>
          </div>
          <div style={styles.headerStat}>
            <span style={styles.headerStatValue}>
              {dashboardData.stats.activePatients}
            </span>
            <span style={styles.headerStatLabel}>Active</span>
          </div>
          <div style={styles.headerStat}>
            <span style={styles.headerStatValue}>
              {dashboardData.stats.emergencyCases}
            </span>
            <span style={styles.headerStatLabel}>Emergency</span>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div>
            <div style={styles.statTitle}>Average Peak Flow</div>
            <div style={styles.statValue}>
              {dashboardData.stats.avgPeakFlow}{" "}
              <span style={styles.statUnit}>L/min</span>
            </div>
            <div style={styles.statTrend}>↑ 5% from last month</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📅</div>
          <div>
            <div style={styles.statTitle}>Today's Appointments</div>
            <div style={styles.statValue}>3</div>
            <div style={styles.statTrend}>2 remaining today</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚠️</div>
          <div>
            <div style={styles.statTitle}>Active Alerts</div>
            <div style={styles.statValue}>{dashboardData.alerts.length}</div>
            <div style={styles.statTrend}>Requires attention</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⭐</div>
          <div>
            <div style={styles.statTitle}>Satisfaction Rate</div>
            <div style={styles.statValue}>
              {dashboardData.stats.satisfaction}%
            </div>
            <div style={styles.statTrend}>↑ 2% from last month</div>
          </div>
        </div>
      </div>

      {/* WEATHER SECTION */}
      <div style={styles.weatherCard}>
        <div style={styles.weatherHeader}>
          <div>
            <h3 style={styles.weatherCity}>🌍 Kigali, Rwanda</h3>
            <p style={styles.weatherDesc}>Partly Cloudy • Feels like 62°</p>
          </div>
          <div style={styles.weatherTemp}>64°</div>
        </div>
        <div style={styles.weatherTabs}>
          {[
            "Temperature",
            "Precipitation",
            "Wind",
            "Air Quality",
            "UV Index",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveWeatherTab(tab)}
              style={{
                ...styles.weatherTab,
                backgroundColor:
                  activeWeatherTab === tab
                    ? "#3498db"
                    : "rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={styles.weatherContent}>
          {activeWeatherTab === "Temperature" && (
            <p>🌡️ Today's Range: 60°F → 75°F → 65°F</p>
          )}
          {activeWeatherTab === "Precipitation" && (
            <p>🌧️ Chance of Rain: 40% • Humidity: 65%</p>
          )}
          {activeWeatherTab === "Wind" && (
            <p>💨 Wind Speed: 5 mph (Light breeze) • Direction: NE</p>
          )}
          {activeWeatherTab === "Air Quality" && (
            <p>🌿 Air Quality Index: 42 (Good) • Safe for outdoor activities</p>
          )}
          {activeWeatherTab === "UV Index" && (
            <p>☀️ UV Index: 3 (Low) • Protection needed: Minimal</p>
          )}
        </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div style={styles.twoColumnLayout}>
        {/* LEFT COLUMN */}
        <div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>👥 Your Patients</h2>
              <button
                style={styles.viewAllButton}
                onClick={() => setShowAllPatients(!showAllPatients)}
              >
                {showAllPatients
                  ? "Show Less"
                  : `View All (${dashboardData.patients.length})`}
              </button>
            </div>
            <div style={styles.patientsList}>
              {displayedPatients.map((patient) => (
                <div
                  key={patient.id}
                  style={styles.patientCard}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div style={styles.patientAvatar}>
                    {patient.name.charAt(0)}
                  </div>
                  <div style={styles.patientInfo}>
                    <div style={styles.patientName}>{patient.name}</div>
                    <div style={styles.patientDetails}>
                      <span>🎂 {patient.age} yrs</span>
                      <span>•</span>
                      <span>💊 {patient.medications.length} meds</span>
                      <span>•</span>
                      <span>📅 {patient.lastVisit}</span>
                    </div>
                    <div style={styles.patientMetrics}>
                      <span style={styles.peakFlowBadge}>
                        📈 PF: {patient.peakFlow} L/min
                      </span>
                      <span
                        style={{
                          ...styles.conditionBadge,
                          backgroundColor:
                            getConditionColor(patient.condition) + "20",
                          color: getConditionColor(patient.condition),
                        }}
                      >
                        {patient.condition}
                      </span>
                    </div>
                  </div>
                  <div style={styles.patientStatus}>
                    <span
                      style={{
                        ...styles.statusDot,
                        backgroundColor: getPeakFlowStatus(patient.peakFlow)
                          .color,
                      }}
                    ></span>
                    <span style={styles.statusText}>
                      {getPeakFlowStatus(patient.peakFlow).text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📅 Upcoming Appointments</h2>
            <div style={styles.appointmentsList}>
              {dashboardData.appointments.map((apt) => (
                <div key={apt.id} style={styles.appointmentCard}>
                  <div style={styles.appointmentDateBox}>
                    <div style={styles.appointmentDay}>
                      {apt.date.split("-")[2]}
                    </div>
                    <div style={styles.appointmentMonth}>
                      {apt.date.split("-")[1]}
                    </div>
                  </div>
                  <div style={styles.appointmentInfo}>
                    <div style={styles.appointmentPatient}>
                      {apt.patientName}
                    </div>
                    <div style={styles.appointmentMeta}>
                      <span>🕒 {apt.time}</span>
                      <span>•</span>
                      <span>📋 {apt.type}</span>
                      <span>•</span>
                      <span
                        style={
                          apt.status === "confirmed"
                            ? styles.confirmedStatus
                            : styles.pendingStatus
                        }
                      >
                        {apt.status}
                      </span>
                    </div>
                  </div>
                  <button style={styles.startButton}>Start →</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🔔 Alerts & Notifications</h2>
            <div style={styles.alertsList}>
              {dashboardData.alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    ...styles.alertCard,
                    borderLeftColor:
                      alert.severity === "high"
                        ? "#e74c3c"
                        : alert.severity === "medium"
                          ? "#f39c12"
                          : "#3498db",
                  }}
                >
                  <div style={styles.alertContent}>
                    <div style={styles.alertTitle}>
                      {alert.severity === "high" && "🔴 "}
                      {alert.severity === "medium" && "🟡 "}
                      {alert.severity === "low" && "🔵 "}
                      {alert.patient}
                    </div>
                    <div style={styles.alertMessage}>{alert.message}</div>
                    <div style={styles.alertTime}>⏱️ {alert.time}</div>
                  </div>
                  <button style={styles.resolveButton}>View</button>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📊 Peak Flow Distribution</h2>
            <div style={styles.distributionContainer}>
              <div style={styles.distributionItem}>
                <div style={styles.distributionLabel}>
                  <span>Excellent (400+)</span>
                  <span>65%</span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: "65%",
                      backgroundColor: "#27ae60",
                    }}
                  ></div>
                </div>
              </div>
              <div style={styles.distributionItem}>
                <div style={styles.distributionLabel}>
                  <span>Good (300-399)</span>
                  <span>25%</span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: "25%",
                      backgroundColor: "#3498db",
                    }}
                  ></div>
                </div>
              </div>
              <div style={styles.distributionItem}>
                <div style={styles.distributionLabel}>
                  <span>Warning (200-299)</span>
                  <span>8%</span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: "8%",
                      backgroundColor: "#f39c12",
                    }}
                  ></div>
                </div>
              </div>
              <div style={styles.distributionItem}>
                <div style={styles.distributionLabel}>
                  <span>Critical (&lt;200)</span>
                  <span>2%</span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: "2%",
                      backgroundColor: "#e74c3c",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>⚡ Quick Actions</h2>
            <div style={styles.quickActionsGrid}>
              <button style={styles.quickActionBtn}>➕ Add Patient</button>
              <button style={styles.quickActionBtn}>📅 Schedule</button>
              <button style={styles.quickActionBtn}>📊 Generate Report</button>
              <button style={styles.quickActionBtn}>💊 Prescriptions</button>
            </div>
          </div>
        </div>
      </div>

      {/* CHATBOT BUTTON - FIXED POSITION */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={styles.chatButton}
      >
        💬
      </button>

      {/* CHATBOT WINDOW */}
      {isChatOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.chatHeader}>
            <div>
              <span style={styles.chatIcon}>🤖</span>
              <span style={styles.chatTitle}>Medical Assistant</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              style={styles.chatClose}
            >
              ✕
            </button>
          </div>
          <div style={styles.chatMessages}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={
                  msg.sender === "user" ? styles.userMessage : styles.botMessage
                }
              >
                <div style={styles.messageText}>{msg.text}</div>
                <div style={styles.messageTime}>{msg.time}</div>
              </div>
            ))}
            {isTyping && <div style={styles.typing}>Typing...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div style={styles.chatInputContainer}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about patients, appointments..."
              style={styles.chatInput}
            />
            <button onClick={handleSendMessage} style={styles.chatSend}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* MODAL */}
      {selectedPatient && (
        <div style={styles.modal} onClick={() => setSelectedPatient(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>{selectedPatient.name}</h2>
              <button
                onClick={() => setSelectedPatient(null)}
                style={styles.modalClose}
              >
                ✕
              </button>
            </div>
            <div style={styles.modalBody}>
              <p>
                <strong>Age:</strong> {selectedPatient.age}
              </p>
              <p>
                <strong>Condition:</strong> {selectedPatient.condition}
              </p>
              <p>
                <strong>Peak Flow:</strong> {selectedPatient.peakFlow} L/min
              </p>
              <p>
                <strong>Last Visit:</strong> {selectedPatient.lastVisit}
              </p>
              <p>
                <strong>Phone:</strong> {selectedPatient.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedPatient.email}
              </p>
              <p>
                <strong>Medications:</strong>{" "}
                {selectedPatient.medications.join(", ")}
              </p>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.modalButton}>Schedule Follow-up</button>
              <button
                onClick={() => setSelectedPatient(null)}
                style={styles.modalButtonSecondary}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: "#f5f7fa",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: { fontSize: "28px", color: "#2c3e50", marginBottom: "8px" },
  subtitle: { fontSize: "14px", color: "#7f8c8d" },
  headerStats: { display: "flex", gap: "32px" },
  headerStat: { textAlign: "center" },
  headerStatValue: {
    display: "block",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#3498db",
  },
  headerStatLabel: { fontSize: "12px", color: "#7f8c8d" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  statIcon: { fontSize: "40px" },
  statTitle: { fontSize: "13px", color: "#7f8c8d", marginBottom: "8px" },
  statValue: { fontSize: "28px", fontWeight: "bold", color: "#2c3e50" },
  statUnit: { fontSize: "14px", fontWeight: "normal", color: "#7f8c8d" },
  statTrend: { fontSize: "11px", color: "#27ae60", marginTop: "4px" },
  weatherCard: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "24px",
    borderRadius: "12px",
    marginBottom: "24px",
    color: "#fff",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  weatherHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  weatherCity: { fontSize: "20px", marginBottom: "4px" },
  weatherDesc: { fontSize: "14px", opacity: 0.9 },
  weatherTemp: { fontSize: "48px", fontWeight: "bold" },
  weatherTabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  weatherTab: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.2s",
  },
  weatherContent: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "16px",
    borderRadius: "8px",
    fontSize: "14px",
  },
  twoColumnLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "16px",
  },
  viewAllButton: {
    backgroundColor: "#ecf0f1",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    color: "#3498db",
  },
  patientsList: { display: "flex", flexDirection: "column", gap: "12px" },
  patientCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s",
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
  },
  patientAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#3498db",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },
  patientInfo: { flex: 1 },
  patientName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "4px",
  },
  patientDetails: {
    fontSize: "12px",
    color: "#7f8c8d",
    display: "flex",
    gap: "8px",
    marginBottom: "6px",
  },
  patientMetrics: { display: "flex", gap: "8px", alignItems: "center" },
  peakFlowBadge: { fontSize: "11px", color: "#3498db", fontWeight: "500" },
  conditionBadge: {
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "12px",
    fontWeight: "500",
  },
  patientStatus: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  statusDot: { width: "10px", height: "10px", borderRadius: "50%" },
  statusText: { fontSize: "11px", color: "#7f8c8d" },
  appointmentsList: { display: "flex", flexDirection: "column", gap: "12px" },
  appointmentCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    border: "1px solid #e9ecef",
  },
  appointmentDateBox: {
    textAlign: "center",
    padding: "8px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    minWidth: "50px",
  },
  appointmentDay: { fontSize: "20px", fontWeight: "bold", color: "#3498db" },
  appointmentMonth: {
    fontSize: "11px",
    color: "#7f8c8d",
    textTransform: "uppercase",
  },
  appointmentInfo: { flex: 1 },
  appointmentPatient: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "4px",
  },
  appointmentMeta: {
    fontSize: "12px",
    color: "#7f8c8d",
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  confirmedStatus: { color: "#27ae60" },
  pendingStatus: { color: "#f39c12" },
  startButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
  },
  alertsList: { display: "flex", flexDirection: "column", gap: "12px" },
  alertCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    borderLeft: "4px solid",
    border: "1px solid #e9ecef",
    borderLeftWidth: "4px",
  },
  alertContent: { flex: 1 },
  alertTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "4px",
  },
  alertMessage: { fontSize: "12px", color: "#7f8c8d", marginBottom: "4px" },
  alertTime: { fontSize: "11px", color: "#95a5a6" },
  resolveButton: {
    backgroundColor: "#ecf0f1",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "11px",
  },
  distributionContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  distributionItem: { width: "100%" },
  distributionLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
    fontSize: "13px",
  },
  distributionPercent: { fontWeight: "600", color: "#2c3e50" },
  progressBar: {
    height: "8px",
    backgroundColor: "#ecf0f1",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s",
  },
  quickActionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  quickActionBtn: {
    padding: "12px",
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    color: "#2c3e50",
    transition: "all 0.2s",
  },

  // CHATBOT STYLES - These make it appear!
  chatButton: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    transition: "all 0.3s ease",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chatWindow: {
    position: "fixed",
    bottom: "100px",
    right: "24px",
    width: "350px",
    height: "500px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 1000,
  },
  chatHeader: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatIcon: { fontSize: "24px", marginRight: "8px" },
  chatTitle: { fontSize: "18px", fontWeight: "600" },
  chatClose: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },
  chatMessages: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  botMessage: {
    backgroundColor: "#f0f0f0",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  userMessage: {
    backgroundColor: "#3498db",
    color: "#fff",
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "80%",
    alignSelf: "flex-end",
  },
  messageText: { fontSize: "14px", marginBottom: "4px" },
  messageTime: { fontSize: "10px", opacity: 0.7 },
  typing: { padding: "10px", color: "#7f8c8d", fontStyle: "italic" },
  chatInputContainer: {
    padding: "16px",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    gap: "8px",
  },
  chatInput: {
    flex: 1,
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "20px",
    fontSize: "14px",
    outline: "none",
  },
  chatSend: {
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
  },

  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "80vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  modalClose: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#7f8c8d",
  },
  modalBody: { padding: "20px" },
  modalFooter: {
    padding: "20px",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
  },
  modalButton: {
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  modalButtonSecondary: {
    backgroundColor: "#95a5a6",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Dashboard;
