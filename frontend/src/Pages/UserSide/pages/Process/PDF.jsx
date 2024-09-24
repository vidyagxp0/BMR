import { IconButton, Tooltip } from '@mui/material';
import axios from 'axios';
import React from 'react'
import { FaRegFilePdf } from 'react-icons/fa';
import { BASE_URL } from "../../../../config.json";

const PDF = ({data}) => {

    async function generateReport() {
        // Create the confirmation popup container
        const confirmationContainer = document.createElement("div");
        confirmationContainer.style.position = "fixed";
        confirmationContainer.style.top = "20px"; // Adjusted top position
        confirmationContainer.style.left = "50%";
        confirmationContainer.style.transform = "translate(-50%, 0)";
        confirmationContainer.style.backgroundColor = "#ffffff";
        confirmationContainer.style.border = "1px solid #ccc";
        confirmationContainer.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
        confirmationContainer.style.padding = "20px";
        confirmationContainer.style.borderRadius = "5px";
        confirmationContainer.style.zIndex = "1000";
        confirmationContainer.style.width = "300px";
    
        // Create the confirmation message
        const confirmationMessage = document.createElement("div");
        confirmationMessage.textContent =
          "Are you sure you want to generate the PDF?";
        confirmationMessage.style.fontSize = "16px";
        confirmationMessage.style.marginBottom = "15px";
    
        // Create the buttons container
        const buttonsContainer = document.createElement("div");
        buttonsContainer.style.textAlign = "center";
    
        // Create the confirm button
        const confirmButton = document.createElement("button");
        confirmButton.textContent = "Confirm";
        confirmButton.style.padding = "10px 20px";
        confirmButton.style.margin = "0 10px";
        confirmButton.style.cursor = "pointer";
        confirmButton.style.border = "none";
        confirmButton.style.borderRadius = "5px";
        confirmButton.style.backgroundColor = "#4CAF50";
        confirmButton.style.color = "white";
        confirmButton.style.fontSize = "14px";
    
        // Create the cancel button
        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.style.padding = "10px 20px";
        cancelButton.style.margin = "0 10px";
        cancelButton.style.cursor = "pointer";
        cancelButton.style.border = "none";
        cancelButton.style.borderRadius = "5px";
        cancelButton.style.backgroundColor = "#f44336";
        cancelButton.style.color = "white";
        cancelButton.style.fontSize = "14px";
    
        // Append buttons to the buttons container
        buttonsContainer.appendChild(confirmButton);
        buttonsContainer.appendChild(cancelButton);
    
        // Append message and buttons to the confirmation container
        confirmationContainer.appendChild(confirmationMessage);
        confirmationContainer.appendChild(buttonsContainer);
    
        // Append the confirmation container to the document body
        document.body.appendChild(confirmationContainer);
    
        // Add event listener to the confirm button
        confirmButton.addEventListener("click", async () => {
          try {
            // Close the confirmation popup
            confirmationContainer.remove();
    
            // Make API request to generate PDF
            const response = await axios({
              url: `${BASE_URL}/bmr-form/generate-report`,
              method: "POST",
              responseType: "blob",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user-token")}`,
                "Content-Type": "application/json",
              },
              data: {
                reportData: data[0],
              },
            });
    
            // Create a blob URL for the PDF content
            const url = window.URL.createObjectURL(new Blob([response.data]));
    
            // Create an anchor element to trigger the download
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = `BMRform${data[0].bmr_id}.pdf`;
            document.body.appendChild(a);
            a.click();
    
            // Clean up the blob URL
            window.URL.revokeObjectURL(url);
    
            // Display success message as styled popup
            const successMessage = document.createElement("div");
            successMessage.textContent = "PDF generated successfully!";
            successMessage.style.position = "fixed";
            successMessage.style.top = "20px";
            successMessage.style.left = "50%";
            successMessage.style.transform = "translateX(-50%)";
            successMessage.style.backgroundColor =
              "rgba(76, 175, 80, 0.8)"; /* Green for success */
            successMessage.style.color = "white";
            successMessage.style.padding = "15px";
            successMessage.style.borderRadius = "5px";
            successMessage.style.zIndex = "1000";
            successMessage.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
            successMessage.style.fontSize = "14px";
            document.body.appendChild(successMessage);
    
            // Remove the success message after 3 seconds
            setTimeout(() => {
              successMessage.remove();
            }, 3000);
          } catch (error) {
            console.error("Error:", error);
            // Display error message as styled popup
            const errorMessage = document.createElement("div");
            errorMessage.textContent =
              "Failed to generate PDF. Please try again later.";
            errorMessage.style.position = "fixed";
            errorMessage.style.top = "20px";
            errorMessage.style.left = "50%";
            errorMessage.style.transform = "translateX(-50%)";
            errorMessage.style.backgroundColor =
              "rgba(244, 67, 54, 0.8)"; /* Red for error */
            errorMessage.style.color = "white";
            errorMessage.style.padding = "15px";
            errorMessage.style.borderRadius = "5px";
            errorMessage.style.zIndex = "1000";
            errorMessage.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
            errorMessage.style.fontSize = "14px";
            document.body.appendChild(errorMessage);
    
            // Remove the error message after 3 seconds
            setTimeout(() => {
              errorMessage.remove();
            }, 3000);
          }
        });
    
        // Add event listener to the cancel button
        cancelButton.addEventListener("click", () => {
          // Close the confirmation popup
          confirmationContainer.remove();
    
          // Display cancel message as styled popup
          const cancelMessage = document.createElement("div");
          cancelMessage.textContent = "PDF generation canceled.";
          cancelMessage.style.position = "fixed";
          cancelMessage.style.top = "20px";
          cancelMessage.style.left = "50%";
          cancelMessage.style.transform = "translateX(-50%)";
          cancelMessage.style.backgroundColor =
            "rgba(183, 28, 28, 0.8)"; /* Dark red for cancel */
          cancelMessage.style.color = "white";
          cancelMessage.style.padding = "15px";
          cancelMessage.style.borderRadius = "5px";
          cancelMessage.style.zIndex = "1000";
          cancelMessage.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
          cancelMessage.style.fontSize = "14px";
          document.body.appendChild(cancelMessage);
    
          // Remove the cancel message after 3 seconds
          setTimeout(() => {
            cancelMessage.remove();
          }, 3000);
        });
      }
  return (
    <div>
         <Tooltip title="Generate PDF">
                <IconButton>
                  <FaRegFilePdf
                    size={28}
                    className="flex justify-center text-gray-50 hover:  items-center cursor-pointer "
                    onClick={() => {
                      generateReport();
                    }}
                  />
                </IconButton>
              </Tooltip>
    </div>
  )
}

export default PDF