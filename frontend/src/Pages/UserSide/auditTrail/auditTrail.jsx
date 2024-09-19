import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderTop from "../../../Components/Header/HeaderTop";

function AuditTrail() {
  const [auditTrails, setAuditTrails] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAuditTrail = async () => {
      //   if (location.state?.process === "Differential Pressure") {
      const myHeaders = {
        Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      };

      try {
        const response = await axios.get(
          `https://bmrapi.mydemosoftware.com/bmr-form/get-bmr-form-audit-trail/${location.state?.bmr_id}`,
          {
            headers: myHeaders,
          }
        );

        setAuditTrails(response.data.auditTrail);
      } catch (error) {
        console.error(error);
      }
      //   } else if (location.state?.process === "Temperature Records") {
      //     const myHeaders = {
      //       Authorization: `Bearer ${localStorage.getItem("user-token")}`,
      //     };

      //     try {
      //       const response = await axios.get(
      //         `http://https://bmrapi.mydemosoftware.com:1000/temprature-record/get-audit-trail-for-elog/${location.state?.formId}`,
      //         {
      //           headers: myHeaders,
      //         }
      //       );
      //       setAuditTrails(response.data.auditTrail);
      //     } catch (error) {
      //       console.error(error);
      //     }
      //   }
    };

    fetchAuditTrail();
  }, []);

  return (
    <>
      <style>
        {`
          .scrollable-container {
            max-height: 800px; /* Adjust this height as needed */
            overflow-y: auto;
            margin: 0 auto;
            width: 100%; /* Adjust the width as needed */
          }

          .scrollable-container::-webkit-scrollbar {
            width: 16px; /* Increased width of the scrollbar */
          }

          .scrollable-container::-webkit-scrollbar-track {
            background: #f1f1f1; /* Track color */
          }

          .scrollable-container::-webkit-scrollbar-thumb {
            background: #888; /* Scrollbar color */
            border-radius: 8px; /* More rounded corners for scrollbar */
          }

          .scrollable-container::-webkit-scrollbar-thumb:hover {
            background: #555; /* Darker scrollbar on hover */
          }

          .back-button-container {
            text-align: center;
            margin-top: 20px;
            position: fixed;
            bottom: 20px;
            width: 100%;
          }
        `}
      </style>

      <div className="admin-dashboard">
        <HeaderTop></HeaderTop>
        <div id="body-container" style={{ margin: "20px" }}>
          <h3 style={{ textAlign: "center", fontSize: "2em" }}>
            <strong>Audit Trail</strong>
          </h3>
          <br />
          <hr />
          {auditTrails?.length === 0 ? (
            <>No audit trails Available</>
          ) : (
            <div className="scrollable-container">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "#fff",
                  color: "#333",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 10px 2px rgba(0, 0, 0, 0.1)",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Checked By
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      Previous Value
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      New Value
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      Previous Status
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "10%",
                      }}
                    >
                      New Status
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Declaration
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Date & Time
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        width: "15%",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auditTrails.map((auditTrail, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "15%",
                        }}
                      >
                        {auditTrail.User.name}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "10%",
                        }}
                      >
                        {auditTrail.previous_value
                          ? auditTrail.previous_value
                          : "null"}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "10%",
                        }}
                      >
                        {
                          // Check if the value is a URL
                          /^https?:\/\/.*\//.test(auditTrail.new_value)
                            ? // Extract the file name after the last hyphen
                              auditTrail.new_value.substring(
                                auditTrail.new_value.lastIndexOf("-") + 1
                              )
                            : // If not a URL, display the original value
                              auditTrail.new_value
                        }
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "10%",
                        }}
                      >
                        {auditTrail.previous_status}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "10%",
                        }}
                      >
                        {auditTrail.new_status}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "15%",
                        }}
                      >
                        {auditTrail.declaration}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "15%",
                        }}
                      >
                        {new Date(auditTrail.createdAt).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          width: "15%",
                        }}
                      >
                        {auditTrail.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="back-button-container">
            <button
              className="themeBtn"
              onClick={() => navigate(-1)}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AuditTrail;
