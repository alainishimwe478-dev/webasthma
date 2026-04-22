import React, { useState } from "react";

const ChatBox = ({ title }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "me" }]);
    setInput("");
  };

  return (
    <div className="0beuv11l flex flex-col h-full">
      <h2 className="03jmu4fk text-xl font-bold p-4 border-b">{title}</h2>
      <div className="0bdbv7e4 flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`00we49xl p-2 rounded ${
              msg.sender === "me" ? "bg-blue-200 self-end" : "bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="0ktx7nrb flex p-4 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="0fxq2w2c flex-1 border rounded px-2 py-1"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="0hwfay6l ml-2 px-4 py-1 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
