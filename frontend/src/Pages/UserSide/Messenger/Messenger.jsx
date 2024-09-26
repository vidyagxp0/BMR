import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Messenger() {
  const [chats, setChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

  useEffect(() => {
    axios
      .get("http://localhost:7000/message/get-recent-chats", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      })
      .then((response) => {
        setChats(response.data);
      })
      .catch((error) => {
        console.error("Error fetching recent chats:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch all users using axios
    axios
      .get("http://localhost:7000/user/get-all-users", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      })
      .then((response) => {
        console.log(response.data.response);

        setAllUsers(response.data.response);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <div>
      <ul>
        {chats.length === 0 ? (
          <>
            <h1>No recent Chats</h1>
            {allUsers?.map((user) => (
              <li>
                <h1
                  className="cursor-pointer"
                  onClick={() => {
                    navigate(`/chat/${user.user_id}`, { state: user });
                  }}
                >
                  Chat with {user.name}
                </h1>{" "}
              </li>
            ))}
          </>
        ) : (
          <>
            <h1>Recent Chats</h1>
            {chats?.map((chat) => (
              <li>
                <h1
                  className="cursor-pointer"
                  onClick={() => {
                    navigate(
                      `/chat/${
                        chat.senderId === userDetails.userId
                          ? chat.receiverId
                          : chat.senderId
                      }`,
                      { state: chat.Receiver }
                    );
                  }}
                >
                  Chat with{" "}
                  {chat.senderId === userDetails.userId
                    ? chat.Receiver.name
                    : chat.Sender.name}
                  - Last message: {chat.message}
                </h1>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}

export default Messenger;
