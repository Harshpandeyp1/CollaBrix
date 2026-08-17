import React, { useEffect, useState, useMemo } from "react";
import {
  Bell,
  UserPlus,
  FolderHeart,
  Loader2,
  Check,
  CheckCheck,
  RefreshCw,
  Inbox,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import {
  getNotifications,
  markNotificationAsRead,
} from "../Services/Notification.js";
import ProfileCard from "../Components/ProfileCard.jsx";

// Helper for relative timestamps
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [readLoading, setReadLoading] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "unread" | "read"
const navigate = useNavigate();

const handleNotificationClick = (notification) => {
  if (notification.type === "CONNECTION_REQUEST") {
    navigate("/connections");
    return;
  }

  if (notification.type === "PROJECT_INTEREST") {
    navigate(`/projects/${notification.referenceId}/interests`);
    return;
  }
};
  // =========================================
  // FETCH NOTIFICATIONS
  // =========================================
  const fetchNotifications = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================================
  // MARK INDIVIDUAL NOTIFICATION AS READ
  // =========================================
  const handleMarkAsRead = async (notificationId) => {
    try {
      setReadLoading(notificationId);
      await markNotificationAsRead(notificationId);

      setNotifications((previous) =>
        previous.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    } finally {
      setReadLoading(null);
    }
  };

  // =========================================
  // MARK ALL AS READ (BATCH)
  // =========================================
  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    try {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      await Promise.all(unread.map((n) => markNotificationAsRead(n.id)));
    } catch (error) {
      console.error("Error marking all as read:", error);
      fetchNotifications(); // Revert state on failure
    }
  };

  // =========================================
  // FILTERED DATA & COUNTS
  // =========================================
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (filter === "unread") return !item.read;
      if (filter === "read") return item.read;
      return true;
    });
  }, [notifications, filter]);

  // =========================================
  // ICON RENDERER
  // =========================================
  const getNotificationIcon = (type) => {
    switch (type) {
      case "CONNECTION_REQUEST":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 ring-1 ring-indigo-500/10">
            <UserPlus size={19} />
          </div>
        );
      case "PROJECT_INTEREST":
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 ring-1 ring-emerald-500/10">
            <FolderHeart size={19} />
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 ring-1 ring-slate-500/10">
            <Bell size={19} />
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      
      
      
      <main onClick={() => handleNotificationClick(notification)} className="min-h-[calc(100vh-4rem)] cursor-pointer w-full bg-linear-to-b from-sky-100 via-teal-100 to-blue-100
        dark:from-black
        dark:via-black
        dark:to-black px-4 py-8 ">
        <div className="mx-auto max-w-3xl">
        
          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  {unreadCount === 0
                    ? "All caught up"
                    : `${unreadCount} unread update${unreadCount === 1 ? "" : "s"}`}
                </p>
              </div>
            </div>
         
            {/* HEADER ACTIONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchNotifications(true)}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                title="Refresh notifications"
              >
                <RefreshCw
                  size={14}
                  className={refreshing ? "animate-spin" : ""}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* FILTER PILLS */}
          <div className="mb-4 flex items-center gap-1.5 border-b border-slate-200/80 pb-3 dark:border-zinc-800">
            {["all", "unread", "read"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  filter === tab
                    ? "bg-slate-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-slate-600 hover:bg-slate-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {tab}
                {tab === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
         
          {/* NOTIFICATION CARD CONTAINER */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            
            {/* SKELETON LOADING STATE */}
            {loading && (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex animate-pulse items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-zinc-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-zinc-800" />
                      <div className="h-2.5 w-1/4 rounded bg-slate-100 dark:bg-zinc-800/60" />
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-zinc-800" />
                  </div>
                ))}
              </div>
            )}
            
            {/* EMPTY STATE */}
            {!loading && filteredNotifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-zinc-800/50 dark:text-zinc-500">
                  <Inbox size={24} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  No notifications found
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                  {filter === "all"
                    ? "You're completely caught up with your feed."
                    : `No ${filter} notifications at this moment.`}
                </p>
              </div>
            )}

            {/* LIST */}
            {!loading && filteredNotifications.length > 0 && (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {filteredNotifications.map((notification) => {
                  const isUnread = !notification.read;
                  const isReading = readLoading === notification.id;

                  return (
                    <div
                      key={notification.id}
                      className={`group relative flex items-start gap-4 p-4 transition-colors ${
                        isUnread
                          ? "bg-indigo-50/30 hover:bg-indigo-50/60 dark:bg-indigo-950/10 dark:hover:bg-indigo-950/20"
                          : "hover:bg-slate-50/80 dark:hover:bg-zinc-800/40"
                      }`}
                    >
                      {/* UNREAD INDICATOR BAR */}
                      {isUnread && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 dark:bg-indigo-500" />
                      )}

                      {/* ICON */}
                      {getNotificationIcon(notification.type)}

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p
                          className={`text-sm leading-snug ${
                            isUnread
                              ? "font-medium text-slate-900 dark:text-white"
                              : "text-slate-600 dark:text-zinc-400"
                          }`}
                        >
                          {notification.message}
                        </p>

                        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-slate-400 dark:text-zinc-500">
                          <span>
                            {notification.type === "CONNECTION_REQUEST"
                              ? "Connection request"
                              : notification.type === "PROJECT_INTEREST"
                              ? "Project interest"
                              : "General update"}
                          </span>
                          {notification.createdAt && (
                            <>
                              <span>•</span>
                              <span>{formatRelativeTime(notification.createdAt)}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      {isUnread && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={isReading}
                          title="Mark as read"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 opacity-80 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 group-hover:opacity-100 disabled:cursor-wait dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400"
                        >
                          {isReading ? (
                            <Loader2 size={14} className="animate-spin text-indigo-600" />
                          ) : (
                            <Check size={14} />
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default Notifications;