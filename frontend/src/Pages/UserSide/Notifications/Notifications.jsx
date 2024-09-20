import React, { useEffect, useState } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
// import { isToday, isThisWeek } from 'date-fns';
import "./Notifications.css"; // Import CSS file for styling
import {BASE_URL} from "../../../config.json"

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const userDetails = JSON.parse(localStorage.getItem("user-details"));
  const [socket, setSocket] = useState(null);

  // const notifications2 = [
  //   {
  //     title: "assignReviewer",
  //     data: { bmrName: "BMR 123" },
  //     createdAt: new Date().toISOString(),
  //   },
  //   {
  //     title: "assignApprover",
  //     data: { bmrName: "BMR 456" },
  //     createdAt: new Date().toISOString(),
  //   },
  //   {
  //     title: "reminderReviewer",
  //     data: { bmrName: "BMR 789" },
  //     createdAt: new Date().toISOString(),
  //   },
  //   {
  //     title: "reminderApprover",
  //     data: { bmrName: "BMR 101" },
  //     createdAt: new Date().toISOString(),
  //   },
  //   {
  //     title: "reminderInitiator",
  //     data: { bmrName: "BMR 202" },
  //     createdAt: new Date().toISOString(),
  //   },
  // ];

  useEffect(() => {
    setSocket(socketIOClient(`${BASE_URL}/`));
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
      .get(`${BASE_URL}/bmr-form/get-user-notifications`, {
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
        `${BASE_URL}/bmr-form/read-notification`,
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
    <div className="p-4 w-full h-full mx-auto shadow-lg rounded-lg">
      <h4 className="text-xl font-serif font-semibold  text-center mb-4">
        Notifications
      </h4>
      {notifications.length > 0 ? (
        notifications.map((notif, index) => (
          <div
            key={index}
            className="p-4 mb-3  bg-[#D9EAF6] rounded-lg  hover:bg-[#eff3ff] border-1 shadow-lg transition duration-300 ease-in-out"
          >
            <p className="text-gray-800 mb-2">
              <b className="text-blue-600">{notif.title}</b>:{" "}
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
                : `Notification Issue`}
            </p>
            <small className="text-gray-500">
              {formatDistanceToNow(new Date(notif.createdAt))} ago
            </small>
          </div>
        ))
      ) : (
        <div className="flex items-center mt-48 justify-center flex-col gap-3">
          <img className="w-16" src="no-spam.png" alt="" />
          <p className="text-gray-500 text-center w-full items-center justify-center  ">
            No Notifications !
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
