import React, { useState } from 'react';
import { Modal } from 'react-bootstrap'; // Or any modal library you use
import AtmInput from '../../../AtmComponents/AtmInput';
import AtmButton from '../../../AtmComponents/AtmButton';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../userSlice'; // Make sure this action exists

const UpdateUserModal = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(formData));
    onClose();
  };

  if (!user) return null;

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <AtmInput label="Name" name="name" value={formData.name} onChange={handleChange} />
          <AtmInput label="Email" name="email" value={formData.email} onChange={handleChange} />
          <AtmInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
          <div className="mt-3">
            <AtmButton label="Update" type="submit" />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateUserModal;
