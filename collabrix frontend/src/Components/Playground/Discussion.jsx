import React, { useEffect, useState, useRef } from "react";
import api from "../../Services/api";

const Discussion = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  // Auto-scroll to the bottom of the chat container
  const scrollToBottom = (behavior = "smooth") => {
    chatEndRef.current?.scrollIntoView({ behavior });
  };

  // ==========================================
  // GET DISCUSSION MESSAGES
  // ==========================================
  const fetchMessages = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      setError("");

      const response = await api.get(`/playground/${projectId}/discussion`);
      setMessages(response.data || []);
    } catch (err) {
      console.error("DISCUSSION ERROR:", err);
      setError("Failed to load discussion messages. Please try again.");
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMessages(true);
    }
  }, [projectId]);

  useEffect(() => {
    scrollToBottom(loading ? "auto" : "smooth");
  }, [messages, loading]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const handleSend = async () => {
    const trimmedContent = content.trim();
    if (!trimmedContent || sending) return;

    setSending(true);
    setError("");

    try {
      const response = await api.post(`/playground/${projectId}/discussion`, {
        content: trimmedContent,
      });

      // Clear input on success
      setContent("");

      // Optimistically append new message if API returns created object, else refetch
      if (response.data && response.data.id) {
        setMessages((prev) => [...prev, response.data]);
      } else {
        await fetchMessages();
      }
    } catch (err) {
      console.error("SEND MESSAGE ERROR:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Discussion
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Discuss ideas and updates with your project members.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* MESSAGES LIST */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Loading discussion...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="text-center">
              <h3 className="text-base font-medium text-zinc-700 dark:text-zinc-200">
                No messages yet
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Start the discussion with your team.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id || message.createdAt}
              className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900"
            >
              {/* PROFILE IMAGE */}
              <div className="flex-shrink-0">
                {message.profileImage ? (
                  <img
                    src={`${API_BASE_URL}${message.profileImage}`}
                    alt={message.username || "User"}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-white">
                    {message.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* MESSAGE CONTENT */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-zinc-900 dark:text-white">
                    {message.username || "Anonymous"}
                  </p>
                  <span className="text-xs text-zinc-400">
                    {message.createdAt
                      ? new Date(message.createdAt).toLocaleString()
                      : "Just now"}
                  </span>
                </div>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-zinc-600 dark:text-zinc-300">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* MESSAGE INPUT */}
      <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
        <div className="flex gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            rows={2}
            disabled={sending}
            aria-label="Discussion message input"
            className="flex-1 resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
          />

          <button
            onClick={handleSend}
            disabled={sending || !content.trim()}
            className="self-end rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>

        <p className="mt-2 text-xs text-zinc-400">
          Press Enter to send · Shift + Enter for a new line
        </p>
      </div>
    </div>
  );
};

export default Discussion;