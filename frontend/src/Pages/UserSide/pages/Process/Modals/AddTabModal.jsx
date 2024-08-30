import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AtmButton from "../../../../../AtmComponents/AtmButton";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [declaration, setDeclaration] = useState("");
  console.log(email, password, declaration, "doneeeeeee");

  const { bmr_id } = useParams();
  const token = localStorage.getItem("user-token");

  useEffect(() => {
    // Fetch the existing data when the modal opens for editing
    if (updateTab === "edit") {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://192.168.1.26:7000/bmr-form/get-bmr-tab/${bmr_tab_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const { email, password, declaration } = response.data;
          console.log(response, "fghf");
          setEmail(email);
          setPassword(password);
          setDeclaration(declaration);
        } catch (error) {
          console.error("Error fetching tab data:", error);
        }
      };

      fetchData();
    }
  }, [updateTab, bmr_tab_id, token]);

  const handleSave = async (very) => {
    try {
      const requestData = {
        bmr_id:very.bmr_id,
        tab_name: very.tabName,
        email: very.email,
        password: very.password,
        declaration: very.declaration,
      };
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
  
      if (updateTab === "add") {
        await axios.post(
          "http://192.168.1.26:7000/bmr-form/add-bmr-tab",
          requestData,
          config
        );
      } else if (updateTab === "edit") {
        await axios.put(
          `http://192.168.1.26:7000/bmr-form/edit-bmr-tab/${bmr_tab_id}`,
          requestData,
          config
        );
      }
  
      addTab({ tab_name: tabName });
      closeModal();
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error handling tab operation:", error.response ? error.response.data : error.message);
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
