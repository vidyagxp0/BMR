import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import UserVerificationPopUp from '../../../../Components/UserVerificationPopUp/UserVerificationPopUp';
import {BASE_URL} from "../../../../config.json"
const DeleteRecordModal = ({ onClose, id, setData }) => {
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const dispatch = useDispatch();
    const handleVerificationSubmit = (verified) => {
        axios
          .put(
            `${BASE_URL}/bmr-record/delete-bmr-record/${id}`,
            {
              email: verified.email,
              password: verified.password,
              declaration: verified.declaration,
              comments: verified.comments,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              },
            }
          )
          .then((response) => {
            toast.success("BMR Record deleted successfully!");
            setData((previousData) =>
              previousData.filter((user) => user.record_id !== id)
            );
            setTimeout(() => {
              onClose();
            }, 1000);
          })
          .catch((error) => {
            toast.error("Failed to delete BMR Record");
            console.error(error);
          });
      };
      
      const handleDelete = () => {
        setShowVerificationModal(true);
      };
    
      const handleVerificationClose = () => {
        setShowVerificationModal(false);
      };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-96">
      <h2 className="text-xl font-semibold mb-4 text-center">Delete BMR Record</h2>
      <p className="text-center">
        Are you sure you want to delete this Record?
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
    {showVerificationModal && (
      <UserVerificationPopUp
        onClose={handleVerificationClose}
        onSubmit={handleVerificationSubmit}
      />
    )}
  </div>
  )
}

export default DeleteRecordModal