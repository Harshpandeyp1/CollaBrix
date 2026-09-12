import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FolderGit2,
  Code2,
  MessageSquare,
  CheckSquare,
  Lightbulb,
  FileText,
  GitBranch,
  Users,
  Activity,
  Layers,
  ArrowLeft,
  ShieldCheck,
  Cpu,
  Globe,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Navbar from "../Components/Navbar";
import api from "../Services/api";

const TAB_CONFIG = [
  { name: "Overview", icon: Layers, desc: "Project summary & details" },
  { name: "Discussion", icon: MessageSquare, desc: "Team chat & threads" },
  { name: "Tasks", icon: CheckSquare, desc: "Sprint backlog & cards" },
  { name: "Ideas", icon: Lightbulb, desc: "Brainstorming board" },
  { name: "Files", icon: FileText, desc: "Shared docs & assets" },
  { name: "GitHub", icon: GitBranch, desc: "Repository sync & PRs" },
  { name: "Members", icon: Users, desc: "Collaborators & roles" },
  { name: "Activity", icon: Activity, desc: "Audit logs & commits" },
];

const PlaygroundDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    const fetchPlayground = async () => {
      try {
        const response = await api.get(`/playground/${projectId}`);
        setProject(response.data);
      } catch (err) {
        console.error("Failed to fetch playground:", err);
        setError(
          err.response?.data?.message ||
            "Unable to access this Playground workspace."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlayground();
  }, [projectId]);

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-linear-to-b from-sky-100 via-teal-100 to-blue-100 dark:from-zinc-950 dark:via-black dark:to-zinc-950 overflow-hidden">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 size={32} className="animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="text-xs font-medium text-slate-600 dark:text-zinc-400 tracking-wide">
            Loading Playground Workspace...
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // ERROR STATE
  // -----------------------------
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-b from-sky-100 via-teal-100 to-blue-100 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center bg-white/95 dark:bg-zinc-900/95 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-8 shadow-xl backdrop-blur-md">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Playground Access Denied
            </h2>
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => navigate("/playground")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-[0.98]"
            >
              <ArrowLeft size={13} />
              <span>Return to Playgrounds</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ActiveIcon =
    TAB_CONFIG.find((t) => t.name === activeTab)?.icon || Layers;

  return (
    <div className="h-screen flex flex-col bg-linear-to-b from-sky-100 via-teal-100 to-blue-100 dark:from-zinc-950 dark:via-black dark:to-zinc-950 overflow-hidden">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col min-h-0">
        {/* ========================================================
            UNIFIED WORKSPACE FRAME (Sidebar on Left + Content on Right)
        ======================================================== */}
        <div className="flex-1 flex rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/90 overflow-hidden min-h-0">
          
          {/* ========================================================
              LEFT SIDEBAR: MODULES & DIRECTORY
          ======================================================== */}
          <aside className="w-64 sm:w-72 shrink-0 border-r border-slate-200/80 dark:border-zinc-800/80 flex flex-col h-full bg-slate-50/50 dark:bg-zinc-900/40 min-h-0">
            {/* Sidebar Top: Project & Back CTA */}
            <div className="p-4 border-b border-slate-200/80 dark:border-zinc-800/80 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate("/playground")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition"
                  title="Back to all Playgrounds"
                >
                  <ArrowLeft size={14} />
                  <span>Playgrounds</span>
                </button>

                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <ShieldCheck size={11} />
                  {project.status || "Active"}
                </span>
              </div>

              <div>
                <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate" title={project.projectTitle}>
                  {project.projectTitle}
                </h1>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate mt-0.5">
                  Lead: @{project.ownerUsername}
                </p>
              </div>
            </div>

            {/* Sidebar Modules Feed */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 min-h-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="px-2.5 py-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  Workspace Modules
                </p>
              </div>

              {TAB_CONFIG.map(({ name, icon: Icon, desc }) => {
                const isSelected = activeTab === name;

                return (
                  <button
                    key={name}
                    onClick={() => setActiveTab(name)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-center gap-3 relative ${
                      isSelected
                        ? "bg-indigo-50/80 text-indigo-700 font-semibold ring-1 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:ring-indigo-900 shadow-xs"
                        : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 inset-y-2 w-1 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />
                    )}

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isSelected
                          ? "bg-indigo-600 text-white dark:bg-indigo-600"
                          : "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      <Icon size={15} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs leading-none font-semibold">{name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate mt-1">
                        {desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sidebar Bottom: Repository Link if exists */}
            {project.githubUrl && (
              <div className="p-3 border-t border-slate-200/80 dark:border-zinc-800/80 shrink-0">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <div className="flex items-center gap-2 truncate">
                    <GitBranch size={13} className="text-slate-500 shrink-0" />
                    <span className="truncate">Repository</span>
                  </div>
                  <ExternalLink size={11} className="text-slate-400 shrink-0" />
                </a>
              </div>
            )}
          </aside>

          {/* ========================================================
              RIGHT AREA: ACTIVE CANVAS & DETAIL
          ======================================================== */}
          <section className="flex-1 flex flex-col min-w-0 bg-white/60 dark:bg-zinc-900/60 min-h-0">
            {/* Header / Canvas Breadcrumb */}
            <div className="px-6 py-4 border-b border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 ring-1 ring-black/5 dark:bg-indigo-950/60 dark:text-indigo-400 dark:ring-white/5">
                  <ActiveIcon size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeTab}
                  </h2>
                  <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                    {TAB_CONFIG.find((t) => t.name === activeTab)?.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Canvas Body */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {activeTab === "Overview" ? (
                <div className="space-y-6 max-w-4xl">
                  {/* Summary Box */}
                  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-800/40">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2">
                      About this Project
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-zinc-300 whitespace-pre-wrap">
                      {project.description || "No detailed project description has been provided yet."}
                    </p>
                  </div>

                  {/* Metrics Tiles */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-3">
                      Workspace Details
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-800/40">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                          <Cpu size={15} />
                          <span className="text-[11px] font-semibold uppercase tracking-wider">
                            Tech Stack
                          </span>
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white truncate">
                          {project.techStack || "Not specified"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-800/40">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <Users size={15} />
                          <span className="text-[11px] font-semibold uppercase tracking-wider">
                            Team Size
                          </span>
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white">
                          {project.teamSize || 1} Contributors
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-800/40">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <GitBranch size={15} />
                          <span className="text-[11px] font-semibold uppercase tracking-wider">
                            Repository
                          </span>
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white truncate">
                          {project.githubUrl ? "Connected" : "Unlinked"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-800/40">
                        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                          <Globe size={15} />
                          <span className="text-[11px] font-semibold uppercase tracking-wider">
                            Status
                          </span>
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-900 dark:text-white truncate">
                          {project.status || "Operational"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty Subsystem Canvas */
                <div className="h-full flex flex-col items-center justify-center p-8 text-center select-none">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 ring-1 ring-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <ActiveIcon size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeTab} Workspace
                  </h3>
                  <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                    Collaborative controls and live data for {activeTab.toLowerCase()} will be integrated directly into this canvas.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PlaygroundDetail;