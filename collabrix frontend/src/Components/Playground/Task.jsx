
import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import api from "../../Services/api";

const Tasks = ({ projectId }) => {

  // ==========================================
  // TASK STATE
  // ==========================================

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // CREATE / EDIT MODAL
  // ==========================================

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assignedTo: "",
  });

  const [saving, setSaving] = useState(false);


  // ==========================================
  // FETCH TASKS
  // ==========================================

  const fetchTasks = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await api.get(
        `/playground/${projectId}/tasks`
      );

      setTasks(response.data);

    } catch (err) {

      console.error("TASK ERROR:", err);

      setError("Failed to load tasks.");

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    if (projectId) {
      fetchTasks();
    }

  }, [projectId]);


  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {

    setEditingTask(null);

    setForm({
      title: "",
      description: "",
      priority: "MEDIUM",
      assignedTo: "",
    });

    setShowModal(true);
  };


  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (task) => {

    setEditingTask(task);

    setForm({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "MEDIUM",
      assignedTo: task.assignedToId
        ? String(task.assignedToId)
        : "",
    });

    setShowModal(true);
  };


  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {

    if (saving) return;

    setShowModal(false);
    setEditingTask(null);

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
  // CREATE / UPDATE TASK
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {

      setSaving(true);
      setError("");

      const request = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        assignedTo: form.assignedTo
          ? Number(form.assignedTo)
          : null,
      };


      // ----------------------------------------
      // UPDATE
      // ----------------------------------------

      if (editingTask) {

        await api.put(
          `/playground/tasks/${editingTask.id}`,
          {
            ...request,
            status: editingTask.status,
          }
        );

      }

      // ----------------------------------------
      // CREATE
      // ----------------------------------------

      else {

        await api.post(
          `/playground/${projectId}/tasks`,
          request
        );

      }


      setShowModal(false);
      setEditingTask(null);

      await fetchTasks();

    } catch (err) {

      console.error("SAVE TASK ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Failed to save task."
      );

    } finally {

      setSaving(false);

    }
  };


  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusChange = async (task, newStatus) => {

    try {

      setError("");

      await api.put(
        `/playground/tasks/${task.id}`,
        {
          title: task.title,
          description: task.description,
          status: newStatus,
          priority: task.priority,
          assignedTo: task.assignedToId || null,
        }
      );

      await fetchTasks();

    } catch (err) {

      console.error("STATUS UPDATE ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Failed to update task status."
      );
    }
  };


  // ==========================================
  // DELETE TASK
  // ==========================================

  const handleDelete = async (taskId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {

      setError("");

      await api.delete(
        `/playground/tasks/${taskId}`
      );

      await fetchTasks();

    } catch (err) {

      console.error("DELETE TASK ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Failed to delete task."
      );
    }
  };


  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusClass = (status) => {

    switch (status) {

      case "COMPLETED":
        return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

      case "TODO":
      default:
        return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
    }
  };


  // ==========================================
  // PRIORITY BADGE
  // ==========================================

  const getPriorityClass = (priority) => {

    switch (priority) {

      case "HIGH":
        return "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400";

      case "LOW":
        return "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400";

      case "MEDIUM":
      default:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400";
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="flex items-center justify-center py-16">

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading tasks...
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

          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Tasks
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage tasks and track project progress.
          </p>

        </div>


        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Plus size={17} />
          New Task
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
            className="ml-4"
          >
            <X size={16} />
          </button>

        </div>

      )}


      {/* ====================================== */}
      {/* EMPTY STATE */}
      {/* ====================================== */}

      {tasks.length === 0 ? (

        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">

          <div className="text-center">

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">

              <Plus
                size={22}
                className="text-zinc-500"
              />

            </div>

            <h3 className="font-medium text-zinc-800 dark:text-zinc-200">
              No tasks yet
            </h3>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Create a task to start organizing the project.
            </p>

            <button
              onClick={openCreateModal}
              className="mt-4 text-sm font-medium text-zinc-900 underline dark:text-white"
            >
              Create your first task
            </button>

          </div>

        </div>

      ) : (

        /* ====================================== */
        /* TASK LIST */
        /* ====================================== */

        <div className="space-y-4">

          {tasks.map((task) => (

            <div
              key={task.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
            >

              {/* TOP */}

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0 flex-1">

                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    {task.title}
                  </h3>

                  {task.description && (

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {task.description}
                    </p>

                  )}

                </div>


                {/* ACTIONS */}

                <div className="flex shrink-0 items-center gap-2">

                  <button
                    onClick={() => openEditModal(task)}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                    title="Edit task"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>


              {/* BADGES */}

              <div className="mt-4 flex flex-wrap items-center gap-2">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(task.status)}`}
                >
                  {task.status?.replace("_", " ")}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(task.priority)}`}
                >
                  {task.priority || "MEDIUM"}
                </span>

              </div>


              {/* DETAILS */}

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">

                <span>
                  Assigned:{" "}
                  <strong className="text-zinc-700 dark:text-zinc-200">
                    {task.assignedToUsername || "Unassigned"}
                  </strong>
                </span>

                <span>
                  Created by:{" "}
                  <strong className="text-zinc-700 dark:text-zinc-200">
                    {task.createdByUsername}
                  </strong>
                </span>

                <span>
                  {task.createdAt
                    ? new Date(task.createdAt).toLocaleDateString()
                    : ""}
                </span>

              </div>


              {/* STATUS ACTION */}

              {task.status !== "COMPLETED" && (

                <div className="mt-5 flex flex-wrap gap-2">

                  {task.status !== "IN_PROGRESS" && (

                    <button
                      onClick={() =>
                        handleStatusChange(
                          task,
                          "IN_PROGRESS"
                        )
                      }
                      className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Start Task
                    </button>

                  )}

                  <button
                    onClick={() =>
                      handleStatusChange(
                        task,
                        "COMPLETED"
                      )
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    <Check size={14} />
                    Complete
                  </button>

                </div>

              )}

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
                  {editingTask
                    ? "Edit Task"
                    : "Create Task"}
                </h3>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {editingTask
                    ? "Update task details."
                    : "Add a new task to the project."}
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
                  placeholder="Build login page"
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
                  rows={3}
                  placeholder="Describe what needs to be done..."
                  className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

              </div>


              {/* PRIORITY */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Priority
                </label>

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>

              </div>


              {/* ASSIGNED USER */}

              <div>

                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Assigned User ID
                </label>

                <input
                  type="number"
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  placeholder="Enter accepted member's user ID"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />

                <p className="mt-1 text-xs text-zinc-400">
                  Leave empty if the task is not assigned.
                </p>

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {saving
                    ? "Saving..."
                    : editingTask
                    ? "Save Changes"
                    : "Create Task"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Tasks;

