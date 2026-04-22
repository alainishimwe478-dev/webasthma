import React, { useState, useEffect } from "react";

const Inbox = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        from: "Dr. Smith",
        subject: "Follow-up on your last visit",
        time: "3h ago",
      },
      {
        from: "Clinic Admin",
        subject: "Appointment reminder",
        time: "1d ago",
      },
      {
        from: "Pharmacy",
        subject: "Prescription ready for pickup",
        time: "2d ago",
      },
    ]);
  }, []);

  return (
    <div className="0q5p3q43 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="0lgw8zys text-2xl font-bold mb-6">Inbox</h2>
      <div className="05w5p1kq space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="00p1r22i flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div>
              <p className="0heq9001 font-medium">{msg.subject}</p>
              <p className="0tdjgpsl text-sm text-gray-500">From: {msg.from}</p>
            </div>
            <span className="0uan5p4a text-sm text-gray-400">{msg.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
