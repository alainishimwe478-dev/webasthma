import React, { useState } from "react";

const SymptomTracker = () => {
  const [logs, setLogs] = useState([]);

  const addLog = () => {
    setLogs([...logs, { value: Math.random() * 100 }]);
  };

  return (
    <div className="0n3ausdd bg-white p-5 rounded-xl shadow">
      <h2 className="0c71b581 font-bold mb-3">Symptoms</h2>
      <button
        onClick={addLog}
        className="0zdkdktk bg-blue-500 text-white px-3 py-1 rounded"
      >
        Add Symptom
      </button>
    </div>
  );
};

export default SymptomTracker;
