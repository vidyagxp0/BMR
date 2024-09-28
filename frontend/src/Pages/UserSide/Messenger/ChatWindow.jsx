import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config.json";
import "./ChatWindow.css";

function ChatWindow() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const location = useLocation();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));
  const { userId } = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/message/messages/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user-token")}`,
          },
        });

        setMessages(res.data.message);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    const newSocket = socketIOClient(`${BASE_URL}/`);
    setSocket(newSocket);
    newSocket.emit("register", userDetails.userId);
    newSocket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userDetails.userId]);

  useEffect(() => {
    if (socket) {
      socket.emit("register", userDetails.userId);
      socket.on("receiveMessage", (message) => {
        console.log(message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [socket]);

  const sendMessage = async () => {
    const newMessage = {
      sender: userDetails.userId,
      receiver: userId,
      message: message,
    };
    newMessage.updatedAt = new Date();
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    socket.emit("sendMessage", newMessage);
    setMessage("");
  };

  return (
    <div className="chat-window">
      <h1 style={{ textAlign: "center" }}>
        <strong>{location.state?.name || "User"}</strong>
      </h1>
      <div className="message-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.senderId === userDetails.userId ||
              msg.sender === userDetails.userId
                ? "sent"
                : "received"
            }`}
          >
            <span>{msg.message}</span>
            <div className="timestamp">
              {new Date(msg.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
