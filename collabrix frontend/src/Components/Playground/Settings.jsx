
import React, { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle,
  AlertCircle,
  GitBranch,
  Globe,
  Users,
  Code2,
  Briefcase,
  Search,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../../Services/api";

const Settings = () => {
  const { projectId } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    image: "",
    projectRole: "",
    teamSize: 1,
    lookingFor: "",
    lookingForCollaborators: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // FETCH SETTINGS
  // =====================================================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/playground/${projectId}/settings`
        );

        setForm({
          title: response.data.title || "",
          description: response.data.description || "",
          techStack: response.data.techStack || "",
          githubUrl: response.data.githubUrl || "",
          liveUrl: response.data.liveUrl || "",
          image: response.data.image || "",
          projectRole: response.data.projectRole || "",
          teamSize: response.data.teamSize || 1,
          lookingFor: response.data.lookingFor || "",
          lookingForCollaborators:
            response.data.lookingForCollaborators || false,
        });
      } catch (err) {
        console.error("Error fetching settings:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load project settings."
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchSettings();
    }
  }, [projectId]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put(
        `/playground/${projectId}/settings`,
        {
          ...form,
          teamSize: Number(form.teamSize),
        }
      );

      setForm({
        title: response.data.title || "",
        description: response.data.description || "",
        techStack: response.data.techStack || "",
        githubUrl: response.data.githubUrl || "",
        liveUrl: response.data.liveUrl || "",
        image: response.data.image || "",
        projectRole: response.data.projectRole || "",
        teamSize: response.data.teamSize || 1,
        lookingFor: response.data.lookingFor || "",
        lookingForCollaborators:
          response.data.lookingForCollaborators || false,
      });

      setSuccess("Project settings updated successfully.");
    } catch (err) {
      console.error("Error updating settings:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update project settings."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-2xl bg-gray-200 dark:bg-zinc-800" />

          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded-md bg-gray-200 dark:bg-zinc-800" />
            <div className="h-4 w-64 animate-pulse rounded-md bg-gray-200 dark:bg-zinc-800" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900" />

          <div className="h-48 animate-pulse rounded-2xl border border-gray-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900" />

          <div className="h-40 animate-pulse rounded-2xl border border-gray-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900" />
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-950/50 dark:text-indigo-400">
            <SettingsIcon size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Project Settings
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure your project metadata, links, and collaboration parameters
            </p>
          </div>

        </div>
      </div>

      {/* Alerts */}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200/80 bg-red-50/80 p-4 text-sm font-medium text-red-800 shadow-sm backdrop-blur-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">

          <AlertCircle
            size={20}
            className="shrink-0 text-red-500"
          />

          <span className="flex-1">
            {error}
          </span>

        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 p-4 text-sm font-medium text-emerald-800 shadow-sm backdrop-blur-sm dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">

          <CheckCircle
            size={20}
            className="shrink-0 text-emerald-500"
          />

          <span className="flex-1">
            {success}
          </span>

        </div>
      )}

      {/* Main Form */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* General Details */}

        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">

          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
            General Information
          </h2>

          <div className="space-y-5">

            {/* Title */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Project Title{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-zinc-800 dark:focus:ring-indigo-500/20"
                placeholder="e.g. Acme SaaS Platform"
              />
            </div>

            {/* Description */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-zinc-800 dark:focus:ring-indigo-500/20"
                placeholder="Brief summary of what this project aims to accomplish..."
              />
            </div>

          </div>
        </div>

        {/* Repository & Links */}

        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">

          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
            Repository & Links
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Tech Stack */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Tech Stack
              </label>

              <div className="relative">

                <Code2
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="techStack"
                  value={form.techStack}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-zinc-800/50 dark:focus:ring-indigo-500/20"
                  placeholder="React, Spring Boot, MySQL"
                />

              </div>
            </div>

            {/* Project Role */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Your Role
              </label>

              <div className="relative">

                <Briefcase
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="projectRole"
                  value={form.projectRole}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-zinc-800/50 dark:focus:ring-indigo-500/20"
                  placeholder="Lead Maintainer, Fullstack Dev"
                />

              </div>
            </div>

            {/* GitHub */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                GitHub Repository
              </label>

              <div className="relative">

                <GitBranch
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="url"
                  name="githubUrl"
                  value={form.githubUrl}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-zinc-800/50 dark:focus:ring-indigo-500/20"
                  placeholder="https://github.com/org/repo"
                />

              </div>
            </div>

            {/* Live URL */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Live Preview URL
              </label>

              <div className="relative">

                <Globe
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="url"
                  name="liveUrl"
                  value={form.liveUrl}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-zinc-800/50 dark:focus:ring-indigo-500/20"
                  placeholder="https://my-awesome-app.com"
                />

              </div>
            </div>

          </div>
        </div>

        {/* Team & Collaboration */}

        <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 sm:p-7">

          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
            Team & Recruiting Settings
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Team Size */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Current Team Size
              </label>

              <div className="relative">

                <Users
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  name="teamSize"
                  min="1"
                  value={form.teamSize}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-zinc-800/50 dark:focus:ring-indigo-500/20"
                />

              </div>
            </div>

            {/* Looking For */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Roles You are Recruiting
              </label>

              <div className="relative">

                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="lookingFor"
                  value={form.lookingFor}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-zinc-800/50 dark:text-white dark:focus:ring-indigo-500/20"
                  placeholder="UI/UX Designer, Backend Dev"
                />

              </div>
            </div>

            {/* Collaboration Toggle */}

            <div className="pt-2 md:col-span-2">

              <label className="group flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 p-4 transition hover:bg-gray-100/60 dark:border-zinc-800/60 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/60">

                <div className="flex items-start gap-3">

                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <Sparkles size={16} />
                  </div>

                  <div>

                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      Open to Collaborators
                    </span>

                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      Showcase this project as actively looking for team members on the platform.
                    </span>

                  </div>

                </div>

                <div className="relative inline-flex items-center">

                  <input
                    type="checkbox"
                    name="lookingForCollaborators"
                    checked={form.lookingForCollaborators}
                    onChange={handleChange}
                    className="peer sr-only"
                  />

                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-zinc-700 dark:after:border-zinc-600 dark:peer-checked:bg-indigo-500" />

                </div>

              </label>

            </div>

          </div>
        </div>

        {/* Action Bar */}

        <div className="flex items-center justify-end gap-3 pt-2">

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >

            {saving ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}

          </button>

        </div>

      </form>
    </div>
  );
};

export default Settings;

