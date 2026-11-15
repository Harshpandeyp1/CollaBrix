import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ListChecks,
} from "lucide-react";
import {
  getIdeas,
  createIdea,
  updateIdea,
  deleteIdea,
  toggleSaveIdea,
} from "../../Services/Ideas";
import { getProfileImageUrl } from "../../Services/Profile.js";
import { improveIdea, aiErrorMessage } from "../../Services/aiService";
import PlanModal from "../../Pages/PlanModel";

const getIdeaId = (idea) => idea.id ?? idea._id;

const isIdeaSaved = (idea) => {
  if (typeof idea.saved === "boolean") return idea.saved;

  return (
    idea.isSaved === true ||
    idea.bookmarked === true ||
    idea.isBookmarked === true
  );
};

const Ideas = ({ projectId }) => {

  // ==========================================
  // STATE
  // ==========================================

  const [ideas, setIdeas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");          // shown INSIDE the modal
  const [suggestion, setSuggestion] = useState(null);  // null = nothing suggested
  const [planIdea, setPlanIdea] = useState(null);      // null = plan modal closed

  // Counter used to ignore stale answers (see handleImprove).
  const improveReq = useRef(0);

  const MAX_TITLE = 150;          // same as app.ai.max-title-length in the backend
  const MAX_DESCRIPTION = 2000;   // same as app.ai.max-description-length


  // ==========================================
  // FETCH IDEAS
  // ==========================================

  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getIdeas(projectId);
      setIdeas(
        Array.isArray(data)
          ? data.map((idea) => ({ ...idea, saved: isIdeaSaved(idea) }))
          : []
      );
    } catch (err) {
      console.error("IDEA ERROR:", err);
      setError("Failed to load ideas.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    if (projectId) {
      fetchIdeas();
    }

  }, [fetchIdeas, projectId]);


  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {

    resetAi();

    setEditingIdea(null);

    setForm({
      title: "",
      description: "",
    });

    setError("");

    setShowModal(true);
  };


  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (idea) => {

    resetAi();

    setEditingIdea(idea);

    setForm({
      title: idea.title || "",
      description: idea.description || "",
    });

    setError("");

    setShowModal(true);
  };


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {

    if (saving) return;

    resetAi();

    setShowModal(false);
    setEditingIdea(null);

  };


  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.title.trim()) {

      setError("Idea title is required.");

      return;
    }


    try {

      setSaving(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
      };

      if (editingIdea) {
        await updateIdea(getIdeaId(editingIdea), payload);
      } else {
        await createIdea(projectId, payload);
      }

      resetAi();
      setShowModal(false);
      setEditingIdea(null);

      setForm({
        title: "",
        description: "",
      });

      await fetchIdeas();

    } catch (err) {

      console.error("SAVE IDEA ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Failed to save idea."
      );

    } finally {

      setSaving(false);

    }
  };


  // ==========================================
  // DELETE IDEA
  // ==========================================

  const handleDelete = async (ideaId) => {
    if (ideaId == null) {
      setError("This idea cannot be deleted because it has no ID.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this idea?"
    );

    if (!confirmed) return;


    try {

      setError("");

      await deleteIdea(ideaId);

      await fetchIdeas();

    } catch (err) {

      console.error("DELETE IDEA ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Failed to delete idea."
      );
    }
  };


  // ==========================================
  // SAVE / UNSAVE (BOOKMARK)
  // ==========================================

  const savedIdeas = ideas.filter(isIdeaSaved);

  const handleToggleSave = async (idea) => {
    const ideaId = getIdeaId(idea);
    if (ideaId == null) {
      setError("This idea cannot be saved because it has no ID.");
      return;
    }
    const next = !isIdeaSaved(idea);

    // update the UI immediately
    setIdeas((prev) =>
      prev.map((i) =>
        String(getIdeaId(i)) === String(ideaId) ? { ...i, saved: next } : i
      )
    );

    try {
      await toggleSaveIdea(ideaId, next);

    } catch (err) {

      console.error("TOGGLE SAVE ERROR:", err);

      // roll back if the request fails
      setIdeas((prev) =>
        prev.map((i) =>
          String(getIdeaId(i)) === String(ideaId)
            ? { ...i, saved: !next }
            : i
        )
      );

      setError(
        err.response?.data?.message ||
        "Failed to update saved idea."
      );
    }
  };

  // Clears the suggestion, the error, the spinner, AND invalidates any request
  // still in flight (bumping the counter makes its answer "stale").
  const resetAi = () => {
    improveReq.current += 1;
    setAiLoading(false);
    setAiError("");
    setSuggestion(null);
  };

  const requestImprovement = async (ideaContent, force = false) => {
    if (aiLoading && !force) return;

    if (!ideaContent.title.trim() && !ideaContent.description.trim()) {
      setAiError("Write a rough idea first, then improve it.");
      return;
    }

    // Each request gets a number. An answer is only used if its number is still the
    // latest, so a slow answer can't appear in a different idea's modal.
    const myRequest = ++improveReq.current;

    setAiLoading(true);
    setAiError("");
    setSuggestion(null);

    try {

      const result = await improveIdea({
        title: ideaContent.title,
        description: ideaContent.description,
      });

      if (myRequest !== improveReq.current) return;   // stale: ignore

      setSuggestion(result);
      setAiLoading(false);

    } catch (err) {

      console.error("IMPROVE ERROR:", err);

      if (myRequest !== improveReq.current) return;   // stale: ignore

      setAiError(aiErrorMessage(err));
      setAiLoading(false);
    }
  };

  const handleImprove = () => requestImprovement(form);

  const handleRestructureIdea = (idea) => {
    if (getIdeaId(idea) == null) {
      setError("This idea cannot be updated because it has no ID.");
      return;
    }

    resetAi();
    setEditingIdea(idea);
    setForm({
      title: idea.title || "",
      description: idea.description || "",
    });
    setError("");
    setShowModal(true);
    requestImprovement(
      { title: idea.title || "", description: idea.description || "" },
      true
    );
  };

  const acceptSuggestion = () => {

    setForm({
      title: (suggestion.title ?? "").slice(0, MAX_TITLE),
      description: (suggestion.description ?? "").slice(0, MAX_DESCRIPTION),
    });

    setSuggestion(null);
  };

  const renderPlanButton = (idea) => (
    <button
      type="button"
      onClick={() => setPlanIdea(idea)}
      className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
      title="Turn into a project plan"
      aria-label={`Generate a plan from ${idea.title || "this idea"}`}
    >
      <ListChecks size={16} />
    </button>
  );


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="flex items-center justify-center py-16">

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading ideas...
        </p>

      </div>
    );
  }


  return (
    <div className="space-y-6">


      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="flex items-start justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <Lightbulb
              size={21}
              className="text-yellow-500"
            />

            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Ideas
            </h2>

          </div>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Share ideas and suggestions for the project.
          </p>

        </div>


        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={() => setShowSavedModal(true)}
            className="flex items-center gap-2 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <BookmarkCheck size={17} />
            Saved ({savedIdeas.length})
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Plus size={17} />
            New Idea
          </button>

        </div>

      </div>


      {/* ====================================== */}
      {/* ERROR */}
      {/* ====================================== */}

      {error && (

        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>

        </div>

      )}


      {/* ====================================== */}
      {/* EMPTY STATE */}
      {/* ====================================== */}

      {ideas.length === 0 ? (

        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">

          <div className="text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-950/30">

              <Lightbulb
                size={22}
                className="text-yellow-500"
              />

            </div>

            <h3 className="font-medium text-zinc-800 dark:text-zinc-200">
              No ideas yet
            </h3>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Share the first idea with your team.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 text-sm font-medium text-zinc-900 underline dark:text-white"
            >
              Create an idea
            </button>

          </div>

        </div>

      ) : (

        /* ====================================== */
        /* IDEA LIST */
        /* ====================================== */

        <div className="grid gap-4 md:grid-cols-2">

          {ideas.map((idea) => (

            <div
              key={getIdeaId(idea)}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
            >

              {/* TOP */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 gap-3">

                  {/* PROFILE IMAGE */}

                  {getProfileImageUrl(idea) ? (
                    <img
                      src={getProfileImageUrl(idea)}
                      alt={idea.createdByUsername}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />

                  ) : (

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-white">
                      {idea.createdByUsername
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                  )}


                  <div className="min-w-0">

                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {idea.createdByUsername}
                    </p>

                    <p className="text-xs text-zinc-400">
                      {idea.createdAt
                        ? new Date(
                            idea.createdAt
                          ).toLocaleString()
                        : ""}
                    </p>

                  </div>

                </div>


                {/* ACTIONS */}

                <div className="flex shrink-0 items-center gap-1">

                  <button
                    type="button"
                    onClick={() => handleToggleSave(idea)}
                    aria-label={
                      isIdeaSaved(idea)
                        ? `Remove ${idea.title || "idea"} from saved ideas`
                        : `Save ${idea.title || "idea"}`
                    }
                    className={`rounded-lg p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                      isIdeaSaved(idea)
                        ? "text-yellow-500"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                    title={
                      isIdeaSaved(idea)
                        ? "Remove from saved"
                        : "Save idea"
                    }
                  >
                    {isIdeaSaved(idea) ? (
                      <BookmarkCheck
                        size={16}
                        className="fill-yellow-100"
                      />
                    ) : (
                      <Bookmark size={16} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(idea)}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                    title="Edit idea"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(getIdeaId(idea))}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    title="Delete idea"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>


              {/* IDEA CONTENT */}

              <div className="mt-5">

                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                  {idea.title}
                </h3>

                {idea.description && (

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                    {idea.description}
                  </p>

                )}

              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleRestructureIdea(idea)}
                  className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-violet-900/70 dark:bg-violet-950/30 dark:text-violet-300 dark:hover:bg-violet-950/60"
                >
                  <Sparkles size={15} />
                  Restructure with AI
                </button>
                <button
                  type="button"
                  onClick={() => setPlanIdea(idea)}
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-300 dark:hover:bg-sky-950/60"
                >
                  <ListChecks size={15} />
                  Generate a plan
                </button>
              </div>

            </div>

          ))}

        </div>

      )}


      {/* ====================================== */}
      {/* CREATE / EDIT MODAL */}
      {/* ====================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl border border-white/70 bg-white p-6 shadow-2xl shadow-slate-950/20 dark:border-zinc-700 dark:bg-zinc-900">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {editingIdea
                    ? "Edit Idea"
                    : "Create Idea"}
                </h3>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {editingIdea
                    ? "Update your idea."
                    : "Share a new idea with the project."}
                </p>

              </div>


              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >

              {/* TITLE */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Add dark mode"
                  maxLength={MAX_TITLE}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-violet-500 dark:focus:bg-zinc-800"
                />
                <p className="mt-1 text-right text-xs text-zinc-400">
                  {form.title.length}/{MAX_TITLE}
                </p>

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={MAX_DESCRIPTION}
                  placeholder="Explain your idea..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-violet-500 dark:focus:bg-zinc-800"
                />
                <p className="mt-1 text-right text-xs text-zinc-400">
                  {form.description.length}/{MAX_DESCRIPTION}
                </p>

              </div>

              {/* AI: IMPROVE */}

              <div className="space-y-3">

                <button
                  type="button"
                  onClick={handleImprove}
                  disabled={aiLoading}
                  className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 disabled:cursor-wait disabled:opacity-60"
                >
                  <Sparkles size={16} className="text-purple-500" />
                  {aiLoading ? "Improving..." : "Improve with AI"}
                </button>

                {aiError && (
                  <p className="text-sm text-red-600 dark:text-red-400">{aiError}</p>
                )}

                {suggestion && (
                  <div                   className="rounded-2xl border border-violet-200 bg-violet-50/80 p-4 dark:border-violet-900 dark:bg-violet-950/20">

                    <p className="text-xs font-medium uppercase tracking-wide text-purple-600 dark:text-purple-400">
                      AI suggestion
                    </p>

                    <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
                      {suggestion.title}
                    </p>

                    <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                      {suggestion.description}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={acceptSuggestion}
                        className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700"
                      >
                        Use this
                      </button>
                      <button
                        type="button"
                        onClick={() => setSuggestion(null)}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Discard
                      </button>
                    </div>

                  </div>
                )}

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {saving
                    ? "Saving..."
                    : editingIdea
                    ? "Save Changes"
                    : "Create Idea"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ====================================== */}
      {/* SAVED IDEAS MODAL */}
      {/* ====================================== */}

      {showSavedModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Saved Ideas
                </h3>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Ideas you bookmarked from this project, including ideas shared by other people.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowSavedModal(false)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </button>

            </div>


            {/* SAVED LIST */}

            <div className="mt-5 space-y-3 overflow-y-auto">

              {savedIdeas.length === 0 ? (

                <p className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No saved ideas yet. Click the bookmark icon on an idea to save it.
                </p>

              ) : (

                savedIdeas.map((idea) => (

                  <div
                    key={getIdeaId(idea)}
                    className="flex items-start justify-between gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700"
                  >

                    <div className="min-w-0">

                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {idea.title}
                      </h4>

                      {idea.description && (

                        <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-300">
                          {idea.description}
                        </p>

                      )}

                      <p className="mt-2 text-xs text-zinc-400">
                        by {idea.createdByUsername}
                      </p>

                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleSave(idea)}
                        className="rounded-lg p-2 text-yellow-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        title="Remove from saved"
                        aria-label={`Remove ${idea.title || "idea"} from saved ideas`}
                      >
                        <BookmarkCheck size={16} />
                      </button>
                      {renderPlanButton(idea)}
                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      )}

      {/* PLAN MODAL. It exists only while planIdea is set, so closing it destroys
          its state and the next idea starts fresh. */}
      {planIdea && (
        <PlanModal idea={planIdea} onClose={() => setPlanIdea(null)} />
      )}

    </div>
  );
};

export default Ideas;