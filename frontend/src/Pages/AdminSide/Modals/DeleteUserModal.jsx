import React from "react";
import { useDispatch } from "react-redux";
import { deleteUser, fetchUsers } from "../../../userSlice";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteUserModal = ({ onClose, id, setAllUsers }) => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    axios
      .delete(`http://195.35.6.197:7000/user/delete-user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      })
      .then((response) => {
        toast.success("User deleted successfully!");
        setAllUsers((previousUsers) =>
          previousUsers.filter((user) => user.user_id !== id)
        );

        setTimeout(() => {
          onClose();
          dispatch(deleteUser(id));
          dispatch(fetchUsers());
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
