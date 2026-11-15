import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Lightbulb, Search, Sparkles, Users } from "lucide-react";
import ProjectCard from "../Components/ProjectCard";
import PublicNavbar from "../Components/PublicNavbar";
import { getAllPosts } from "../Services/Post";
import { getDiscoveryProjects } from "../Services/Project";

const getItems = (response, keys) => {
  if (Array.isArray(response)) return response;

  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
  }

  return response?.data ? getItems(response.data, keys) : [];
};

const getIdeaAuthor = (idea) =>
  idea.createdByUsername ||
  idea.username ||
  idea.fullName ||
  idea.createdBy?.username ||
  idea.user?.username ||
  idea.author?.username ||
  "Community member";

const getFeedError = (error, label) => {
  if ([401, 403].includes(error?.response?.status)) {
    return `The server requires sign-in to view ${label}.`;
  }

  return `${label[0].toUpperCase()}${label.slice(1)} could not be loaded.`;
};

const Explore = () => {
  const [ideas, setIdeas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadDiscovery = useCallback(async () => {
    setLoading(true);
    setLoadErrors([]);

    const [ideasResult, projectsResult] = await Promise.allSettled([
      getAllPosts(),
      getDiscoveryProjects(),
    ]);

    const errors = [];
    if (ideasResult.status === "fulfilled") {
      setIdeas(
        getItems(ideasResult.value, ["posts", "ideas"]).filter(
          (idea) => !idea.project
        )
      );
    } else {
      console.error("Failed to load public ideas:", ideasResult.reason);
      setIdeas([]);
      errors.push(getFeedError(ideasResult.reason, "ideas"));
    }

    if (projectsResult.status === "fulfilled") {
      setProjects(getItems(projectsResult.value, ["projects", "data"]));
    } else {
      console.error("Failed to load public projects:", projectsResult.reason);
      setProjects([]);
      errors.push(getFeedError(projectsResult.reason, "projects"));
    }

    setLoadErrors(errors);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDiscovery();
  }, [loadDiscovery]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const items = [
      ...(activeFilter !== "idea"
        ? projects.map((project) => ({ kind: "project", item: project }))
        : []),
      ...(activeFilter !== "project"
        ? ideas.map((idea) => ({ kind: "idea", item: idea }))
        : []),
    ];

    if (!query) return items;

    return items.filter(({ kind, item }) => {
      const searchableFields =
        kind === "project"
          ? [item.title, item.description, item.techStack]
          : [item.title, item.description, getIdeaAuthor(item)];

      return searchableFields.some((field) =>
        (Array.isArray(field) ? field.join(" ") : String(field || ""))
          .toLowerCase()
          .includes(query)
      );
    });
  }, [activeFilter, ideas, projects, searchQuery]);

  const filters = [
    { key: "all", label: "Everything", count: ideas.length + projects.length },
    { key: "project", label: "Projects", count: projects.length },
    { key: "idea", label: "Ideas", count: ideas.length },
  ];

  return (
    <div className="light-mode-page isolate min-h-screen overflow-x-hidden bg-[#FDFBD4] text-slate-900">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute inset-0 h-full w-full text-indigo-900/10"
          style={{
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 85%)",
          }}
        >
          <defs>
            <pattern id="brick-pattern-explore" width="80" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M0 0H80 M0 20H80 M0 0V20 M40 0V20 M20 20V40 M60 20V40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#brick-pattern-explore)" />
        </svg>
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-400/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-[5%] top-[24%] h-10 w-20 rotate-[-12deg] rounded-lg border border-indigo-500/25 bg-indigo-400/20 backdrop-blur-sm" />
        <div className="absolute right-[7%] top-[36%] h-8 w-16 rotate-[10deg] rounded-md border border-teal-500/25 bg-teal-400/20 backdrop-blur-sm" />
      </div>

      <PublicNavbar />

      <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <section id="community" className="relative mb-12 grid items-center gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div className="relative z-10 max-w-2xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100/90 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-sky-700 backdrop-blur-sm">
              <Sparkles size={14} className="text-emerald-500" />
              THE COMMUNITY BOARD
            </span>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Discover ideas.
              <br />
              <span className="bg-linear-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Find your people.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Explore student projects and fresh ideas from the community. Browse freely, then sign in when you’re ready to join in.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              Sign in to get involved <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-[500px]">
            <div aria-hidden="true" className="absolute -inset-5 rounded-[2.5rem] bg-linear-to-br from-indigo-200/50 via-white/20 to-teal-200/50 blur-2xl" />
            <div className="relative rotate-1 rounded-[1.75rem] border border-white/80 bg-white/85 p-4 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.3)] backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-emerald-600">COLLABRIX DISCOVERY</p>
                  <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">A place to start building</h2>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-700">
                  <Sparkles size={19} />
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveFilter("project")}
                  className="rounded-xl border border-sky-100 bg-sky-50/80 p-4 text-left transition hover:-translate-y-0.5 hover:bg-sky-50"
                >
                  <Code2 size={18} className="text-sky-600" />
                  <p className="mt-3 text-2xl font-black text-slate-900">{projects.length}</p>
                  <p className="text-xs font-semibold text-slate-500">Projects to explore</p>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter("idea")}
                  className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-4 text-left transition hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  <Lightbulb size={18} className="text-emerald-600" />
                  <p className="mt-3 text-2xl font-black text-slate-900">{ideas.length}</p>
                  <p className="text-xs font-semibold text-slate-500">Ideas taking shape</p>
                </button>
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3.5 text-white">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                  <Users size={17} />
                </span>
                <div>
                  <p className="text-xs font-bold">Build something meaningful</p>
                  <p className="mt-0.5 text-[10px] text-slate-300">Find a team, share an idea, make it real.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Explore community ideas and projects">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  aria-pressed={activeFilter === filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    activeFilter === filter.key
                      ? "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
                      : "border border-slate-200 bg-white/80 text-slate-600 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  }`}
                >
                  {filter.label}
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                    activeFilter === filter.key
                      ? "bg-white/15 text-white"
                      : "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2.5 text-slate-400 shadow-sm sm:max-w-xs dark:border-zinc-700 dark:bg-zinc-900">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search ideas and projects"
                aria-label="Search ideas and projects"
                className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </label>
          </div>

          {loadErrors.length > 0 && (
            <div
              role="alert"
              className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
            >
              <span>{loadErrors.join(" ")}</span>
              <button
                type="button"
                onClick={loadDiscovery}
                className="self-start font-semibold underline sm:self-auto"
              >
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div role="status" className="rounded-2xl border border-slate-200 bg-white/80 px-5 py-16 text-center text-sm text-slate-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              Loading ideas and projects...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900/70">
              <Lightbulb className="mx-auto mb-3 text-amber-500" size={30} aria-hidden="true" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {searchQuery ? "No matches found" : "Nothing to explore just yet"}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                {searchQuery
                  ? "Try a different search or browse another category."
                  : "Check back soon for fresh ideas and projects from the community."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map(({ kind, item }, index) => {
                const itemId = item.id ?? item._id ?? `${kind}-${index}`;

                if (kind === "project") {
                  return (
                    <ProjectCard
                      key={`project-${itemId}`}
                      project={item}
                      readOnly
                    />
                  );
                }

                return (
                  <article
                    key={`idea-${itemId}`}
                    className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700">
                        <Lightbulb size={13} className="text-emerald-500" /> IDEA
                      </span>
                      <span className="text-xs text-slate-400 dark:text-zinc-500">
                        {getIdeaAuthor(item)}
                      </span>
                    </div>
                    <h2 className="mt-5 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                      {item.title || "Untitled Idea"}
                    </h2>
                    <p className="mt-2 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                      {item.description || "No description provided yet."}
                    </p>
                    <Link
                      to="/login"
                      className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                    >
                      Sign in to interact <ArrowRight size={14} />
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="relative z-10 bg-sky-950 px-4 py-6 text-sm text-sky-200 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wide text-white">collaBRIX</span>
            <span className="text-sky-300/70">© {new Date().getFullYear()}</span>
          </div>
          <nav aria-label="Footer navigation" className="flex items-center gap-5 text-xs text-sky-300/80">
            <Link to="/" className="transition hover:text-white">Home</Link>
            <Link to="/login" className="transition hover:text-white">Join the community</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Explore;
