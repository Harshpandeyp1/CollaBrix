
import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Lightbulb,
} from "lucide-react";
import api from "../../Services/api";

const Ideas = ({ projectId }) => {

  // ==========================================
  // STATE
  // ==========================================

  const [ideas, setIdeas] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);


  // ==========================================
  // FETCH IDEAS
  // ==========================================

  const fetchIdeas = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get(
        `/playground/${projectId}/ideas`
      );

      console.log("IDEA DATA:", response.data);

      setIdeas(response.data);

    } catch (err) {

      console.error("IDEA ERROR:", err);

      setError("Failed to load ideas.");

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    if (projectId) {
      fetchIdeas();
    }

  }, [projectId]);


  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {

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


      // ======================================
      // UPDATE
      // ======================================

      if (editingIdea) {

        await api.put(
          `/playground/ideas/${editingIdea.id}`,
          {
            title: form.title.trim(),
            description: form.description.trim(),
          }
        );

      }

      // ======================================
      // CREATE
      // ======================================

      else {

        await api.post(
          `/playground/${projectId}/ideas`,
          {
            title: form.title.trim(),
            description: form.description.trim(),
          }
        );

      }


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

    const confirmed = window.confirm(
      "Are you sure you want to delete this idea?"
    );

    if (!confirmed) return;


    try {

      setError("");

      await api.delete(
        `/playground/ideas/${ideaId}`
      );

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


        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Plus size={17} />
          New Idea
        </button>

      </div>


      {/* ====================================== */}
      {/* ERROR */}
      {/* ====================================== */}

      {error && (

        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">

          <span>{error}</span>

          <button
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
              key={idea.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
            >

              {/* TOP */}

              <div className="flex items-start justify-between gap-4">

                <div className="flex min-w-0 gap-3">

                  {/* PROFILE IMAGE */}

                  {idea.createdByProfileImage ? (

                    <img
                      src={`http://localhost:8080${idea.createdByProfileImage}`}
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
                    onClick={() => openEditModal(idea)}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                    title="Edit idea"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(idea.id)}
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

            </div>

          ))}

        </div>

      )}


      {/* ====================================== */}
      {/* CREATE / EDIT MODAL */}
      {/* ====================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">

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
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

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
                  placeholder="Explain your idea..."
                  className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

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

    </div>
  );
};

export default Ideas;

