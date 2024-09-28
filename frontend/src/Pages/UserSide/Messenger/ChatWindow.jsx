import React, { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config.json";

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
  }, []);

  useEffect(() => {
    setSocket(socketIOClient(`${BASE_URL}/`));
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

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
    messages.push(newMessage);
    socket.emit("sendMessage", newMessage);
    setMessage("");
  };

  return (
    <div>
      <h1>Chat with {location.state?.name}</h1>
      <div>
        {messages.map((msg) => (
          <p key={msg.id}>
            {msg.senderId || msg.sender}: {msg.message}
          </p>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatWindow;
