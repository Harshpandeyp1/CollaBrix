import React, { useEffect, useState, useMemo } from "react";
import {
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Loader2,
  ChevronRight,
  Inbox,
  Search,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../Components/Navbar.jsx";
import PeopleMayKnow from "../Components/PeopleMayKnow.jsx";

import {
  getConnectionRequests,
  updateConnectionStatus,
  getMyConnections,
} from "../Services/Connection.js";

const PREVIEW_COUNT = 4;

const Connection = () => {
  // =========================================
  // STATE
  // =========================================

  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [requestActionLoading, setRequestActionLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [showAllPeople, setShowAllPeople] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [showAllConnections, setShowAllConnections] = useState(false);

  // =========================================
  // READ REQUEST ID FROM URL
  // =========================================

  const [searchParams, setSearchParams] = useSearchParams();

  const requestId = searchParams.get("request");

  // =========================================
  // DATA FETCHING
  // =========================================

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);

      const data = await getConnectionRequests();

      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchConnections = async () => {
    try {
      setLoadingConnections(true);

      const data = await getMyConnections();

      setConnections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching connections:", error);
      setConnections([]);
    } finally {
      setLoadingConnections(false);
    }
  };

  const handleRefreshAll = async () => {
    setRefreshing(true);

    await Promise.all([
      fetchRequests(),
      fetchConnections(),
    ]);

    setRefreshing(false);
  };

  useEffect(() => {
    fetchRequests();
    fetchConnections();
  }, []);

  // =========================================
  // HIGHLIGHT REQUEST FROM NOTIFICATION
  // =========================================

  useEffect(() => {
    if (!requestId || requests.length === 0) {
      return;
    }

    const targetRequest = document.getElementById(
      `connection-request-${requestId}`
    );

    if (targetRequest) {
      targetRequest.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [requestId, requests]);

  // =========================================
  // ACCEPT / REJECT HANDLER
  // =========================================

  const handleRequestStatus = async (
    connectionId,
    status
  ) => {
    const previousRequests = [...requests];

    // Optimistically remove request
    setRequests((prev) =>
      prev.filter(
        (req) => req.id !== connectionId
      )
    );

    setRequestActionLoading(connectionId);

    try {
      await updateConnectionStatus(
        connectionId,
        status
      );

      if (status === "ACCEPTED") {
        await fetchConnections();
      }

      // Remove ?request=20 from URL
      setSearchParams({});
    } catch (error) {
      console.error(
        "Error updating connection:",
        error
      );

      // Rollback
      setRequests(previousRequests);

      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Unable to update connection request";

      alert(message);
    } finally {
      setRequestActionLoading(null);
    }
  };

  // =========================================
  // FILTERED CONNECTIONS
  // =========================================

  const filteredConnections = useMemo(() => {
    if (!searchQuery.trim()) {
      return connections;
    }

    const query =
      searchQuery.toLowerCase();

    return connections.filter(
      (user) =>
        user?.fullName
          ?.toLowerCase()
          .includes(query) ||
        user?.username
          ?.toLowerCase()
          .includes(query)
    );
  }, [connections, searchQuery]);

  // =========================================
  // VISIBLE DATA
  // =========================================

  const visibleRequests = showAllRequests
    ? requests
    : requests.slice(
        0,
        PREVIEW_COUNT
      );

  const visibleConnections =
    showAllConnections
      ? filteredConnections
      : filteredConnections.slice(
          0,
          PREVIEW_COUNT
        );

  // =========================================
  // SUB-COMPONENTS
  // =========================================

  const Avatar = ({
    user,
    ringColor =
      "ring-slate-100 dark:ring-zinc-800",
  }) =>
    user?.profileImage ? (
      <img
        src={user.profileImage}
        alt={user.username}
        className={`h-12 w-12 shrink-0 rounded-full object-cover ring-2 ${ringColor} ring-offset-2 ring-offset-white dark:ring-offset-zinc-900`}
      />
    ) : (
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-100 to-indigo-200 text-base font-semibold text-indigo-600 ring-2 ${ringColor} ring-offset-2 ring-offset-white dark:from-indigo-950 dark:to-indigo-900 dark:text-indigo-400 dark:ring-offset-zinc-900`}
      >
        {user?.fullName
          ?.charAt(0)
          ?.toUpperCase() ||
          user?.username
            ?.charAt(0)
            ?.toUpperCase() ||
          "U"}
      </div>
    );

  const SkeletonCard = ({
    wide = false,
  }) => (
    <div
      className={`${
        wide
          ? "min-w-[280px] max-w-[280px]"
          : "min-w-[260px] max-w-[260px]"
      } shrink-0 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900`}
    >
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200 dark:bg-zinc-800" />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-zinc-800" />

          <div className="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-zinc-800/60" />
        </div>
      </div>

      {wide && (
        <div className="mt-4 flex gap-2">
          <div className="h-8 flex-1 rounded-xl bg-slate-100 dark:bg-zinc-800" />

          <div className="h-8 flex-1 rounded-xl bg-slate-100 dark:bg-zinc-800" />
        </div>
      )}
    </div>
  );

  const EmptyState = ({
    icon: Icon,
    title,
    subtitle,
  }) => (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-zinc-800/60 dark:text-zinc-500">
        <Icon size={22} />
      </div>

      <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
        {title}
      </p>

      {subtitle && (
        <p className="mt-0.5 text-xs text-slate-400 dark:text-zinc-500">
          {subtitle}
        </p>
      )}
    </div>
  );

  const SectionHeader = ({
    icon: Icon,
    iconBg,
    iconColor,
    title,
    subtitle,
    badge,
    showToggle,
    isExpanded,
    onToggle,
    actions,
  }) => (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor} ring-1 ring-black/5 dark:ring-white/5`}
        >
          <Icon size={20} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </h2>

            {badge > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-bold text-white shadow-xs">
                {badge}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-zinc-400">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {actions}

        {showToggle && (
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
          >
            {isExpanded
              ? "Show Less"
              : "See All"}

            <ChevronRight
              size={14}
              className={`transition-transform duration-200 ${
                isExpanded
                  ? "rotate-90"
                  : ""
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );

  const CardRow = ({
    isExpanded,
    children,
  }) => (
    <div
      className={
        isExpanded
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      }
    >
      {children}
    </div>
  );

  // =========================================
  // UI
  // =========================================

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-4rem)] w-full bg-linear-to-b from-sky-100 via-teal-100 to-blue-100 px-4 py-8 dark:from-zinc-950 dark:via-black dark:to-zinc-950">

        <div className="mx-auto max-w-6xl space-y-6">

          {/* PAGE HEADER */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Network & Connections
              </h1>

              <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400">
                Manage incoming requests, discover professionals, and view your circle.
              </p>
            </div>

            <button
              onClick={handleRefreshAll}
              disabled={
                refreshing ||
                loadingRequests ||
                loadingConnections
              }
              className="inline-flex items-center gap-1.5 self-start rounded-xl border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs backdrop-blur-sm transition hover:bg-white disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <RefreshCw
                size={14}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              <span>
                Refresh Network
              </span>
            </button>

          </div>

          {/* =========================================
              1. CONNECTION REQUESTS
          ========================================= */}

          <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/90">

            <SectionHeader
              icon={UserCheck}
              iconBg="bg-amber-100 dark:bg-amber-950/60"
              iconColor="text-amber-600 dark:text-amber-400"
              title="Connection Requests"
              subtitle="People looking to join your network."
              badge={requests.length}
              showToggle={
                requests.length >
                PREVIEW_COUNT
              }
              isExpanded={
                showAllRequests
              }
              onToggle={() =>
                setShowAllRequests(
                  (prev) => !prev
                )
              }
            />

            {loadingRequests ? (

              <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard
                    key={i}
                    wide
                  />
                ))}
              </div>

            ) : requests.length === 0 ? (

              <EmptyState
                icon={Inbox}
                title="No pending requests"
                subtitle="When someone sends you a connection request, it will appear here."
              />

            ) : (

              <CardRow
                isExpanded={
                  showAllRequests
                }
              >

                {visibleRequests.map(
                  (request) => {

                    const user =
                      request.sender ||
                      request.user;

                    const isLoading =
                      requestActionLoading ===
                      request.id;

                    // =========================================
                    // CHECK WHETHER THIS IS THE REQUEST
                    // FROM THE NOTIFICATION
                    // =========================================

                    const isHighlighted =
                      String(request.id) ===
                      String(requestId);

                    return (

                      <div
                        key={request.id}
                        id={`connection-request-${request.id}`}
                        className={`group min-w-[280px] max-w-[280px] shrink-0 rounded-2xl border p-4 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md ${
                          isHighlighted
                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300 dark:border-indigo-400 dark:bg-indigo-950/40 dark:ring-indigo-800"
                            : "border-slate-200/80 bg-white hover:border-indigo-200 dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:border-zinc-700"
                        }`}
                      >

                        {/* HIGHLIGHT LABEL */}

                        {isHighlighted && (
                          <div className="mb-3 rounded-lg bg-indigo-100 px-2.5 py-1.5 text-center text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            This person sent you a connection request
                          </div>
                        )}

                        {/* USER */}

                        <div className="flex items-center gap-3">

                          <Avatar user={user} />

                          <div className="min-w-0 flex-1">

                            <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {user?.fullName ||
                                user?.username ||
                                "Unknown User"}
                            </h3>

                            <p className="truncate text-xs text-slate-400 dark:text-zinc-400">
                              @{user?.username}
                            </p>

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-4 flex gap-2">

                          <button
                            disabled={isLoading}
                            onClick={() =>
                              handleRequestStatus(
                                request.id,
                                "ACCEPTED"
                              )
                            }
                            className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                          >

                            {isLoading ? (
                              <Loader2
                                size={13}
                                className="animate-spin"
                              />
                            ) : (
                              <UserCheck
                                size={13}
                              />
                            )}

                            Accept

                          </button>

                          <button
                            disabled={isLoading}
                            onClick={() =>
                              handleRequestStatus(
                                request.id,
                                "REJECTED"
                              )
                            }
                            className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                          >

                            <UserX size={13} />

                            Decline

                          </button>

                        </div>

                      </div>
                    );
                  }
                )}

              </CardRow>
            )}

          </section>

          {/* =========================================
              2. PEOPLE YOU MAY KNOW
          ========================================= */}

          <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/90">

            <SectionHeader
              icon={Sparkles}
              iconBg="bg-indigo-100 dark:bg-indigo-950/60"
              iconColor="text-indigo-600 dark:text-indigo-400"
              title="People You May Know"
              subtitle="Suggested based on your role, skills, and network."
              showToggle={true}
              isExpanded={
                showAllPeople
              }
              onToggle={() =>
                setShowAllPeople(
                  (prev) => !prev
                )
              }
            />

            <PeopleMayKnow
              expanded={showAllPeople}
            />

          </section>

          {/* =========================================
              3. MY CONNECTIONS
          ========================================= */}

          <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/90">

            <SectionHeader
              icon={Users}
              iconBg="bg-emerald-100 dark:bg-emerald-950/60"
              iconColor="text-emerald-600 dark:text-emerald-400"
              title="My Connections"
              subtitle="Your active network of colleagues and peers."
              badge={connections.length}
              showToggle={
                filteredConnections.length >
                PREVIEW_COUNT
              }
              isExpanded={
                showAllConnections
              }
              onToggle={() =>
                setShowAllConnections(
                  (prev) => !prev
                )
              }
              actions={
                connections.length > 0 && (
                  <div className="relative w-44 sm:w-56">

                    <Search
                      size={13}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      placeholder="Search connections..."
                      value={
                        searchQuery
                      }
                      onChange={(e) =>
                        setSearchQuery(
                          e.target.value
                        )
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1 pl-7 pr-2.5 text-xs text-slate-900 transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-white dark:focus:bg-zinc-800"
                    />

                  </div>
                )
              }
            />

            {loadingConnections ? (

              <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
                {[1, 2, 3, 4].map(
                  (i) => (
                    <SkeletonCard
                      key={i}
                    />
                  )
                )}
              </div>

            ) : filteredConnections.length === 0 ? (

              <EmptyState
                icon={Users}
                title={
                  searchQuery
                    ? "No matching connections found"
                    : "No connections yet"
                }
                subtitle={
                  searchQuery
                    ? "Try adjusting your search terms."
                    : "Discover suggestions above to start expanding your circle."
                }
              />

            ) : (

              <CardRow
                isExpanded={
                  showAllConnections
                }
              >

                {visibleConnections.map(
                  (user) => (

                    <div
                      key={user.id}
                      className="group min-w-[260px] max-w-[260px] shrink-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:border-zinc-700"
                    >

                      <div className="flex items-center gap-3">

                        <Avatar
                          user={user}
                          ringColor="ring-emerald-100 dark:ring-emerald-950"
                        />

                        <div className="min-w-0 flex-1">

                          <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {user?.fullName ||
                              user?.username ||
                              "Unknown User"}
                          </h3>

                          <p className="truncate text-xs text-slate-400 dark:text-zinc-400">
                            @{user?.username}
                          </p>

                        </div>

                      </div>

                      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-zinc-800">

                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                          <UserCheck
                            size={11}
                          />
                          Connected
                        </span>

                        <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                          Active
                        </span>

                      </div>

                    </div>

                  )
                )}

              </CardRow>
            )}

          </section>

        </div>
      </main>
    </>
  );
};

export default Connection;