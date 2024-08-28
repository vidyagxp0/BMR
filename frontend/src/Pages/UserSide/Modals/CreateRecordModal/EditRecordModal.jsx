import { useState, useEffect } from "react";
import "../General.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import Select from "react-select";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateBmr } from "../../../../userSlice";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '90%',
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const EditRecordModal = ({ onClose, bmrData, fetchBMRData }) => {
  const [formData, setFormData] = useState({
    name: bmrData.name || "",
    reviewers: [],
    approvers: [],
  });
  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [isSelectedReviewer, setIsSelectedReviewer] = useState([]);
  const [isSelectedApprover, setIsSelectedApprover] = useState([]);
  const dispatch = useDispatch();

  const updateBMR = (e) => {
    e.preventDefault();
    const updatedBMRData = {
      name: formData.name,
      reviewers: isSelectedReviewer.map((reviewer) => ({
        reviewerId: reviewer.value,
        status: "pending",
        comment: null,
      })),
      approvers: isSelectedApprover.map((approver) => ({
        approverId: approver.value,
        status: "pending",
        comment: null,
      })),
    };

    axios
      .put(
        `http://195.35.6.197:7000/bmr-form/edit-bmr/${bmrData.bmr_id}`,
        updatedBMRData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        dispatch(updateBmr(response.data.bmr));
        fetchBMRData(); // Refresh data
        toast.success("BMR updated successfully!");
        onClose();
      })
      .catch((err) => {
        console.error(
          "Error updating BMR:",
          err.response ? err.response.data : err
        ); // Improved error log
        toast.error("Failed to update BMR");
      });
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const reviewerResponse = await axios.post(
          "http://195.35.6.197:7000/bmr-form/get-user-roles",
          {
            role_id: 3,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const reviewerOptions = reviewerResponse.data.message.map((role) => ({
          value: role.user_id,
          label: role.User.name,
        }));
        setReviewers(reviewerOptions);

        const approverResponse = await axios.post(
          "http://195.35.6.197:7000/bmr-form/get-user-roles",
          {
            role_id: 4,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user-token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const approverOptions = approverResponse.data.message.map((role) => ({
          value: role.user_id,
          label: role.User.name,
        }));
        setApprovers(approverOptions);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (bmrData && reviewers.length > 0 && approvers.length > 0) {
      const selectedReviewers = bmrData.reviewers.map((reviewer) => ({
        value: reviewer.reviewerId,
        label:
          reviewers.find((r) => r.value === reviewer.reviewerId)?.label ||
          "Unknown",
      }));
      const selectedApprovers = bmrData.approvers.map((approver) => ({
        value: approver.approverId,
        label:
          approvers.find((a) => a.value === approver.approverId)?.label ||
          "Unknown",
      }));

      setFormData({
        name: bmrData.name,
        reviewers: selectedReviewers,
        approvers: selectedApprovers,
      });

      setIsSelectedReviewer(selectedReviewers);
      setIsSelectedApprover(selectedApprovers);
    }
  }, [bmrData, reviewers, approvers]);

  return (
    <Modal open={true} onClose={onClose}>
    <Box sx={modalStyle}>
      <Typography variant="h6" component="h2" align="center" gutterBottom>
        Edit BMR
      </Typography>
      <form onSubmit={updateBMR} className="space-y-4">
        <TextField
          label="BMR Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          variant="outlined"
          InputProps={{
            style: {
              height: "48px",
            },
          }}
          InputLabelProps={{
            style: {
              top: "0",
            },
          }}
        />
        <div>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Reviewer
          </Typography>
          <Select
            name="reviewers"
            isMulti
            options={reviewers}
            value={isSelectedReviewer}
            onChange={(selected) => setIsSelectedReviewer(selected)}
            styles={{
              control: (provided) => ({
                ...provided,
                borderColor: '#d0d0d0',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#a0a0a0',
                },
              }),
            }}
          />
        </div>
        <div>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Approver
          </Typography>
          <Select
            name="approvers"
            isMulti
            options={approvers}
            value={isSelectedApprover}
            onChange={(selected) => setIsSelectedApprover(selected)}
            styles={{
              control: (provided) => ({
                ...provided,
                borderColor: '#d0d0d0',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#a0a0a0',
                },
              }),
            }}
          />
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outlined"
            color="error"
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Update BMR
          </Button>
        </div>
      </form>
    </Box>
  </Modal>
  );
};

export default EditRecordModal;
