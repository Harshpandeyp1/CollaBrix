import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2,
  FolderGit2,
  ArrowRight,
  Sparkles,
  Inbox,
  AlertCircle,
  ShieldCheck,
  Layers,
} from "lucide-react";
import api from "../Services/api";
import Navbar from "../Components/Navbar";

const Playground = () => {
  const [playgrounds, setPlaygrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaygrounds = async () => {
      try {
        const response = await api.get("/playground");
        setPlaygrounds(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch playgrounds:", error);
        setError("Failed to load your playgrounds.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaygrounds();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-4rem)] w-full bg-linear-to-b from-sky-100 via-teal-100 to-blue-100 px-4 py-8 dark:from-zinc-950 dark:via-black dark:to-zinc-950">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* PAGE HEADER */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 ring-1 ring-black/5 dark:bg-indigo-950/60 dark:text-indigo-400 dark:ring-white/5">
                  <Code2 size={20} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Your Playgrounds
                </h1>
                {playgrounds.length > 0 && !loading && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-bold text-white shadow-xs">
                    {playgrounds.length}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-zinc-400">
                Collaborate with your project members in real-time developer workspaces.
              </p>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/90">
            {loading ? (
              /* Skeleton Loader */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200 dark:bg-zinc-800" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-zinc-800" />
                        <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-zinc-800/60" />
                      </div>
                    </div>
                    <div className="mt-5 h-9 w-full rounded-xl bg-slate-100 dark:bg-zinc-800" />
                  </div>
                ))}
              </div>
            ) : error ? (
              /* Error State */
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400">
                  <AlertCircle size={22} />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                  Unable to load workspaces
                </h3>
                <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500 max-w-sm">
                  {error}
                </p>
              </div>
            ) : playgrounds.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 ring-1 ring-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <Layers size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Playgrounds yet
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Create a project or become an accepted member of a project to access its collaboration Playground.
                </p>
              </div>
            ) : (
              /* Playgrounds Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {playgrounds.map((playground) => (
                  <div
                    key={playground.projectId}
                    onClick={() =>
                      navigate(`/playground/${playground.projectId}`)
                    }
                    className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-800/50 dark:hover:border-zinc-700 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/10 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:group-hover:bg-indigo-600 dark:group-hover:text-white">
                          <FolderGit2 size={20} />
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                          <ShieldCheck size={11} />
                          Active
                        </span>
                      </div>

                      <div className="mt-4">
                        <h2 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 line-clamp-1">
                          {playground.projectTitle}
                        </h2>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400">
                          <span>Owner:</span>
                          <span className="font-medium text-slate-700 dark:text-zinc-300">
                            @{playground.ownerUsername}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4 dark:border-zinc-800">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/playground/${playground.projectId}`);
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 active:scale-[0.98]"
                      >
                        <span>Open Playground</span>
                        <ArrowRight
                          size={13}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default Playground;