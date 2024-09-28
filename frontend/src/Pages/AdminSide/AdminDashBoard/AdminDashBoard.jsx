import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import AtmTable from "../../../AtmComponents/AtmTable";
import AtmTable from "../../../AtmComponents/AtmTable";
import AtmButton from "../../../AtmComponents/AtmButton";
import { useNavigate } from "react-router-dom";
import DeleteUserModal from "../Modals/DeleteUserModal";
import EditUserModal from "../Modals/EditUserModal";
import ViewPermissionsModal from "../Modals/ViewPermissionsModal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import UpdateUser from "../Modals/UpdateUserModal";
import "react-toastify/dist/ReactToastify.css";
import ResetPasswordModal from "../Modals/ResetPasswordModal";
import { BASE_URL } from "../../../config.json";

const AdminDashBoard = () => {
  const navigate = useNavigate();
  const users = useSelector((state) => state.users.users);
  // console.log(users, "users");

  const [showViewPermissions, setShowViewPermissions] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [showDuplicateUser, setShowDuplicateUser] = useState(false);
  const [resestPassword, setResetPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Actions",
      accessor: "action",
      Cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setSelectedUser(user);
                setShowViewPermissions(true);
              }}
              className={`text-white bg-gray-600 border border-gray-900 hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 rounded-md mx-2 px-4 py-2`}
            >
              View Permissions
            </button>

            <button
              onClick={() => {
                setSelectedUser(user);
                setShowEditUser(true);
              }}
              className={`text-white bg-gray-600 border border-gray-900 hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 rounded-md mx-2 px-4 py-2`}
            >
              Edit
            </button>

            <button
              onClick={() => {
                setSelectedUser(user);
                setResetPassword(true);
              }}
              className={`text-white bg-gray-600 border border-gray-900 hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 rounded-md mx-2 px-4 py-2`}
            >
              Reset Password
            </button>

            <button
              onClick={() => {
                setSelectedUser(user);
                setShowDeleteUser(true);
              }}
              className={`text-white bg-gray-600 border border-gray-900 hover:bg-blue-600 hover:text-white shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 rounded-md mx-2 px-4 py-2`}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/get-all-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      })
      .then((response) => {
        setAllUsers(response.data.response);
      })
      .catch((error) => {
        toast.error("Error fetching users!");
        console.error(error);
      });
  }, []);

  return (
    <div>
      <div className="Header_Bottom shadow-xl my-3 py-5 bg-[#006FC0] overflow-hidden">
        <div className="headerBottomInner flex items-center">
          <div className="headerBottomLft mr-auto">
            <div className="navItem flex items-center">
              <i className="ri-home-3-fill mr-2 text-2xl text-[#000000]"></i>
              <h3 className="m-0 text-white text-2xl font-extralight">
                User Management
              </h3>
            </div>
          </div>
          <div
            className="headerBottomRgt"
            onClick={() => navigate("/admin-add-user")}
          >
            <button className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-4 rounded transition duration-300  w-25">
              Add User
            </button>
          </div>
        </div>
      </div>
      <AtmTable columns={columns} data={allUsers} />
      {showViewPermissions && (
        <ViewPermissionsModal
          user={selectedUser}
          onClose={() => setShowViewPermissions(false)}
          id={selectedUser?.user_id}
        />
      )}
      {showEditUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditUser(false)}
          setAllUsers={setAllUsers}
        />
      )}
      {showDeleteUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => setShowDeleteUser(false)}
          id={selectedUser?.user_id}
          setAllUsers={setAllUsers}
        />
      )}

      {showDuplicateUser && <UpdateUser />}
      {resestPassword && (
        <ResetPasswordModal
          onClose={() => setResetPassword(false)}
          setAllUsers={setAllUsers}
          user={selectedUser}
          id={selectedUser?.user_id}
        />
      )}
      {/* <ToastContainer /> */}
    </div>
  );
};

export default AdminDashBoard;
