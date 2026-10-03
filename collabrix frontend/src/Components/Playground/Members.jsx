
import React, { useEffect, useState, useMemo } from "react";

import {
  User,
  Crown,
  Users,
  AlertCircle,
  Search,
  RefreshCw,
  ExternalLink,
  UserMinus,
} from "lucide-react";

import { useParams } from "react-router-dom";

import api from "../../Services/api";

const Members = () => {
  const { projectId } = useParams();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Member currently being removed
  const [removingMemberId, setRemovingMemberId] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/playground/${projectId}/members`
      );

      setMembers(response.data || []);
    } catch (err) {
      console.error("Error fetching members:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load project members."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  // =====================================================
  // REMOVE MEMBER
  // =====================================================

  const handleRemoveMember = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${
        member.fullName || member.username
      } from this project?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingMemberId(member.userId);
      setError("");

      await api.delete(
        `/playground/${projectId}/members/${member.userId}`
      );

      // Remove member immediately from UI
      setMembers((previousMembers) =>
        previousMembers.filter(
          (item) => item.userId !== member.userId
        )
      );
    } catch (err) {
      console.error("Error removing member:", err);

      setError(
        err.response?.data?.message ||
          "Failed to remove member."
      );
    } finally {
      setRemovingMemberId(null);
    }
  };

  // =====================================================
  // FILTER MEMBERS
  // =====================================================

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const name = (member.fullName || "").toLowerCase();
      const username = (member.username || "").toLowerCase();
      const headline = (member.headline || "").toLowerCase();

      const query = searchQuery.toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        username.includes(query) ||
        headline.includes(query);

      const matchesRole =
        roleFilter === "ALL"
          ? true
          : roleFilter === "OWNER"
          ? member.role === "OWNER"
          : member.role !== "OWNER";

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

        <div className="mb-8 animate-pulse">
          <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-zinc-800" />

          <div className="mt-2 h-4 w-32 rounded bg-gray-200 dark:bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-4">

                <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-zinc-800" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-zinc-800" />

                  <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-zinc-800" />
                </div>

              </div>

              <div className="mt-6 space-y-2">
                <div className="h-3 w-full rounded bg-gray-200 dark:bg-zinc-800" />

                <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error && members.length === 0) {
    return (
      <div className="flex min-h-[450px] items-center justify-center px-4">

        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white/80 p-8 text-center shadow-xl backdrop-blur-sm dark:border-red-950/50 dark:bg-zinc-900/80">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400">
            <AlertCircle size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Unable to Load Members
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {error}
          </p>

          <button
            onClick={fetchMembers}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-8 space-y-4 sm:flex sm:items-center sm:justify-between sm:space-y-0">

        <div className="flex items-center gap-3.5">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-950/50 dark:text-indigo-400">
            <Users size={24} />
          </div>

          <div>

            <div className="flex items-center gap-2.5">

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Project Members
              </h1>

              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                {members.length}
              </span>

            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage and view everyone contributing to this project.
            </p>

          </div>

        </div>

        {/* FILTER + SEARCH */}

        {members.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* Filter Pills */}

            <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-zinc-800/80">

              {["ALL", "OWNER", "MEMBER"].map((role) => (

                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    roleFilter === role
                      ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  {role === "ALL"
                    ? "All"
                    : role === "OWNER"
                    ? "Owners"
                    : "Members"}
                </button>

              ))}

            </div>

            {/* Search */}

            <div className="relative">

              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search member..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20 sm:w-60"
              />

            </div>

          </div>
        )}

      </div>

      {/* ================================================= */}
      {/* ACTION ERROR */}
      {/* ================================================= */}

      {error && members.length > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">

          <AlertCircle size={18} />

          <span>{error}</span>

        </div>
      )}

      {/* ================================================= */}
      {/* EMPTY STATE */}
      {/* ================================================= */}

      {filteredMembers.length === 0 ? (

        <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-8 dark:border-zinc-800 dark:bg-zinc-900/30">

          <div className="max-w-xs text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-zinc-800">
              <Users size={24} />
            </div>

            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {searchQuery || roleFilter !== "ALL"
                ? "No matches found"
                : "No Members Yet"}
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchQuery || roleFilter !== "ALL"
                ? "Try adjusting your search or filter to find what you're looking for."
                : "There are currently no members assigned to this project."}
            </p>

          </div>
        </div>

      ) : (

        /* ================================================= */
        /* MEMBER GRID */
        /* ================================================= */

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {filteredMembers.map((member) => (

            <div
              key={member.userId}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >

              <div>

                {/* TOP SECTION */}

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3.5">

                    <div className="relative h-12 w-12 shrink-0">

                      {member.profileImage ? (

                        <img
                          src={member.profileImage}
                          alt={
                            member.fullName ||
                            member.username
                          }
                          className="h-full w-full rounded-full object-cover ring-2 ring-gray-100 dark:ring-zinc-800"
                        />

                      ) : (

                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 ring-2 ring-gray-100 dark:from-zinc-800 dark:to-zinc-700 dark:text-gray-300 dark:ring-zinc-800">
                          <User size={20} />
                        </div>

                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                        {member.fullName ||
                          member.username}
                      </h3>

                      <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">
                        @{member.username}
                      </p>

                    </div>

                  </div>

                  {/* PROFILE BUTTON */}

                  <button
                    aria-label="View member profile"
                    className="opacity-0 transition-opacity group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <ExternalLink size={16} />
                  </button>

                </div>

                {/* HEADLINE */}

                {member.headline && (
                  <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                    {member.headline}
                  </p>
                )}

              </div>

              {/* ================================================= */}
              {/* BOTTOM SECTION */}
              {/* ================================================= */}

              <div className="mt-5 border-t border-gray-100 pt-4 dark:border-zinc-800/80">

                <div className="flex items-center justify-between gap-2">

                  {/* ROLE BADGE */}

                  {member.role === "OWNER" ? (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">

                      <Crown
                        size={13}
                        className="text-amber-500"
                      />

                      Project Owner

                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-zinc-800 dark:text-gray-300">

                      <User
                        size={13}
                        className="text-gray-400"
                      />

                      Member

                    </span>

                  )}

                  {/* REMOVE MEMBER */}

                  {member.role !== "OWNER" && (

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveMember(member)
                      }
                      disabled={
                        removingMemberId ===
                        member.userId
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60"
                    >

                      {removingMemberId ===
                      member.userId ? (
                        <>
                          <RefreshCw
                            size={13}
                            className="animate-spin"
                          />
                          Removing...
                        </>
                      ) : (
                        <>
                          <UserMinus size={13} />
                          Remove
                        </>
                      )}

                    </button>

                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Members;

