import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserVerificationPopUp from "../../../../../Components/UserVerificationPopUp/UserVerificationPopUp";

const DeleteModal = ({
  onClose,
  id,
  newTab,
  setNewTab,
  newSection,
  section_id,
  itemType,
  fetchBMRData,
  bmr_field_id,
}) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleVerificationSubmit = async (verified) => {
    console.log("Verification data:", verified);
    try {

      if (itemType === "tab") {
        const response = await axios.delete(
          `https://bmrapi.mydemosoftware.com/bmr-form/delete-bmr-tab/${id}`,
        {    
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
          data:{
            email: verified.email,
            password: verified.password,
            declaration: verified.declaration,
          }}
        );
        const updatedTabs = newTab.filter((tab) => tab.bmr_tab_id !== id);
        setNewTab(updatedTabs);
        toast.success("Tab deleted successfully!");
      } else if (itemType === "section") {
        const response = await axios.delete(
          `https://bmrapi.mydemosoftware.com/bmr-form/delete-bmr-section/${section_id}`,
          {    
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
            data:{
              email: verified.email,
              password: verified.password,
              declaration: verified.declaration,
            }}
        );
        const updatedSections = newTab.map((tab) => {
          if (tab.BMR_sections) {
            return {
              ...tab,
              BMR_sections: tab.BMR_sections.filter(
                (section) => section.bmr_field_id !== bmr_field_id
              ),
            };
          }
          return tab;
        });
        setNewTab(updatedSections);
        toast.success("Field deleted successfully!");
      } else if (itemType === "field") {
        const response = await axios.delete(
          `https://bmrapi.mydemosoftware.com/bmr-form/delete-bmr-field/${bmr_field_id}`,
         { headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          "Content-Type": "application/json",
        },
          data:{
            email: verified.email,
            password: verified.password,
            declaration: verified.declaration,
          }}
        );
        const updatedSections = newTab.map((tab) => {
          if (tab.BMR_fields) {
            return {
              ...tab,
              BMR_fields: tab.BMR_fields.filter(
                (field) => field.bmr_section_id !== section_id
              ),
            };
          }
          return tab;
        });
        setNewTab(updatedSections);
        toast.success("Section deleted successfully!");
      }

      fetchBMRData();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting item!");
    }
  };

  const handleDelete = () => {
    setShowVerificationModal(true);
  };

  const handleVerificationClose = () => {
    setShowVerificationModal(false);
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Delete {itemType}
          </h2>
          <p className="text-center">
            Are you sure you want to delete this {itemType}?
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Confirm
            </button>
          </div>
        </div>
        <ToastContainer />
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

export default DeleteModal;
