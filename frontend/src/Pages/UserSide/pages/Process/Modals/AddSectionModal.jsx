import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AtmButton from "../../../../../AtmComponents/AtmButton";
import UserVerificationPopUp from "../../../../../Components/UserVerificationPopUp/UserVerificationPopUp";

const AddSectionModal = ({
  closeModal,
  addSection,
  bmr_tab_id,
  bmr_section_id,
  updateSection,
  existingSectionName,
}) => {
  const [sectionName, setSectionName] = useState(
    updateSection === "edit-section" ? existingSectionName : ""
  );
  const [limit, setLimit] = useState();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { bmr_id } = useParams();

  const handleVerificationSubmit = async (verified) => {
    if (updateSection === "add-section") {
      try {
        const response = await axios.post(
          `http://192.168.1.21:7000/bmr-form/add-bmr-section`,
          {
            bmr_id: bmr_id,
            bmr_tab_id: bmr_tab_id,
            section_name: sectionName,
            limit: limit,
            email: verified.email,
            password: verified.password,
            declaration: verified.declaration,
            comments: verified.comments,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        addSection(sectionName);
        closeModal();
      } catch (error) {
        console.error("Error adding tab:", error);
      }
    } else if (updateSection === "edit-section") {
      try {
        const response = await axios.put(
          `http://192.168.1.21:7000/bmr-form/edit-bmr-section/${bmr_section_id}`,
          {
            bmr_id: bmr_id,
            bmr_tab_id: bmr_tab_id,
            section_name: sectionName,
            limit: limit,
            email: verified.email,
            password: verified.password,
            declaration: verified.declaration,
            comments: verified.comments,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        addSection(sectionName);
        closeModal();
      } catch (error) {
        console.error("Error adding tab:", error);
      }
    } else if (updateSection === "edit-section") {
      try {
        const response = await axios.put(
          `http://192.168.1.21:7000/bmr-form/edit-bmr-section/${bmr_section_id}`,
          {
            bmr_id: bmr_id,
            bmr_tab_id: bmr_tab_id,
            section_name: sectionName,
            limit: limit,
            email: verified.email,
            password: verified.password,
            declaration: verified.declaration,
            comments: verified.comments,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        addSection(sectionName);
        closeModal();
      } catch (error) {
        console.error("Error adding tab:", error);
      }
    } else if (updateSection === "edit-section") {
      try {
        const response = await axios.put(
          `http://192.168.1.21:7000/bmr-form/edit-bmr-section/${bmr_section_id}`,
          {
            bmr_id: bmr_id,
            bmr_tab_id: bmr_tab_id,
            section_name: sectionName,
            limit: limit,
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
        addSection(sectionName);
        closeModal();
      } catch (error) {
        console.error("Error adding tab:", error);
      }
    }
  };

  const handleVerificationClose = () => {
    setShowVerificationModal(false);
  };

  const handleSave = () => {
    setShowVerificationModal(true);
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-filter backdrop-blur-sm">
        <div
          className="bg-wihte border-2 bg-white p-4 rounded shadow-lg"
          style={{ width: "400px" }}
        >
          <h2 className="text-lg font-bold mb-4">
            {updateSection === "add-section" ? "Add Section" : "Edit Section"}
          </h2>
          <label htmlFor="">Section name</label>
          <input
            type="text"
            placeholder="Section Name"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            className="border border-gray-300 p-2 w-full mb-4  focus:outline-none focus:border-blue-500"
            style={{ border: "1px solid #ccc", padding: "8px", width: "100%" }}
          />
          <label htmlFor="">Limit</label>
          <select
            name="section"
            id="section"
            className="w-full border border-black mb-2"
            style={{ border: "1px solid gray" }}
            onChange={(e) => setLimit(e.target.value)}
            value={limit}
          >
            <option value="select_limit">Select Limit</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
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
    </div>
  );
};
export default AddSectionModal;
