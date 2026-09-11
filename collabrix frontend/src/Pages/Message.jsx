import React, { useEffect, useRef, useState } from "react";
import api from "../Services/api"; // Adjust the import path based on your project structure
import Navbar from "../Components/Navbar"; // Adjust the import path based on your project structure

const Messages = () => {
  // ----------------------------------------
  // STATE
  // ----------------------------------------
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState("");

  const bottomRef = useRef(null);

  // ----------------------------------------
  // FETCH INITIAL DATA
  // ----------------------------------------
  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/profile/me");
      setCurrentUser(response.data.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await api.get("/messages/conversations");
      setConversations(response.data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const formatMessageTime=(dateTime)=>{
    if (!dateTime) return "";
    return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ----------------------------------------
  // FETCH & SYNC MESSAGES
  // ----------------------------------------
  const fetchMessages = async (userId) => {
    setLoadingMessages(true);
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedUser?.id) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----------------------------------------
  // SEND MESSAGE
  // ----------------------------------------
  const sendMessage = async (e) => {
    if (e) e.preventDefault();

    if (!messageInput.trim() || !selectedUser || sendingMessage) {
      return;
    }

    setSendingMessage(true);
    setMessageError("");

    try {
      const response = await api.post("/messages", {
        receiverId: selectedUser.id,
        content: messageInput.trim(),
      });

      setMessages((prevMessages) => [...prevMessages, response.data]);
      setMessageInput("");

      // Update last message in the conversation sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c.userId === selectedUser.id
            ? { ...c, lastMessage: response.data.content }
            : c
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessageError("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };
  
  const sortedConversations = [...conversations].sort((a, b) => {
    new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0);
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 h-[calc(100vh-120px)] bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
          
          {/* ================================= */}
          {/* LEFT SIDE — CONVERSATIONS         */}
          {/* ================================= */}
          <div className="col-span-4 border-r border-slate-200 dark:border-zinc-800 flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-zinc-800">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                Messages
              </h1>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {sortedConversations.map((conversation) => {
                const isSelected = selectedUser?.id === conversation.userId;
                return (
                  <button
                    key={conversation.userId}
                    onClick={() => {
                      setSelectedUser({
                        id: conversation.userId,
                        username: conversation.username,
                        profileImage: conversation.profileImage,
                      });
                      setMessageInput("");
                      setMessageError("");
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition ${
                      isSelected
                        ? "bg-slate-100 dark:bg-zinc-800"
                        : "hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <img
                      src={
                        conversation.profileImage || "/default-avatar.png"
                      }
                      alt={conversation.username}
                      className="w-11 h-11 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {conversation.username}
                      </p>
                      {conversation.lastMessageAt && (
                      <span className="text-xs text-slate-400 dark:text-zinc-500 shrink-0">
                          {formatMessageTime(conversation.lastMessageAt)}
                      </span>
                  )}
           
                      <p className="text-sm text-slate-500 dark:text-zinc-400 truncate">
                        {conversation.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================= */}
          {/* RIGHT SIDE — CHAT WINDOW          */}
          {/* ================================= */}
          <div className="col-span-8 flex flex-col h-full">
            {!selectedUser ? (
              <div className="h-full flex items-center justify-center text-slate-500 dark:text-zinc-400">
                <p>Select a connection to start messaging</p>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-3">
                  <img
                    src={
                      selectedUser.profileImage || "/default-avatar.png"
                    }
                    alt={selectedUser.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">
                      {selectedUser.username}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Direct Message
                    </p>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-5 overflow-y-auto">
                  {loadingMessages ? (
                    <div className="h-full flex items-center justify-center text-slate-500 dark:text-zinc-400">
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 dark:text-zinc-400">
                      No messages yet
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((message) => {
                        const isMe = message.senderId === currentUser?.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                                isMe
                                  ? "bg-blue-600 text-white rounded-br-md"
                                  : "bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-bl-md"
                              }`}
                            >
                              <p>{message.content}</p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={bottomRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 dark:border-zinc-800">
                  {messageError && (
                    <p className="text-sm text-red-500 mb-2">
                      {messageError}
                    </p>
                  )}

                  <form onSubmit={sendMessage} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Write a message..."
                      className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />

                    <button
                      type="submit"
                      className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition"
                      disabled={
                        !messageInput.trim() || !selectedUser || sendingMessage
                      }
                    >
                      {sendingMessage ? "Sending..." : "Send"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;