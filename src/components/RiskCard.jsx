import React, { useState, useEffect } from "react";

const RiskCard = () => {
  const [risk, setRisk] = useState("Low");

  useEffect(() => {
    const score = Math.random() * 100;
    if (score > 70) setRisk("High");
    else if (score > 40) setRisk("Medium");
    else setRisk("Low");
  }, []);

  return (
    <div className="0axltiea p-5 rounded-xl shadow bg-white">
      <h2 className="00vk5jlt font-bold mb-2">AI Risk Prediction</h2>
      <p className="084ov6xr text-2xl">{risk}</p>
    </div>
  );
};

export default RiskCard;
