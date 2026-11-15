import React, { useCallback, useEffect, useState } from "react";
import { Check, Copy, ListChecks, LoaderCircle, Sparkles, X } from "lucide-react";
import { aiErrorMessage, improveIdea, planFromIdea } from "../Services/aiService";
import { updatePost } from "../Services/Post";
import { updateProject } from "../Services/Project";

const getProjectPayload = (project, title, description) => ({
  title,
  description,
  techStack: project.techStack ?? "",
  githubUrl: project.githubUrl ?? "",
  liveUrl: project.liveUrl ?? "",
  image: project.image ?? "",
  status: project.status ?? "PLANNING",
  lookingForCollaborators: project.lookingForCollaborators ?? false,
});

const getPostPayload = (post, title, description) => ({
  title,
  description,
  techStack: Array.isArray(post.techStack)
    ? post.techStack
    : (post.techStack ?? "").split(",").map((item) => item.trim()).filter(Boolean),
  rolesNeeded: Array.isArray(post.rolesNeeded)
    ? post.rolesNeeded
    : (post.rolesNeeded ?? "").split(",").map((item) => item.trim()).filter(Boolean),
  status: post.status ?? "IDEA",
  teamSizeNeeded: post.teamSizeNeeded ?? 0,
  duration: post.duration ?? "",
  githubUrl: post.githubUrl ?? "",
  demoUrl: post.demoUrl ?? "",
  bannerImage: post.bannerImage ?? "",
  tags: Array.isArray(post.tags)
    ? post.tags
    : (post.tags ?? "").split(",").map((item) => item.trim()).filter(Boolean),
});

const FeedAiModal = ({ item, isProject, canEdit, mode, onClose, onUpdated }) => {
  const content = isProject ? item.project ?? item : item;
  const contentId = content.id ?? content._id;
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [title, setTitle] = useState(content.title ?? "");
  const [description, setDescription] = useState(content.description ?? "");
  const [plan, setPlan] = useState(null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const runAi = useCallback(async () => {
    setStatus("loading");
    setError("");

    try {
      if (mode === "plan") {
        if (contentId == null) {
          throw new Error("This feed item has no ID, so a plan cannot be generated.");
        }

        const result = await planFromIdea(contentId);
        setPlan(result);
      } else {
        const result = await improveIdea({
          title: content.title ?? "",
          description: content.description ?? "",
        });
        setTitle(result.title ?? "");
        setDescription(result.description ?? "");
      }

      setStatus("done");
    } catch (requestError) {
      console.error("Feed AI request failed:", requestError);
      setError(
        requestError.message?.startsWith("This feed item") ||
          requestError.message?.startsWith("This project")
          ? requestError.message
          : aiErrorMessage(requestError)
      );
      setStatus("error");
    }
  }, [content.description, content.title, contentId, mode]);

  useEffect(() => {
    runAi();
  }, [runAi]);

  const saveSuggestion = async () => {
    if (!canEdit || contentId == null || saving) return;

    try {
      setSaving(true);
      if (isProject) {
        await updateProject(
          contentId,
          getProjectPayload(content, title.trim(), description.trim())
        );
      } else {
        const postId = item.id ?? item._id;
        if (postId == null) {
          throw new Error("This idea cannot be updated because it has no ID.");
        }
        await updatePost(
          postId,
          getPostPayload(item, title.trim(), description.trim())
        );
      }

      await onUpdated?.();
      onClose();
    } catch (saveError) {
      console.error("Failed to save AI suggestion:", saveError);
      setError(
        saveError.response?.data?.message ||
          saveError.message ||
          "Unable to save the AI suggestion."
      );
    } finally {
      setSaving(false);
    }
  };

  const copyPlan = async () => {
    const text = [
      plan?.projectName,
      "",
      plan?.summary,
      "",
      ...(plan?.milestones ?? []).flatMap((milestone, index) => [
        `${index + 1}. ${milestone.title}: ${milestone.goal}`,
        ...(milestone.tasks ?? []).map((task) => `   - ${task}`),
      ]),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (copyError) {
      console.error("Failed to copy AI plan:", copyError);
      setError("Unable to copy the plan. Check your browser clipboard permissions.");
    }
  };

  const isPlan = mode === "plan";

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="feed-ai-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl shadow-slate-950/30 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 bg-linear-to-r from-sky-50 to-violet-50 px-6 py-5 dark:border-zinc-800 dark:from-sky-950/30 dark:to-violet-950/30">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm dark:bg-zinc-800 dark:text-violet-300">
              {isPlan ? <ListChecks size={20} /> : <Sparkles size={20} />}
            </span>
            <div>
              <h2 id="feed-ai-title" className="text-lg font-bold text-slate-900 dark:text-white">
                {isPlan ? "AI project plan" : `Restructure ${isProject ? "project" : "idea"}`}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-zinc-400">
                {content.title || "Untitled"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI dialog"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-white hover:text-slate-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <div className="overflow-y-auto p-6">
          {status === "loading" && (
            <div role="status" className="flex flex-col items-center gap-3 py-12 text-center">
              <LoaderCircle className="animate-spin text-violet-600 dark:text-violet-300" size={30} />
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                {isPlan ? "Building a practical plan..." : "Restructuring the content..."}
              </p>
            </div>
          )}

          {status === "error" && (
            <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
              <button
                type="button"
                onClick={runAi}
                className="ml-3 font-semibold underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          )}

          {status === "done" && !isPlan && (
            <div className="space-y-5">
              <div>
                <label htmlFor="feed-ai-title-input" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  Improved title
                </label>
                <input
                  id="feed-ai-title-input"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={150}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-violet-500"
                />
              </div>
              <div>
                <label htmlFor="feed-ai-description-input" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  Improved description
                </label>
                <textarea
                  id="feed-ai-description-input"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={2000}
                  rows={6}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-violet-500"
                />
              </div>
              {error && <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
              {!canEdit && (
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  You can preview and edit this suggestion, but only its owner can save changes to the feed.
                </p>
              )}
            </div>
          )}

          {status === "done" && isPlan && plan && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.projectName}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-300">{plan.summary}</p>
              </div>
              {(plan.milestones ?? []).map((milestone, index) => (
                <article key={`${milestone.title}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-800/60">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {index + 1}. {milestone.title}
                  </h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{milestone.goal}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-zinc-300">
                    {(milestone.tasks ?? []).map((task, taskIndex) => (
                      <li key={`${task}-${taskIndex}`}>{task}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>

        {status === "done" && (
          <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-6 py-4 dark:border-zinc-800">
            {isPlan ? (
              <>
                <button type="button" onClick={runAi} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                  Regenerate
                </button>
                <button type="button" onClick={copyPlan} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied" : "Copy plan"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={saveSuggestion}
                disabled={!canEdit || saving || !title.trim()}
                className="rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : isProject ? "Apply to project" : "Apply to idea"}
              </button>
            )}
          </footer>
        )}
      </section>
    </div>
  );
};

export default FeedAiModal;
