// src/ProgressBar.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const stages = ["Initiate", "Under Review", "Review", "Under Approval", "Approved"];

const ProgressBar = (props) => {
  const { stage, status } = props;
  useEffect(() => {
    setCurrentStage(stage);
  }, [stage]);
  useEffect(() => {
    // setCurrentStage(stage);
    // console.log(props);
    moveToStage(status);
  }, [status]);
  const [currentStage, setCurrentStage] = useState(0);
  const navigate = useNavigate();

  const moveToStage = (status) => {
    switch (status) {
      case "Initiate":
        // navigate("/initiate-task");
        setCurrentStage(0);
        break;
      case "Under Review":
        setCurrentStage(1);
        break;
      case "Review":
        setCurrentStage(2);
        break;
      case "Under Approve":
        setCurrentStage(3);
        break;
      case "Approves":
        setCurrentStage(4);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col items-center p-4 pb-2 bg-slate-300">
      <div className="flex w-full max-w-4xl justify-between mb-2">
        {stages.map((stage, index) => (
          <div
            key={index}
            className={`flex-1 text-center p-2 cursor-pointer border rounded 
            ${index < currentStage ? "bg-green-500 text-white" : ""} 
            ${index === currentStage ? "bg-orange-500 text-white" : ""} 
            ${index > currentStage ? "bg-gray-200" : ""} 
            ${index < stages.length - 1 ? "mr-1" : ""}`}
            // onClick={() => moveToStage(index, stage)}
          >
            {stage}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
