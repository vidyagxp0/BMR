import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const BMRDetails = () => {
  const { bmr_id } = useParams();
  const [bmrData, setBmrData] = useState(null);
  console.log(bmrData,"4865154632148512")

  useEffect(() => {
    axios
      .get(`http://192.168.1.34:7000/bmr-form/get-all-bmr`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      })
      .then((response) => {
        setBmrData(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch BMR details:", error);
      });
  }, [bmr_id]);

  if (!bmrData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>BMR Details for {bmrData.name}</h1>
      {/* <p>Date of Initiation: {formatDate(bmrData.date_of_initiation)}</p> */}
      <p>Division: {bmrData.division_id}</p>
      <p>Description: {bmrData.description}</p>
      {/* <p>Due Date: {formatDate(bmrData.due_date)}</p> */}
      <p>Status: {bmrData.status}</p>
      {/* Add more details as needed */}
    </div>
  );
};

export default BMRDetails;
