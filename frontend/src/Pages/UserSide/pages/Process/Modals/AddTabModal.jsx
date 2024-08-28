import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AtmButton from "../../../../../AtmComponents/AtmButton";

const AddTabModal = ({
  closeModal,
  addTab,
  updateTab,
  bmr_tab_id,
  existingTabName,
}) => {
  // Set tabName directly from props if in edit mode
  const [tabName, setTabName] = useState(
    updateTab === "edit" ? existingTabName : ""
  );

  const { bmr_id } = useParams();

  const handleSave = async () => {
    if (updateTab === "add") {
      try {
        const response = await axios.post(
          "http://195.35.6.197:7000/bmr-form/add-bmr-tab",
          {
            bmr_id: bmr_id,
            tab_name: tabName,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        addTab({ tab_name: tabName });
        closeModal();
      } catch (error) {
        console.error("Error adding tab:", error);
      }
    } else if (updateTab === "edit") {
      try {
        const response = await axios.put(
          `http://195.35.6.197:7000/bmr-form/edit-bmr-tab/${bmr_tab_id}`,
          {
            bmr_id: bmr_id,
            tab_name: tabName,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        addTab({ tab_name: tabName });
        closeModal();
      } catch (error) {
        console.error("Error editing tab:", error);
      }
    }
  };

  return (
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
  );
};

export default AddTabModal;
