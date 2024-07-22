import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../userSlice';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EditUserModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rolesArray: []
  });
  console.log(user,"sdfghjkl;")

  useEffect(() => {
    if (user) {
      const userRoles = user.UserRoles
        ? user.UserRoles.map(roleId => roles.find(option => option.value === roleId))
        : [];
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        rolesArray: userRoles.role
      });
    }
  }, [user, roles]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      rolesArray: formData.rolesArray?.map(option => option?.role),
      id: user.user_id // Ensure ID is included
    };

    console.log(updatedFormData,"<<<<<<<<<<<>>>>>>>>>>>");

    axios.put(`http://192.168.1.35:7000/user/edit-user/${user.user_id}`, updatedFormData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("admin-token")}`
      }
    }).then((response)=>{
      toast.success("User updated successfully!");
      onClose();
    }).catch((error)=>{
      toast.error(error.response.data.message);
      console.error(error);
    });

    dispatch(updateUser(updatedFormData));
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData({
      ...formData,
      rolesArray: selectedOptions || []
    });
  };

  if (!user) return null;

  useEffect(() => {
    axios.get("http://192.168.1.35:7000/user/get-all-roles", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        "Content-Type": "application/json",
      }
    }).then((response) => {
      const roleOptions = response.data.response.map(role => ({
        value: role.role_id,
        label: role.role
      }));
      setRoles(roleOptions);
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <Modal open={true} onClose={onClose}>
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
            label="Profile Pic"
            type="file"
            name="profile_pic"
            value={formData.profile_pic}/>
          <Select
            name="roles"
            options={roles}
            value={formData.rolesArray}
            isMulti
            onChange={handleSelectChange}
            placeholder="Select roles"
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Update
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
