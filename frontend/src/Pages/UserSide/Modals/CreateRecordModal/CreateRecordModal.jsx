import { useState, useEffect } from "react";
import "../General.css";
import "./CreateRecordModal.css";
import axios from "axios";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import Select from "react-select";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addBmr } from "../../../../userSlice";

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

function CreateRecordModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    reviewers: [],
    approvers: [],
  });
  const [reviewers, setReviewers] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [isSelectedReviewer, setIsSelectedReviewer] = useState([]);
  console.log(isSelectedReviewer, "isSelectedReview");
  const [isSelectedApprover, setIsSelectedApprover] = useState([]);
  const dispatch = useDispatch();

  const addBMRs = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://192.168.1.17:7000/bmr-form/add-bmr",
        {
          name: formData.name,
          reviewers: isSelectedReviewer.map((reviewer) => ({
            reviewerId: reviewer.value,
            status: "pending",
            reviewer: reviewer.label,
            date_of_review: "NA",
            comment: null,
          })),
          approvers: isSelectedApprover.map((approver) => ({
            approverId: approver.value,
            status: "pending",
            approver: approver.label,
            date_of_approval: "NA",
            comment: null,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        toast.success("BMR added successfully!");
        dispatch(addBmr(response.data.bmr));
        setFormData({ name: "", reviewers: [], approvers: [] });
        setTimeout(() => {
          onClose();
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        toast.error("BMR Already Registered");
      });
  };

  useEffect(() => {
    const config = {
      method: "post",
      url: "http://192.168.1.17:7000/bmr-form/get-user-roles",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
      data: {
        role_id: 3,
      },
    };

    axios(config)
      .then((response) => {
        const reviewerOptions = [
          ...new Map(
            response.data.message.map((role) => [
              role.user_id,
              {
                value: role.user_id,
                label: `${role.User.name}`,
              },
            ])
          ).values(),
        ];
        setReviewers(reviewerOptions);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    const newConfig = {
      method: "post",
      url: "http://192.168.1.17:7000/bmr-form/get-user-roles",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        "Content-Type": "application/json",
      },
      data: {
        role_id: 4,
      },
    };

    axios(newConfig)
      .then((response) => {
        console.log(response, "response");
        const approverOptions = [
          ...new Map(
            response.data.message.map((role) => [
              role.user_id,
              {
                value: role.user_id,
                label: `${role.User.name}`,
              },
            ])
          ).values(),
        ];
        setApprovers(approverOptions);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      reviewer: isSelectedReviewer,
      approver: isSelectedApprover,
    });
  }, [isSelectedReviewer, isSelectedApprover]);

  return (
    <>
      <Modal open={true} onClose={onClose}>
        <Box sx={modalStyle}>
          <div className="flex justify-center items-center pb-5 font-bold">
            <Typography
              variant="h6"
              component="h2"
              style={{ fontWeight: "bold" }}
            >
              Add BMR
            </Typography>
          </div>
          <form onSubmit={addBMRs}>
            <TextField
              label="BMR Name"
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
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
              <label htmlFor="" className="text-sm text-blue-500">
                Reviewer
              </label>
              <Select
                name="reviewers"
                isMulti
                options={reviewers}
                value={isSelectedReviewer}
                onChange={(selected) => setIsSelectedReviewer(selected)}
              />
            </div>

            <div>
              <label htmlFor="" className="text-sm text-blue-500">
                Approver
              </label>
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
                Add BMR
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}

export default CreateRecordModal;
