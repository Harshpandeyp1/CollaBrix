import React, { useCallback, useEffect, useState } from "react";
import { BookmarkCheck, Lightbulb, X } from "lucide-react";
import Navbar from "../Components/Navbar";
import { getSavedPosts, unsavePost } from "../Services/Post";

const SavedIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unsavingIds, setUnsavingIds] = useState({});

  const fetchSavedIdeas = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSavedPosts();
      const savedIdeas = Array.isArray(response)
        ? response
        : response?.posts ?? response?.ideas ?? response?.data ?? [];

      setIdeas(savedIdeas);
    } catch (fetchError) {
      console.error("Failed to load saved ideas:", fetchError);
      setError(
        fetchError.response?.data?.message ||
          "Unable to load saved ideas right now."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSavedIdeas();
  }, [fetchSavedIdeas]);

  const handleUnsave = async (idea) => {
    const ideaId = idea.id ?? idea._id;
    if (ideaId == null) {
      setError("This idea cannot be removed because it has no ID.");
      return;
    }

    setUnsavingIds((current) => ({ ...current, [ideaId]: true }));
    setError("");

    try {
      await unsavePost(ideaId);
      setIdeas((current) =>
        current.filter(
          (item) => String(item.id ?? item._id) !== String(ideaId)
        )
      );
    } catch (unsaveError) {
      console.error("Failed to remove saved idea:", unsaveError);
      setError(
        unsaveError.response?.data?.message ||
          "Unable to remove this saved idea."
      );
    } finally {
      setUnsavingIds((current) => ({ ...current, [ideaId]: false }));
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-4rem)] w-full bg-[#FDFBD4] px-4 py-8 dark:bg-black">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex items-center gap-3">
            <BookmarkCheck
              aria-hidden="true"
              className="text-amber-500"
              size={28}
            />
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Saved Ideas
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                Ideas you bookmarked from the feed.
              </p>
            </div>
          </header>

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchSavedIdeas}
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
              Loading saved ideas...
            </div>
          ) : ideas.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/70">
              <Lightbulb
                aria-hidden="true"
                className="mb-3 text-amber-500"
                size={32}
              />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                No saved ideas yet
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                Use the bookmark on an idea in the feed to save it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea) => {
                const ideaId = idea.id ?? idea._id;

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
                        <button
                          type="button"
                          onClick={() => handleUnsave(idea)}
                          disabled={unsavingIds[ideaId]}
                          aria-label={`Remove ${idea.title || "idea"} from saved ideas`}
                          className="shrink-0 rounded-lg p-2 text-amber-600 transition hover:bg-amber-50 disabled:opacity-50 dark:text-amber-400 dark:hover:bg-zinc-800"
                        >
                          <X size={17} />
                        </button>
                      </div>
                      {idea.description && (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                          {idea.description}
                        </p>
                      )}
                      {(idea.fullName ||
                        idea.username ||
                        idea.createdByUsername) && (
                        <p className="mt-4 text-xs text-slate-500 dark:text-zinc-500">
                          Shared by{" "}
                          {idea.fullName ||
                            idea.username ||
                            idea.createdByUsername}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default SavedIdeas;
