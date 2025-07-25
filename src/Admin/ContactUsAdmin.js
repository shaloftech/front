import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const ContactUsAdmin = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newReply, setNewReply] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = io("http://localhost:3002/");

    socketRef.current.on("userList", (userList) => setUsers(userList));
    socketRef.current.on("messages", (msgs) => setMessages(msgs));

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const loadMessages = (userId) => {
    setCurrentUserId(userId);
    socketRef.current.emit("getMessages", { userId });
  };

  const sendReply = () => {
    if (newReply.trim() && currentUserId) {
      socketRef.current.emit("sendReply", {
        userId: currentUserId,
        message: newReply,
      });
      setNewReply("");
    }
  };

  return (
    <div className="admin-chat-container">
      <div className="user-list">
        <h3>Users</h3>
        {users.map((user) => (
          <div
            key={user.id}
            className={`user-item ${user.id === currentUserId ? "active" : ""}`}
            onClick={() => loadMessages(user.id)}
          >
            {user.name}
          </div>
        ))}
      </div>
      <div className="chat-box">
        <h3>Chat</h3>
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.userId === currentUserId ? "message user" : "message admin"
              }
            >
              {msg.message}
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Type your reply..."
          />
          <button onClick={sendReply}>Reply</button>
        </div>
      </div>
    </div>
  );
};

export default ContactUsAdmin;
