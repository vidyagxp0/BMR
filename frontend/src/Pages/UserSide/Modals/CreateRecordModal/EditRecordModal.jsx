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
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
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
        comment: null
      })),
      approvers: isSelectedApprover.map((approver) => ({
        approverId: approver.value,
        status: "pending",
        comment: null
      }))
    };
    
    console.log('Updated BMR Data:', updatedBMRData); // Debug log

    axios.put(`http://192.168.1.14:7000/bmr/edit-bmr/${bmrData.bmr_id}`, updatedBMRData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
        toast.success("BMR updated successfully!");
        console.log('Response Data:', response.data); // Debug log
        dispatch(updateBmr(response.data.bmr));
        fetchBMRData(); // Refresh data
        onClose();
      }).catch((err) => {
        console.error('Error updating BMR:', err.response ? err.response.data : err); // Improved error log
        toast.error("Failed to update BMR");
      });
  }

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const reviewerResponse = await axios.post("http://192.168.1.14:7000/bmr/get-user-roles", {
          role_id: 3,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        });
        const reviewerOptions = reviewerResponse.data.message.map((role) => ({
          value: role.user_id,
          label: role.User.name,
        }));
        setReviewers(reviewerOptions);

        const approverResponse = await axios.post("http://192.168.1.14:7000/bmr/get-user-roles", {
          role_id: 4,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        });
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
      const selectedReviewers = bmrData.reviewers.map(reviewer => ({
        value: reviewer.reviewerId,
        label: reviewers.find(r => r.value === reviewer.reviewerId)?.label || "Unknown",
      }));
      const selectedApprovers = bmrData.approvers.map(approver => ({
        value: approver.approverId,
        label: approvers.find(a => a.value === approver.approverId)?.label || "Unknown",
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
        <div className="flex justify-center items-center pb-5 font-bold">
          <Typography variant="h6" component="h2" style={{ fontWeight: "bold" }}>
            Edit BMR
          </Typography>
        </div>
        <form onSubmit={updateBMR}>
          <TextField
            label="BMR Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <label htmlFor="" className="text-sm text-blue-500">Reviewer</label>
            <Select
              name="reviewers"
              isMulti
              options={reviewers}
              value={isSelectedReviewer}
              onChange={(selected) => setIsSelectedReviewer(selected)}
            />
          </div>
          <div>
            <label htmlFor="" className="text-sm text-blue-500">Approver</label>
            <Select
              name="approvers"
              options={approvers}
              isMulti
              value={isSelectedApprover}
              onChange={(selected) => setIsSelectedApprover(selected)}
            />
          </div>
          <div className="flex gap-5">
            <Button
              type="button"
              variant="contained"
              color="error"
              fullWidth
              sx={{ mt: 2 }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Update BMR
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}

export default EditRecordModal;
