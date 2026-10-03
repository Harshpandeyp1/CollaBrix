import React, { useEffect, useRef, useState } from "react";
import api from "../Services/api";
import Navbar from "../Components/Navbar";

import {
  connectWebSocket,
  sendMessage as sendWebSocketMessage,
  disconnectWebSocket,
} from "../Services/webSocketService";


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


  // ----------------------------------------
  // REFS
  // ----------------------------------------

  const bottomRef = useRef(null);

  // Keeps the latest selected user available
  // inside the WebSocket callback.
  const selectedUserRef = useRef(null);


  // ----------------------------------------
  // KEEP selectedUserRef IN SYNC
  // ----------------------------------------

  useEffect(() => {

    selectedUserRef.current = selectedUser;

  }, [selectedUser]);


  // ----------------------------------------
  // FETCH INITIAL DATA
  // ----------------------------------------

  useEffect(() => {

    fetchCurrentUser();

    fetchConversations();

  }, []);


  // ----------------------------------------
  // WEBSOCKET CONNECTION
  // ----------------------------------------

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

      console.error("JWT token not found");

      return;
    }


    connectWebSocket(
      token,
      handleIncomingMessage
    );


    return () => {

      disconnectWebSocket();

    };

  }, []);


  // ----------------------------------------
  // FETCH CURRENT USER
  // ----------------------------------------

  const fetchCurrentUser = async () => {

    try {

      const response =
        await api.get("/profile/me");

      setCurrentUser(
        response.data.data
      );

    } catch (error) {

      console.error(
        "Error fetching current user:",
        error
      );

    }

  };


  // ----------------------------------------
  // FETCH CONVERSATIONS
  // ----------------------------------------

  const fetchConversations = async () => {

    try {

      const response =
        await api.get("/messages/conversations");

      setConversations(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Error fetching conversations:",
        error
      );

    }

  };


  // ----------------------------------------
  // FORMAT MESSAGE TIME
  // ----------------------------------------

  const formatMessageTime = (dateTime) => {

    if (!dateTime) {
      return "";
    }

    return new Date(
      dateTime
    ).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  };


  // ----------------------------------------
  // NORMALIZE MESSAGE
  // ----------------------------------------

  const normalizeMessagePayload = (
    message
  ) => {

    const rawContent =
      message?.content ??
      message?.message ??
      "";


    const senderId =
      message?.senderId ??
      message?.sender?.id ??
      null;


    const receiverId =
      message?.receiverId ??
      message?.receiver?.id ??
      null;


    const timestamp =
      message?.createdAt ??
      message?.sentAt ??
      message?.timestamp ??
      new Date().toISOString();


    return {

      ...message,

      id:
        message?.id ??
        message?.messageId ??
        `${senderId ?? "unknown"}-${receiverId ?? "unknown"}-${rawContent}-${timestamp}`,

      senderId,

      receiverId,

      content: rawContent,

      createdAt: timestamp,

    };

  };


  // ----------------------------------------
  // HANDLE INCOMING WEBSOCKET MESSAGE
  // ----------------------------------------

  const handleIncomingMessage = (
    receivedMessage
  ) => {

    console.log(
      "Incoming WebSocket message:",
      receivedMessage
    );


    const normalizedMessage =
      normalizeMessagePayload(
        receivedMessage
      );


    const senderId =
      Number(
        normalizedMessage.senderId
      );


    const receiverId =
      Number(
        normalizedMessage.receiverId
      );


    // IMPORTANT:
    // Read latest selected user from ref.
    const currentSelectedUser =
      selectedUserRef.current;


    const selectedUserId =
      Number(
        currentSelectedUser?.id
      );


    // ----------------------------------------
    // CHECK CURRENT CONVERSATION
    // ----------------------------------------

    const isCurrentConversation =
      senderId === selectedUserId ||
      receiverId === selectedUserId;


    if (isCurrentConversation) {

      setMessages(
        (previousMessages) => {

          const isDuplicate =
            previousMessages.some(
              (message) =>
                String(message.id) ===
                String(normalizedMessage.id)
            );


          if (isDuplicate) {

            return previousMessages;

          }


          return [
            ...previousMessages,
            normalizedMessage,
          ];

        }
      );

    }


    // ----------------------------------------
    // UPDATE CONVERSATION SIDEBAR
    // ----------------------------------------

    if (!senderId) {

      return;

    }


    setConversations(
      (previousConversations) => {

        const existingConversation =
          previousConversations.find(
            (conversation) =>
              Number(
                conversation.userId
              ) === senderId
          );


        const nextConversation = {

          userId: senderId,

          username:
            existingConversation?.username ??
            "New message",

          profileImage:
            existingConversation?.profileImage ??
            "",

          lastMessage:
            normalizedMessage.content,

          lastMessageAt:
            normalizedMessage.createdAt,

        };


        const updatedConversations =
          existingConversation

            ? previousConversations.map(
                (conversation) =>
                  Number(
                    conversation.userId
                  ) === senderId

                    ? nextConversation

                    : conversation
              )

            : [
                nextConversation,
                ...previousConversations,
              ];


        return [
          ...updatedConversations,
        ].sort(
          (a, b) => {

            return (
              new Date(
                b.lastMessageAt || 0
              ) -
              new Date(
                a.lastMessageAt || 0
              )
            );

          }
        );

      }
    );

  };


  // ----------------------------------------
  // FETCH MESSAGE HISTORY
  // ----------------------------------------

  const fetchMessages = async (
    userId
  ) => {

    setLoadingMessages(true);


    try {

      console.log(
        "Fetching messages for:",
        userId
      );


      const response =
        await api.get(
          `/messages/${userId}`
        );


      const normalizedMessages =
        (response.data || []).map(
          normalizeMessagePayload
        );


      setMessages(
        normalizedMessages
      );


    } catch (error) {

      console.error(
        "Error fetching messages:",
        error
      );


      setMessageError(
        "Failed to load messages."
      );


    } finally {

      setLoadingMessages(false);

    }

  };


  // ----------------------------------------
  // FETCH WHEN USER CHANGES
  // ----------------------------------------

  useEffect(() => {

    if (selectedUser?.id) {

      fetchMessages(
        selectedUser.id
      );

    }

  }, [selectedUser]);


  // ----------------------------------------
  // AUTO SCROLL
  // ----------------------------------------

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);


  // ----------------------------------------
  // SEND MESSAGE
  // ----------------------------------------

  const sendMessage = async (e) => {

    if (e) {
      e.preventDefault();
    }


    const trimmedMessage =
      messageInput.trim();


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (
      !trimmedMessage ||
      !selectedUser ||
      sendingMessage
    ) {

      return;

    }


    setSendingMessage(true);

    setMessageError("");


    // ----------------------------------------
    // CREATE OPTIMISTIC MESSAGE
    // ----------------------------------------

    const optimisticMessage = {

      id:
        `local-${Date.now()}-${selectedUser.id}`,

      senderId:
        currentUser?.id,

      receiverId:
        selectedUser.id,

      content:
        trimmedMessage,

      createdAt:
        new Date().toISOString(),

    };


    // ----------------------------------------
    // SHOW MESSAGE IMMEDIATELY
    // ----------------------------------------

    setMessages(
      (previousMessages) => [

        ...previousMessages,

        optimisticMessage,

      ]
    );


    // ----------------------------------------
    // UPDATE SIDEBAR IMMEDIATELY
    // ----------------------------------------

    setConversations(
      (previousConversations) => {

        const existingConversation =
          previousConversations.find(
            (conversation) =>
              Number(
                conversation.userId
              ) ===
              Number(
                selectedUser.id
              )
          );


        const nextConversation = {

          userId:
            selectedUser.id,

          username:
            selectedUser.username,

          profileImage:
            selectedUser.profileImage,

          lastMessage:
            trimmedMessage,

          lastMessageAt:
            optimisticMessage.createdAt,

        };


        const updatedConversations =
          existingConversation

            ? previousConversations.map(
                (conversation) =>
                  Number(
                    conversation.userId
                  ) ===
                  Number(
                    selectedUser.id
                  )

                    ? nextConversation

                    : conversation
              )

            : [
                nextConversation,
                ...previousConversations,
              ];


        return [
          ...updatedConversations,
        ].sort(
          (a, b) => {

            return (
              new Date(
                b.lastMessageAt || 0
              ) -
              new Date(
                a.lastMessageAt || 0
              )
            );

          }
        );

      }
    );


    // ----------------------------------------
    // SEND THROUGH WEBSOCKET
    // ----------------------------------------

    try {

      const sent =
        sendWebSocketMessage(
          selectedUser.id,
          trimmedMessage
        );


      // IMPORTANT:
      // WebSocket service must return true
      // when publish succeeds.
      if (!sent) {

        throw new Error(
          "WebSocket is not connected"
        );

      }


      console.log(
        "Message successfully sent through WebSocket"
      );


      // Clear input only after successful publish.
      setMessageInput("");


    } catch (error) {

      console.error(
        "Error sending message:",
        error
      );


      setMessageError(
        "Failed to send message. Please try again."
      );


      // ----------------------------------------
      // REMOVE FAILED OPTIMISTIC MESSAGE
      // ----------------------------------------

      setMessages(
        (previousMessages) =>
          previousMessages.filter(
            (message) =>
              message.id !==
              optimisticMessage.id
          )
      );

    } finally {

      setSendingMessage(false);

    }

  };


  // ----------------------------------------
  // SORT CONVERSATIONS
  // ----------------------------------------

  const sortedConversations =
    [...conversations].sort(
      (a, b) => {

        return (
          new Date(
            b.lastMessageAt || 0
          ) -
          new Date(
            a.lastMessageAt || 0
          )
        );

      }
    );


  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (

    <div className="
      h-screen
      flex
      flex-col
      bg-slate-100
      dark:bg-zinc-950
      overflow-hidden
    ">

      <Navbar />


      <div className="
        flex-1
        max-w-7xl
        w-full
        mx-auto
        p-6
        min-h-0
      ">

        <div className="
          grid
          grid-cols-12
          h-full
          bg-white
          dark:bg-zinc-900
          rounded-xl
          border
          border-slate-200
          dark:border-zinc-800
          overflow-hidden
        ">


          {/* ================================= */}
          {/* LEFT SIDE — CONVERSATIONS         */}
          {/* ================================= */}

          <div className="
            col-span-4
            border-r
            border-slate-200
            dark:border-zinc-800
            flex
            flex-col
            h-full
            min-h-0
          ">


            <div className="
              p-5
              border-b
              border-slate-200
              dark:border-zinc-800
              shrink-0
            ">

              <h1 className="
                text-xl
                font-semibold
                text-slate-900
                dark:text-white
              ">
                Messages
              </h1>

            </div>


            <div className="
              flex-1
              overflow-y-auto
              p-3
              space-y-1
              min-h-0
            ">

              {sortedConversations.map(
                (conversation) => {

                  const isSelected =
                    Number(
                      selectedUser?.id
                    ) ===
                    Number(
                      conversation.userId
                    );


                  return (

                    <button
                      key={
                        conversation.userId
                      }

                      onClick={() => {

                        setSelectedUser({

                          id:
                            conversation.userId,

                          username:
                            conversation.username,

                          profileImage:
                            conversation.profileImage,

                        });


                        setMessageInput("");

                        setMessageError("");

                      }}

                      className={`
                        w-full
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-lg
                        text-left
                        transition

                        ${
                          isSelected

                            ? "bg-slate-100 dark:bg-zinc-800"

                            : "hover:bg-slate-50 dark:hover:bg-zinc-800/50"
                        }
                      `}
                    >


                      <img
                        src={
                          conversation.profileImage ||
                          "/default-avatar.png"
                        }

                        alt={
                          conversation.username
                        }

                        className="
                          w-11
                          h-11
                          rounded-full
                          object-cover
                          shrink-0
                        "
                      />


                      <div className="
                        min-w-0
                        flex-1
                      ">

                        <p className="
                          font-medium
                          text-slate-900
                          dark:text-white
                          truncate
                        ">
                          {
                            conversation.username
                          }
                        </p>


                        {conversation.lastMessageAt && (

                          <span className="
                            text-xs
                            text-slate-400
                            dark:text-zinc-500
                            shrink-0
                          ">

                            {
                              formatMessageTime(
                                conversation.lastMessageAt
                              )
                            }

                          </span>

                        )}


                        <p className="
                          text-sm
                          text-slate-500
                          dark:text-zinc-400
                          truncate
                        ">

                          {
                            conversation.lastMessage ||
                            "No messages yet"
                          }

                        </p>

                      </div>


                    </button>

                  );

                }
              )}

            </div>

          </div>


          {/* ================================= */}
          {/* RIGHT SIDE — CHAT WINDOW          */}
          {/* ================================= */}

          <div className="
            col-span-8
            flex
            flex-col
            h-full
            min-h-0
          ">


            {!selectedUser ? (

              <div className="
                h-full
                flex
                items-center
                justify-center
                text-slate-500
                dark:text-zinc-400
              ">

                <p>
                  Select a connection to start messaging
                </p>

              </div>

            ) : (

              <div className="
                h-full
                flex
                flex-col
                min-h-0
              ">


                {/* Chat Header */}

                <div className="
                  p-5
                  border-b
                  border-slate-200
                  dark:border-zinc-800
                  flex
                  items-center
                  gap-3
                  shrink-0
                ">

                  <img
                    src={
                      selectedUser.profileImage ||
                      "/default-avatar.png"
                    }

                    alt={
                      selectedUser.username
                    }

                    className="
                      w-10
                      h-10
                      rounded-full
                      object-cover
                      shrink-0
                    "
                  />


                  <div>

                    <h2 className="
                      font-semibold
                      text-slate-900
                      dark:text-white
                    ">
                      {
                        selectedUser.username
                      }
                    </h2>


                    <p className="
                      text-xs
                      text-slate-500
                      dark:text-zinc-400
                    ">
                      Direct Message
                    </p>

                  </div>

                </div>


                {/* Messages Area */}

                <div className="
                  flex-1
                  p-5
                  overflow-y-auto
                  min-h-0
                ">


                  {loadingMessages ? (

                    <div className="
                      h-full
                      flex
                      items-center
                      justify-center
                      text-slate-500
                      dark:text-zinc-400
                    ">

                      Loading messages...

                    </div>

                  ) : messages.length === 0 ? (

                    <div className="
                      h-full
                      flex
                      items-center
                      justify-center
                      text-slate-500
                      dark:text-zinc-400
                    ">

                      No messages yet

                    </div>

                  ) : (

                    <div className="
                      space-y-3
                    ">

                      {messages.map(
                        (message) => {

                          const isMe =
                            Number(
                              message.senderId
                            ) ===
                            Number(
                              currentUser?.id
                            );


                          return (

                            <div
                              key={
                                message.id
                              }

                              className={`
                                flex
                                ${
                                  isMe
                                    ? "justify-end"
                                    : "justify-start"
                                }
                              `}
                            >

                              <div
                                className={`
                                  max-w-[70%]
                                  px-4
                                  py-2
                                  rounded-2xl

                                  ${
                                    isMe

                                      ? "bg-blue-600 text-white rounded-br-md"

                                      : "bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-bl-md"
                                  }
                                `}
                              >

                                <p className="
                                  break-words
                                ">
                                  {
                                    message.content
                                  }
                                </p>

                              </div>

                            </div>

                          );

                        }
                      )}


                      <div
                        ref={bottomRef}
                      />

                    </div>

                  )}

                </div>


                {/* Message Input */}

                <div className="
                  p-4
                  border-t
                  border-slate-200
                  dark:border-zinc-800
                  shrink-0
                ">


                  {messageError && (

                    <p className="
                      text-sm
                      text-red-500
                      mb-2
                    ">
                      {messageError}
                    </p>

                  )}


                  <form
                    onSubmit={sendMessage}
                    className="
                      flex
                      gap-3
                    "
                  >

                    <input

                      type="text"

                      placeholder="Write a message..."

                      className="
                        flex-1
                        px-4
                        py-3
                        rounded-lg
                        border
                        border-slate-300
                        dark:border-zinc-700
                        bg-white
                        dark:bg-zinc-800
                        text-slate-900
                        dark:text-white
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                      "

                      value={
                        messageInput
                      }

                      onChange={(e) =>
                        setMessageInput(
                          e.target.value
                        )
                      }

                    />


                    <button

                      type="submit"

                      className="
                        px-5
                        py-3
                        rounded-lg
                        bg-blue-600
                        text-white
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        transition
                        shrink-0
                      "

                      disabled={
                        !messageInput.trim() ||
                        !selectedUser ||
                        sendingMessage
                      }

                    >

                      {
                        sendingMessage
                          ? "Sending..."
                          : "Send"
                      }

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