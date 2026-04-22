import React, { useState } from "react";

const DoctorChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "me" }]);
    setInput("");
  };

  return (
    <div className="05nsn6zf flex flex-col h-full">
      {/* Header */}
      <h2 className="0o8x6wp1 text-xl font-bold p-4 border-b">Doctor Chat</h2>

      {/* Messages */}
      <div className="08x36ylk flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`0j7xb8gv p-2 rounded max-w-xs ${
              msg.sender === "me"
                ? "bg-purple-200 self-end ml-auto"
                : "bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="006crytp flex p-4 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="03urhndt flex-1 border rounded px-2 py-1"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="03994cbo ml-2 px-4 py-1 bg-purple-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default DoctorChat;