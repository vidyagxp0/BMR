import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

function ChatWindow() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const location = useLocation();
  const userDetails = JSON.parse(localStorage.getItem("user-details"));
  const { userId } = useParams();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7000/message/messages/${userId}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("user-token"),
            },
          }
        );
        setMessages(res.data.message);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Initialize socket connection
    socketRef.current = io.connect("http://localhost:7000");
    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    const newMessage = {
      sender: userDetails.userId,
      receiver: userId,
      message: message,
    };
    messages.push(newMessage);
    socketRef.current.emit("sendMessage", newMessage);
    setMessage("");
  };

  return (
    <div>
      <h1>Chat with {location.state.name}</h1>
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
