import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Lightbulb, Trash2 } from "lucide-react";
import Navbar from "../Components/Navbar";
import PostModal from "../Components/PostModal";
import {
  deletePost,
  getMyPosts,
  getSavedPosts,
  unsavePost,
} from "../Services/Post";

const getItems = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.posts)) return response.posts;
  if (Array.isArray(response?.ideas)) return response.ideas;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const getIdeaId = (idea) => idea.id ?? idea._id;

const Ideas = () => {
  const [myIdeas, setMyIdeas] = useState([]);
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [activeTab, setActiveTab] = useState("mine");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [busyIdeaIds, setBusyIdeaIds] = useState({});

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  const currentUserId = currentUser?.id ?? currentUser?.userId;
  const currentUsername = currentUser?.username;

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    setError("");
    const [mineResult, savedResult] = await Promise.allSettled([
      getMyPosts(),
      getSavedPosts(),
    ]);

    if (mineResult.status === "fulfilled") {
      setMyIdeas(getItems(mineResult.value).filter((idea) => !idea.project));
    } else {
      console.error("Failed to load your ideas:", mineResult.reason);
      setError("Unable to load your ideas.");
    }

    if (savedResult.status === "fulfilled") {
      setSavedIdeas(getItems(savedResult.value));
    } else {
      console.error("Failed to load saved ideas:", savedResult.reason);
      setError((current) =>
        current
          ? `${current} Saved ideas could not be loaded.`
          : "Unable to load saved ideas."
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const isMine = (idea) => {
    const authorId =
      idea.userId ??
      idea.authorId ??
      idea.ownerId ??
      idea.createdById ??
      idea.createdBy?.id ??
      idea.user?.id ??
      idea.author?.id;

    if (authorId != null && currentUserId != null) {
      return String(authorId) === String(currentUserId);
    }

    const authorUsername =
      idea.createdByUsername ??
      idea.username ??
      idea.fullName ??
      idea.createdBy?.username ??
      idea.user?.username;

    return Boolean(
      authorUsername &&
        currentUsername &&
        authorUsername.toLowerCase() === currentUsername.toLowerCase()
    );
  };

  const savedOthersIdeas = savedIdeas.filter((idea) => !isMine(idea));
  const shownIdeas = activeTab === "mine" ? myIdeas : savedOthersIdeas;

  const openIdeaModal = (idea = null) => {
    setSelectedIdea(idea);
    setModalOpen(true);
  };

  const closeIdeaModal = () => {
    setModalOpen(false);
    setSelectedIdea(null);
  };

  const handleDelete = async (idea) => {
    if (!window.confirm("Are you sure you want to delete this idea?")) return;
    const ideaId = getIdeaId(idea);

    try {
      setBusyIdeaIds((current) => ({ ...current, [ideaId]: true }));
      await deletePost(ideaId);
      setMyIdeas((current) =>
        current.filter((item) => String(getIdeaId(item)) !== String(ideaId))
      );
    } catch (deleteError) {
      console.error("Failed to delete idea:", deleteError);
      setError(
        deleteError.response?.data?.message || "Unable to delete this idea."
      );
    } finally {
      setBusyIdeaIds((current) => ({ ...current, [ideaId]: false }));
    }
  };

  const handleUnsave = async (idea) => {
    const ideaId = getIdeaId(idea);

    try {
      setBusyIdeaIds((current) => ({ ...current, [ideaId]: true }));
      await unsavePost(ideaId);
      setSavedIdeas((current) =>
        current.filter((item) => String(getIdeaId(item)) !== String(ideaId))
      );
    } catch (unsaveError) {
      console.error("Failed to remove saved idea:", unsaveError);
      setError(
        unsaveError.response?.data?.message ||
          "Unable to remove this saved idea."
      );
    } finally {
      setBusyIdeaIds((current) => ({ ...current, [ideaId]: false }));
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] w-full bg-[#FDFBD4] px-4 py-8 dark:bg-black">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Lightbulb
                  aria-hidden="true"
                  className="text-amber-500"
                  size={28}
                />
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Ideas
                </h1>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                View your ideas and the ideas you saved from others.
              </p>
            </div>

            {activeTab === "mine" && (
              <button
                type="button"
                onClick={() => openIdeaModal()}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Share an Idea
              </button>
            )}
          </header>

          <div className="mb-6 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("mine")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "mine"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              My Ideas ({myIdeas.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "saved"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <BookmarkCheck size={16} />
              Saved Ideas ({savedOthersIdeas.length})
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchIdeas}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div
              role="status"
              className="py-20 text-center text-sm text-slate-500 dark:text-zinc-400"
            >
              Loading ideas...
            </div>
          ) : shownIdeas.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/70">
              {activeTab === "mine" ? (
                <Lightbulb
                  aria-hidden="true"
                  className="mb-3 text-amber-500"
                  size={32}
                />
              ) : (
                <Bookmark
                  aria-hidden="true"
                  className="mb-3 text-amber-500"
                  size={32}
                />
              )}
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {activeTab === "mine" ? "You haven't shared any ideas" : "No saved ideas"}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                {activeTab === "mine"
                  ? "Share an idea with the community to see it here."
                  : "Bookmark another person's idea from the feed to see it here."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {shownIdeas.map((idea) => {
                const ideaId = getIdeaId(idea);
                const author =
                  idea.createdByUsername ||
                  idea.username ||
                  idea.fullName ||
                  "Community member";

                return (
                  <article
                    key={ideaId}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                          {idea.title || "Untitled Idea"}
                        </h2>
                        {activeTab === "saved" && (
                          <button
                            type="button"
                            onClick={() => handleUnsave(idea)}
                            disabled={busyIdeaIds[ideaId]}
                            aria-label={`Remove ${idea.title || "idea"} from saved ideas`}
                            className="shrink-0 rounded-lg p-2 text-amber-600 transition hover:bg-amber-50 disabled:opacity-50 dark:text-amber-400 dark:hover:bg-zinc-800"
                          >
                            <BookmarkCheck size={17} />
                          </button>
                        )}
                      </div>
                      {idea.description && (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                          {idea.description}
                        </p>
                      )}
                      <p className="mt-4 text-xs text-slate-500 dark:text-zinc-500">
                        {activeTab === "mine" ? "Shared by you" : `Shared by ${author}`}
                      </p>
                    </div>

                    {activeTab === "mine" && (
                      <div className="mt-5 flex justify-end gap-4 border-t border-slate-100 pt-4 dark:border-zinc-800">
                        <button
                          type="button"
                          onClick={() => openIdeaModal(idea)}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(idea)}
                          disabled={busyIdeaIds[ideaId]}
                          className="inline-flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50 dark:text-rose-400"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <PostModal
        open={modalOpen}
        post={selectedIdea}
        onClose={closeIdeaModal}
        onSave={fetchIdeas}
      />
    </>
  );
};

export default Ideas;
