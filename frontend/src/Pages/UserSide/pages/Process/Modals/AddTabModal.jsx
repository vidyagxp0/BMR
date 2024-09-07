import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AtmButton from "../../../../../AtmComponents/AtmButton";
import UserVerificationPopUp from "../../../../../Components/UserVerificationPopUp/UserVerificationPopUp";

const AddTabModal = ({
  closeModal,
  addTab,
  updateTab,
  bmr_tab_id,
  existingTabName,
  setIsPopupOpen,
}) => {
  const [tabName, setTabName] = useState(
    updateTab === "edit" ? existingTabName : ""
  );
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const { bmr_id } = useParams();
  const token = localStorage.getItem("user-token");

  const handleVerificationSubmit = async (verified) => {
    try {
      if (updateTab === "add") {
        await axios.post(
          "https://bmrapi.mydemosoftware.com/bmr-form/add-bmr-tab",
          {
            bmr_id: bmr_id,
            tab_name: tabName,
            email: verified.email,
            password: verified.password,
            declaration: verified.declaration,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        addTab({ tab_name: tabName });
      } else if (updateTab === "edit") {
        await axios.put(
          `https://bmrapi.mydemosoftware.com/bmr-form/edit-bmr-tab/${bmr_tab_id}`,
          {
            bmr_id: bmr_id,
            tab_name: tabName,
            email: verified.email,
            password: verified.password,
            declaration: verified.declaration,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        addTab({ tab_name: tabName });
      }
      closeModal();
    } catch (error) {
      console.error("Error saving tab:", error);
    }
  };

  const handleSave = () => {
    setShowVerificationModal(true);
  };

  const handleVerificationClose = () => {
    setShowVerificationModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm">
        <div
          className="bg-white p-4 rounded shadow-lg"
          style={{ width: "400px" }}
        >
          <h2 className="text-lg font-bold mb-4">
            {updateTab === "add" ? "Add Tab" : "Edit Tab"}
          </h2>
          <input
            type="text"
            placeholder="Tab Name"
            value={tabName}
            onChange={(e) => setTabName(e.target.value)}
            className="border border-gray-300 p-2 w-full mb-4 focus:outline-none focus:border-blue-500"
            style={{ border: "1px solid #ccc", padding: "8px", width: "100%" }}
          />
          <div className="flex justify-end space-x-2">
            <AtmButton
              label="Save"
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            />
            <AtmButton
              label="Cancel"
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
            />
          </div>
        </div>
      </div>
      {showVerificationModal && (
        <UserVerificationPopUp
          onClose={handleVerificationClose}
          onSubmit={handleVerificationSubmit}
        />
      )}
    </>
  );
};

export default AddTabModal;
