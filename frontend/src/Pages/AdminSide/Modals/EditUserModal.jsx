/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../../userSlice";
import UserVerificationPopUp from "../../../Components/UserVerificationPopUp/UserVerificationPopUp";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditUserModal = ({ user, onClose, setAllUsers }) => {
  const [roles, setRoles] = useState([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rolesArray: [],
    profile_pic: null,
  });

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("http://192.168.1.26:7000/user/get-all-roles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const roleOptions = response.data.response.map((role) => ({
          value: role.role_id,
          label: role.role,
        }));
        setRoles(roleOptions);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (user && roles.length > 0) {
      const userRoles = user.UserRoles.map((role) => ({
        value: role.role_id,
        label: role.role,
      }));
      setSelectedOptions(userRoles);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        rolesArray: userRoles,
        profile_pic: user.profile_pic,
      });
    }
  }, [user, roles]);

  useEffect(() => {
    const isDataChanged =
      user.name !== formData.name ||
      user.email !== formData.email ||
      !areRolesSame(user.UserRoles, formData.rolesArray) ||
      (formData.profile_pic && formData.profile_pic !== user.profile_pic);

    setIsButtonEnabled(isDataChanged);
  }, [formData, user]);

  const areRolesSame = (userRoles, formRoles) => {
    if (userRoles.length !== formRoles.length) return false;
    const userRoleIds = userRoles.map((role) => role.role_id);
    const formRoleIds = formRoles.map((role) => role.value);
    return userRoleIds.every((id, index) => id === formRoleIds[index]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowVerificationModal(true);
  };

  const updateUser = () => {
    const updatedFormData = {
      ...formData,
      rolesArray: formData.rolesArray.map((option) => option.value),
      id: user.user_id,
    };

    axios
      .put(
        `http://192.168.1.26:7000/user/edit-user/${user.user_id}`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          },
        }
      )
      .then((response) => {
        console.log("API Response: ", response.data);
        toast.success("User Details Updated Successfully");
        setAllUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.user_id === user.user_id ? { ...u, ...updatedFormData } : u
          )
        );
        setTimeout(() => {
          dispatch(fetchUsers());
          onClose();
        }, 500);
      })
      .catch((error) => {
        console.error("API Error: ", error.response.data);
        toast.error(error.response.data.message);
      });
  };

  const closeUserVerifiedModal = () => {
    setShowVerificationModal(false);
  };

  const handleVerificationSubmit = () => {
    updateUser();
    closeUserVerifiedModal();
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    setFormData({
      ...formData,
      rolesArray: selectedOptions || [],
    });
  };

  if (!user) return null;

  return (
    <>
      <ToastContainer />
      <Box open={true} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Edit User
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              type="file"
              name="profile_pic"
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            {formData.profile_pic && (
              <a
                href={formData.profile_pic}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Current Profile Picture
              </a>
            )}
            <Select
              name="roles"
              options={roles}
              value={selectedOptions}
              isMulti
              onChange={handleSelectChange}
              placeholder="Select roles"
              fullWidth
              className="mt-2"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!isButtonEnabled}
              sx={{ mt: 2 }}
            >
              Update
            </Button>
          </form>
        </Box>
      </Box>

      {showVerificationModal && (
        <UserVerificationPopUp
          onClose={closeUserVerifiedModal}
          onSubmit={handleVerificationSubmit}
        />
      )}
    </>
  );
};

export default EditUserModal;
