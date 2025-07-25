import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
// import "../wallet/WalletDashboard.css";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const ContactUs = () => {
  const sidebarRef = useRef();
  const chatBoxRef = useRef();
  const messageInputRef = useRef();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userId = localStorage.getItem("userId");
  const socketRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactUrls, setContactUrls] = useState({});
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]); // Runs only when messages change

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    socketRef.current = io("http://localhost:3009/");
    socketRef.current.emit("join", { userId });

    socketRef.current.on("messages", (msgs) => {
      setMessages(msgs);
      scrollToBottom();
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchContactUrls = async () => {
      try {
        const response = await axios.get(
          "https://trustcoinfx.trade/api/contact-urls"
        );
        setContactUrls(response.data);
      } catch (error) {
        console.error("Error fetching contact URLs:", error);
      }
    };

    fetchContactUrls();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const handleInputFocus = () => {
    setIsKeyboardOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsKeyboardOpen(false);
    }, 200);
  };

  const sendMessage = async () => {
    if (loading) return; // Prevent sending multiple images

    if (newMessage.trim() || selectedImage) {
      setLoading(true); // Start loading before upload

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
            socketRef.current.emit("sendImage", {
              userId,
              imageUrl: response.data.imageUrl,
            });
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }

        setSelectedImage(null);
      }

      if (newMessage.trim()) {
        socketRef.current.emit("sendMessage", { userId, message: newMessage });
        setNewMessage("");
      }

      setTimeout(scrollToBottom, 100);
      setLoading(false); // Stop loading after sending message
    }
  };

  return (
    <>
      <Header />
      <div
        className="container"
        style={{ height: isKeyboardOpen ? "55vh" : "82vh" }}
      >
        {/* <Sidebar
        sidebarRef={sidebarRef}
        userId={userId}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      /> */}

        <div className="chat-container">
          {!isKeyboardOpen && (
            <div
              className="social-icons"
              style={{
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <a
                href={contactUrls.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="fab fa-telegram fa-2x"
                  style={{ color: "#0088cc", padding: "10px" }}
                ></i>
              </a>
              <a
                href={contactUrls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="fab fa-whatsapp fa-2x"
                  style={{ color: "#25d366", padding: "10px" }}
                ></i>
              </a>
              <a
                href={`mailto:${contactUrls.email}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="fas fa-envelope fa-2x"
                  style={{ color: "#d14836", padding: "10px" }}
                ></i>
              </a>
            </div>
          )}
          {loading && (
            <div className="loading-overlay">
              <p>Uploading...</p>
            </div>
          )}

          <div
            className="chat-box"
            ref={chatBoxRef}
            style={{
              height: isKeyboardOpen ? "100px" : "calc(100vh - 250px)",
              overflowY: "auto", // Enable scrolling for previous messages
            }}
          >
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
                      alt="Uploaded"
                      style={{ maxWidth: "200px", borderRadius: "10px" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Type your message..."
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

            <button
              onClick={() => fileInputRef.current.click()}
              style={{ backgroundColor: "white", padding: "0px 0px 0px 0px" }}
            >
              <i
                className="fas fa-link "
                style={{ color: "black", padding: "10px" }}
              ></i>
            </button>

            <button onClick={sendMessage} disabled={loading}>
              {loading ? (
                "Uploading..."
              ) : (
                <i className="fa fa-arrow-right" aria-hidden="true"></i>
              )}
            </button>
          </div>

          {/* Preview selected image */}
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

        <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            width: 100%;
            overflow: hidden;
            transition: height 0.3s ease-in-out;
          }

          .chat-container {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
            max-width: 800px;
            margin: auto;
          }

          .chat-box {
            width: 100%;
            background-color: #f9f9f9;
            border-top: 1px solid #ddd;
            flex-grow: 1;
            transition: height 0.3s ease-in-out;
          }

          .messages-container {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            padding: 10px;
            gap: 10px;
          }

          .message {
            padding: 10px;
            border-radius: 15px;
            max-width: 70%;
            word-wrap: break-word;
          }

          .user-message {
            background-color: #d1e7ff;
            margin-left: auto;
            text-align: right;
          }

          .admin-message {
            background-color: #f0f0f0;
            margin-right: auto;
            text-align: left;
          }

          .message-input {
            position: sticky;
            bottom: 0;
            width: 100%;
            background-color: white;
            padding: 10px;
            border-top: 1px solid #ddd;
            display: flex;
            transition: all 0.3s ease-in-out;
          }

          .message-input input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin-right: 10px;
          }
          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            z-index: 1000;
          }

          .message-input button {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
        `}</style>
      </div>
      {/* {!isKeyboardOpen && <Footer />} */}
    </>
  );
};

export default ContactUs;
