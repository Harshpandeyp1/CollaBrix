
import React, { useEffect, useRef, useState } from "react";
import api from "../Services/api" // Adjust the import path based on your project structure
import Navbar from "../Components/Navbar"; // Adjust the import path based on your project structure
const Messages = () => {

    // ----------------------------------------
    // STATE
    // ----------------------------------------

    // Logged-in user
    const [currentUser, setCurrentUser] = useState(null);

    // Accepted connections
    const [connections, setConnections] = useState([]);

    // User currently selected for chatting
    const [selectedUser, setSelectedUser] = useState(null);
     
    const [messages, setMessages] = useState([]);

    const [messageInput, setMessageInput] = useState("");

    const [loadingMessages, setLoadingMessages] = useState(false);
    // ----------------------------------------
    // FETCH DATA WHEN PAGE LOADS
    // ----------------------------------------

    useEffect(() => {
        fetchCurrentUser();
        fetchConnections();
    }, []);


    // ----------------------------------------
    // FETCH CURRENT USER
    // ----------------------------------------

    const fetchCurrentUser = async () => {

        try {

            const response = await api.get("/profile/me");

            // Your API response:
            // response.data.data = actual profile

            setCurrentUser(response.data.data);

        } catch (error) {

            console.error(
                "Error fetching current user:",
                error
            );
        }
    };


    // ----------------------------------------
    // FETCH ACCEPTED CONNECTIONS
    // ----------------------------------------

    const fetchConnections = async () => {

        try {

            const response = await api.get("/connections");

            setConnections(response.data);

        } catch (error) {

            console.error(
                "Error fetching connections:",
                error
            );
        }
    };


    // ----------------------------------------
    // FIND THE OTHER USER
    // ----------------------------------------

    const getOtherUser = (connection) => {

        if (connection.sender.id === currentUser.id) {

            return connection.receiver;

        }

        return connection.sender;
    };

    const fetchMessages = async (userId) => {
    setLoadingMessages(true);

    try {
        const response = await api.get(`/messages/${userId}`);
        setMessages(response.data);
    } catch (error) {
        console.error("Error fetching messages:", error);
    } finally {
        setLoadingMessages(false);
    }
};

 useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.id);
        }
    }, [selectedUser]);

    const sendMessage = async () => {
    if (!messageInput.trim() || !selectedUser) {
        return;
    }

    try {
        const response = await api.post("/messages", {
            receiverId: selectedUser.id,
            content: messageInput.trim()
        });

        setMessages((prevMessages) => [
            ...prevMessages,
            response.data
        ]);

        setMessageInput("");

    } catch (error) {
        console.error("Error sending message:", error);
    }
};

const bottomRef=useRef(null);

useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
    // ----------------------------------------
    // UI
    // ----------------------------------------

    return (

        <div className="
            min-h-screen
            bg-slate-100
            dark:bg-zinc-950
            
        ">
            <Navbar />

            <div className="
                max-w-7xl
                mx-auto
                p-6
            ">

                <div className="
                    grid
                    grid-cols-12
                    h-[calc(100vh-120px)]
                    bg-white
                    dark:bg-zinc-900
                    rounded-xl
                    border
                    border-slate-200
                    dark:border-zinc-800
                    overflow-hidden
                ">


                    {/* ================================= */}
                    {/* LEFT SIDE — CONNECTIONS            */}
                    {/* ================================= */}

                    <div className="
                        col-span-4
                        border-r
                        border-slate-200
                        dark:border-zinc-800
                    ">

                        {/* Header */}

                        <div className="
                            p-5
                            border-b
                            border-slate-200
                            dark:border-zinc-800
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


                        {/* Connection List */}

                        <div className="p-3">

                            {currentUser && connections.map(
                                (connection) => {

                                    const otherUser =
                                        getOtherUser(connection);

                                    return (

                                        <button
                                            key={connection.id}
                                           onClick={() => {
                                            setSelectedUser(otherUser);
                                            setMessageInput("");
                                        }}
                                            className="
                                                w-full
                                                flex
                                                items-center
                                                gap-3
                                                p-3
                                                rounded-lg
                                                text-left
                                                hover:bg-slate-100
                                                dark:hover:bg-zinc-800
                                                transition
                                            "
                                        >

                                            {/* Profile Image */}

                                            <img
                                                src={
                                                    otherUser.profileImage ||
                                                    "/default-avatar.png"
                                                }
                                                alt={
                                                    otherUser.username
                                                }
                                                className="
                                                    w-11
                                                    h-11
                                                    rounded-full
                                                    object-cover
                                                "
                                            />


                                            {/* User Information */}

                                            <div>

                                                <p className="
                                                    font-medium
                                                    text-slate-900
                                                    dark:text-white
                                                ">
                                                    {
                                                        otherUser.username
                                                    }
                                                </p>

                                                <p className="
                                                    text-sm
                                                    text-slate-500
                                                    dark:text-zinc-400
                                                ">
                                                    Connected
                                                </p>

                                            </div>

                                        </button>

                                    );
                                }
                            )}

                        </div>

                    </div>


                    {/* ================================= */}
                    {/* RIGHT SIDE — CHAT WINDOW           */}
                    {/* ================================= */}

                    <div className="
                        col-span-8
                    ">

                        {!selectedUser ? (

                            // Nothing selected

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

                            // User selected

                            <div className="
                                h-full
                                flex
                                flex-col
                            ">


                                {/* Chat Header */}

                                <div className="
                                    p-5
                                    border-b
                                    border-slate-200
                                    dark:border-zinc-800
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
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
                                                text-sm
                                                text-slate-500
                                                dark:text-zinc-400
                                            ">
                                                Connected
                                            </p>

                                        </div>

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
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={
                                        message.senderId === currentUser.id
                                            ? "flex justify-end"
                                            : "flex justify-start"
                                    }
                                >
                                    <div
                                        className={`
                                            max-w-[70%]
                                            px-4
                                            py-2
                                            rounded-2xl
                                            ${
                                                message.senderId === currentUser.id
                                                    ? "bg-blue-600 text-white rounded-br-md"
                                                    : "bg-slate-200 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-bl-md"
                                            }
                                        `}
                                    >
                                        <p>{message.content}</p>
                                    </div>
                                </div>
                            ))}

                            <div ref={bottomRef} />
                        </div>
                    )}

                </div>

                                {/* Message Input */}

                                <div className="
                                    p-4
                                    border-t
                                    border-slate-200
                                    dark:border-zinc-800
                                ">

                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            sendMessage();
                                        }}
                                        className="
                                        flex
                                        gap-3
                                    ">

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
                                             value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
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
                                                disabled:hover:bg-blue-600
                                                transition
                                            "
                                              onClick={sendMessage}
                                            disabled={!messageInput.trim() || !selectedUser}
                                        >
                                            Send
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

