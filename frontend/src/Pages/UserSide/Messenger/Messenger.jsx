import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config.json";
import "./Messenger.css";

function Messenger() {
  const [chats, setChats] = useState([]);
  console.log(chats, "chats");
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("chats");
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));

  useEffect(() => {
    axios
      .get(`${BASE_URL}/message/get-recent-chats`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user-token"),
        },
      })
      .then((response) => setChats(response.data))
      .catch((error) => console.error("Error fetching recent chats:", error));

    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/get-all-users`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("user-token"),
          },
        });
        const filteredUsers = response.data.response.filter(
          (user) => user.user_id !== userDetails.userId
        );
        setAllUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [userDetails.userId]);

  return (
    <div className="messenger">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "chats" ? "active" : ""}`}
          onClick={() => setActiveTab("chats")}
        >
          Chats
        </button>
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
      </div>
      <div className="content">
        {activeTab === "chats" ? (
          chats.length > 0 ? (
            <ul>
              {chats.map((chat) => (
                <li key={chat.id} className="chat-item">
                  <h1
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/chat/${
                          chat.senderId === userDetails.userId
                            ? chat.receiverId
                            : chat.senderId
                        }`,
                        { state: chat.Receiver }
                      )
                    }
                  >
                    Chat with{" "}
                    {chat.senderId === userDetails.userId
                      ? chat.Receiver.name
                      : chat.Sender.name}
                    - Last message: {chat.message}
                  </h1>
                </li>
              ))}
            </ul>
          ) : (
            <h1>No recent Chats</h1>
          )
        ) : (
          <ul>
            {allUsers.map((user) => (
              <li key={user.user_id} className="user-item">
                <h1
                  className="cursor-pointer"
                  onClick={() =>
                    navigate(`/chat/${user.user_id}`, { state: user })
                  }
                >
                  Chat with {user.name}
                </h1>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Messenger;
