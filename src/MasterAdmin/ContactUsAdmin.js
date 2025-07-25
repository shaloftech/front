import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const ContactUsAdmin = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:3009/");

    socketRef.current.on("userList", (userList) => setUsers(userList));
    socketRef.current.emit("getUsers");

    socketRef.current.on("messages", (messages) => setMessages(messages));

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const viewMessages = (user) => {
    setCurrentUser(user);
    setPopupVisible(true);
    socketRef.current.emit("getMessages", { userId: user._id });
  };

  const sendReply = async () => {
    if (loading) return;

    if (newReply.trim() || selectedImage) {
      setLoading(true);

      let uploadedImageUrl = null;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        try {
          const response = await axios.post(
            "https://trustcoinfx.trade/api/upload-image",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          if (response.data.success) {
            uploadedImageUrl = response.data.imageUrl;
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }

        setSelectedImage(null);
      }

      // Construct message payload
      const newMessageData = {
        userId: currentUser._id,
        message: newReply.trim() ? newReply : null,
        imageUrl: uploadedImageUrl ? uploadedImageUrl : null,
        isAdmin: true,
      };

      socketRef.current.emit("sendReply", newMessageData);

      // Update state to immediately show the new message
      setMessages((prevMessages) => [...prevMessages, newMessageData]);

      setNewReply("");
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="admin-chat-container">
      <h3>User Messages</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.message}</td>
              <td>
                <button onClick={() => viewMessages(user)}>View Message</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popupVisible && currentUser && (
        <div className="popup">
          <div className="popup-content">
            <h4>Conversation with User ID: {currentUser._id}</h4>

            <div className="messages-container">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.isAdmin ? "admin-message" : "user-message"
                  }`}
                >
                  {msg.message && <p>{msg.message}</p>}
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="Sent"
                      style={{ maxWidth: "200px", borderRadius: "10px" }}
                    />
                  )}
                </div>
              ))}
            </div>

            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Type your reply..."
            />

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setSelectedImage(e.target.files[0]);
                }
              }}
            />

            <div className="popup-actions">
              <button onClick={() => fileInputRef.current.click()}>
                📸 Upload Image
              </button>

              <button onClick={sendReply} disabled={loading}>
                {loading ? "Uploading..." : "Send Reply"}
              </button>

              <button onClick={() => setPopupVisible(false)}>Close</button>
            </div>

            {selectedImage && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
                <button onClick={() => setSelectedImage(null)}>❌</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .user-table {
          width: 100%;
          border-collapse: collapse;
        }
        .user-table th,
        .user-table td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 1000;
        }
        .popup-content {
          display: flex;
          flex-direction: column;
        }
        .popup-actions {
          margin-top: 10px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .messages-container {
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #ddd;
        }
        .message {
          padding: 10px;
          margin-bottom: 8px;
          border-radius: 10px;
        }
        .user-message {
          background-color: #f0f0f0;
          text-align: left;
        }
        .admin-message {
          background-color: #d1e7ff;
          text-align: right;
        }
        textarea {
          width: 100%;
          height: 80px;
          margin-top: 10px;
          padding: 8px;
          resize: none;
        }
        button {
          padding: 8px 12px;
          cursor: pointer;
        }
        .image-preview {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default ContactUsAdmin;
