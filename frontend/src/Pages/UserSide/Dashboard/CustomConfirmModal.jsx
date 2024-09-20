// CustomConfirmModal.js
import React from "react";
//import "./CustomConfirmModal.css"; // Add your styles here

const CustomConfirmModal = ({ onClose, onConfirm }) => {
  return (
    <div className="custom-confirm-modal">
      <div className="modal-content">
        <h2>Are you sure you want to log out?</h2>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </div>
  );
};

export default CustomConfirmModal;
