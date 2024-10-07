import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../../userSlice";
import UserVerificationPopUp from "../../../Components/UserVerificationPopUp/UserVerificationPopUp";
import { BASE_URL } from "../../../config.json";

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
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rolesArray: [],
    profile_pic: null, // Will store the uploaded file
  });

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const dispatch = useDispatch();

  // Fetch roles from backend
  useEffect(() => {
    axios
      .get(`${BASE_URL}/user/get-all-roles`, {
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
        console.error("Error fetching roles:", error);
        toast.error("Failed to fetch roles");
      });
  }, []);

  // Set the user data into form when user is selected
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
        profile_pic: user.profile_pic, // If there is a profile picture URL
      });
    }
  }, [user, roles]);

  // Enable the update button only when data changes
  useEffect(() => {
    const isDataChanged =
      user.name !== formData.name ||
      user.email !== formData.email ||
      !areRolesSame(user.UserRoles, formData.rolesArray) ||
      formData.profile_pic !== user.profile_pic;

    setIsButtonEnabled(isDataChanged);
  }, [formData, user]);

  // Compare user roles for changes
  const areRolesSame = (userRoles, formRoles) => {
    if (userRoles.length !== formRoles.length) return false;
    const userRoleIds = userRoles.map((role) => role.role_id);
    const formRoleIds = formRoles.map((role) => role.value);
    return userRoleIds.every((id, index) => id === formRoleIds[index]);
  };

  // Handle form submit for verification
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowVerificationModal(true);
  };

  // API call to update the user
  const updateUser = async () => {
    try {
      const updatedFormData = new FormData(); // Using FormData for file upload
      updatedFormData.append("name", formData.name);
      updatedFormData.append("email", formData.email);
      updatedFormData.append("profile_pic", formData.profile_pic); // Append file

      formData.rolesArray.forEach((role) => {
        updatedFormData.append("rolesArray", role.value);
      });

      const response = await axios.put(
        `${BASE_URL}/user/edit-user/${user.user_id}`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
            Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          },
        }
      );

      console.log("API Response: ", response.data);
      toast.success("User details updated successfully!");

      // Update users in the frontend state
      setAllUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.user_id === user.user_id ? { ...u, ...formData } : u
        )
      );

      dispatch(fetchUsers());
      onClose();
    } catch (error) {
      console.error("API Error: ", error.response.data);
      toast.error("Failed to update user.");
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profile_pic: file });
  };

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle role selection changes
  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
    setFormData({
      ...formData,
      rolesArray: selectedOptions || [],
    });
  };

  const closeUserVerifiedModal = () => {
    setShowVerificationModal(false);
  };

  const handleVerificationSubmit = () => {
    updateUser();
    closeUserVerifiedModal();
  };

  const handleCancel = () => {
    onClose();
  };

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
              onChange={handleFileChange}
              fullWidth
              margin="normal"
            />
            {formData.profile_pic &&
              typeof formData.profile_pic === "string" && (
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
              className="mt-2"
            />
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isButtonEnabled}
              >
                Update
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Box>
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
