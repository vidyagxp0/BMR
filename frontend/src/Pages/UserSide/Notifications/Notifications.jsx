import React, { useEffect, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
// import { isToday, isThisWeek } from 'date-fns';
import "./Notifications.css"; // Import CSS file for styling

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user-details"));
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(socketIOClient("http://192.168.1.34:7000/"));
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("register", userDetails.userId);
      socket.on("new_notification", (notification) => {
        setNotifications((prevNotifications) => [
          notification,
          ...prevNotifications,
        ]);
        console.log("New notification received:", notification);
      });
      return () => {
        socket.off("new_notification");
      };
    }
  }, [socket]);

  useEffect(() => {
    axios
      .get("http://192.168.1.34:7000/bmr-form/get-user-notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const notificationsWithTime = response.data.map((notif) => ({
          ...notif,
          createdAt: new Date(notif.createdAt || Date.now()), // Ensure each notification has a receivedAt time
        }));
        setNotifications(notificationsWithTime);
        // Call to mark notifications as read
        markNotificationsAsRead(
          response.data.map((notif) => notif.notification_id)
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const markNotificationsAsRead = (notificationIds) => {
    axios
      .put(
        "http://192.168.1.34:7000/bmr-form/read-notification",
        {
          notification_ids: notificationIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          },
        }
      )
      .then((response) => {
        console.log("Notifications marked as read:", response.data.message);
      })
      .catch((error) => {
        console.error("Error marking notifications as read", error);
      });
  };

  return (
    <div>
      <h4>Notifications</h4>
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <div key={index} className="notification-item">
            <p className="notification-message">
              <b>{notif.title}</b>:{" "}
              {notif.title === "assignReviewer"
                ? `You have been assigned as a Reviewer for BMR ${notif.data?.bmrName}.`
                : notif.title === "assignApprover"
                ? `You have been assigned as an Approver for BMR ${notif.data?.bmrName}.`
                : notif.title === "reminderReviewer"
                ? `BMR form '${notif.data?.bmrName}' is Under Review.`
                : notif.title === "reminderApprover"
                ? `BMR form '${notif.data?.bmrName}' is Under Approval.`
                : notif.title === "reminderInitiator"
                ? `BMR form '${notif.data?.bmrName}' is Under Initiation.`
                : `Notification Issue`}{" "}
            </p>
            <small className="notification-time">
              {formatDistanceToNow(new Date(notif.createdAt))} ago
            </small>
            <hr />
          </div>
        ))
      ) : (
        <p>No Notifications.</p>
      )}
    </div>
  );
};

export default Notifications;
