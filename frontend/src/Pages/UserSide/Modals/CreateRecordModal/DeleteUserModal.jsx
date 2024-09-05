import React from "react";
import { useDispatch } from "react-redux";
import { deleteBmr, fetchBmr } from "../../../../userSlice";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteUserModal = ({ onClose, id, setData }) => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    axios
      .delete(`https://bmrapi.mydemosoftware.com/bmr-form/delete-bmr/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        toast.success("BMR deleted successfully!");
        setData((previousData) =>
          previousData.filter((user) => user.bmr_id !== id)
        );
        setTimeout(() => {
          onClose();
          dispatch(deleteBmr(id));
          dispatch(fetchBmr());
        }, 1000);
      })
      .catch((error) => {
        toast.error("Failed to delete user");
        console.error(error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Delete User</h2>
        <p className="text-center">
          Are you sure you want to delete this user?
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
  );
};

export default DeleteUserModal;
