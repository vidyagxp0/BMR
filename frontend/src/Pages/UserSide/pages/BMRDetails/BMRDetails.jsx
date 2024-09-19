import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./BMRDetails.css"; // Assuming you'll create a CSS file

const BMRDetails = ({
  selectedBMR,
  dateOfInitiation,
  initiatorName,
  dynamicFields,
  selectedReviewers,
  selectedApprovers,
}) => {
  // const { bmr_id } = useParams();
  // const [bmrData, setBmrData] = useState(null);
  // // console.log(bmrData?.message[0], "********************************");
  // console.log(bmrData?.message[0].BMR_Tabs[0].tab_name, "2222222222");

  // useEffect(() => {
  //   axios
  //     .get(`http://192.168.1.39:7000/bmr-form/get-all-bmr`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("user-token")}`,
  //       },
  //     })
  //     .then((response) => {
  //       setBmrData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Failed to fetch BMR details:", error);
  //     });
  // }, [bmr_id]);

  // if (!bmrData) {
  //   return <div>Loading...</div>;
  // }

  // // Random data, as mentioned earlier
  // const bmrDetails = bmrData.message[0];
  // const detailsArray = [
  //   `BMR ID: ${bmrDetails.bmr_id}`,
  //   `Name: ${bmrDetails.name}`,
  //   `Status: ${bmrDetails.status}`,
  //   `Stage: ${bmrDetails.stage}`,
  //   `Date of Initiation: ${bmrDetails.date_of_initiation}`,
  //   `Due Date: ${bmrDetails.due_date}`,
  //   `Description: ${bmrDetails.description}`,
  //   `Department ID: ${bmrDetails.department_id}`,
  //   `Initiator: ${bmrDetails.initiator}`,
  //   `Is Active: ${bmrDetails.isActive}`,
  // ];

  // const randomDetails = detailsArray
  //   .sort(() => 0.5 - Math.random())
  //   .slice(0, 10);

  return (
    <div className="bmr-container">
      <h1 className="text-blue-950 font-bold text-2xl text-center mb-4">
        Initiated BMR's Details
      </h1>
      <div>
        {/* Use the props data here */}
        <p>BMR Name: {selectedBMR.name}</p>
        <p>Date of Initiation: {dateOfInitiation}</p>
        <p>Initiator Name: {initiatorName}</p>
        {/* Render more details from dynamicFields, selectedReviewers, and selectedApprovers */}
      </div>

      {/* <div className="flex gap-4">
        {bmrData.map((tab, index) => {
          <button key={index} className="status-btn">
            {tab.tab_name}
          </button>;
        })}
        <button className="status-btn ">
          {bmrData?.message[0].BMR_Tabs[0].tab_name}
        </button>
        <button className="status-btn ">
          {bmrData?.message[1].BMR_Tabs[1].tab_name}
        </button>
        <button className="status-btn ">
          {bmrData?.message[2].BMR_Tabs[2].tab_name}
        </button>
        <button className="status-btn">UNDER APPROVAL</button>
        <button className="status-btn">APPROVED</button>
      </div>

      <div className="flex gap-4 mb-4 mt-3 rounded-md">
        <button className="tab-btn">Initiator Remarks</button>
        <button className="tab-btn">Reviewer Remarks</button>
        <button className="tab-btn">Approver Remarks</button>
      </div>

      <div className="bmr-details-container">
        <div className="form-group">
          <label>Initiator Name</label>
          <input
            type="text"
            value={bmrData?.message[0].name}
            readOnly
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Date of Initiation</label>
          <input
            type="text"
            value={bmrData?.message[0].date_of_initiation}
            readOnly
            className="input-field"
          />
        </div>

        <div className="form-group full-width">
          <label>Initiator Comments</label>
          <textarea
            className="input-field"
            value={bmrData?.message[0].description}
            placeholder="No comments"
          />
        </div>
      </div> */}

      {/* <div className="random-details">
        <h2>Random BMR Details</h2>
        <ul>
          {randomDetails.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default BMRDetails;
