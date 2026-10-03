import React, { useState } from "react";
import { GitBranch, ExternalLink, Copy, Check, FolderGit2 } from "lucide-react";

const GitHubCard = ({ githubUrl }) => {
  const [copied, setCopied] = useState(false);

  // Extract "owner/repo" string from URL if available
  const getRepoPath = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.pathname.replace(/^\/|\/$/g, "");
    } catch {
      return url;
    }
  };

  const handleCopy = () => {
    if (!githubUrl) return;
    navigator.clipboard.writeText(githubUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // No GitHub repository has been added
  if (!githubUrl) {
    return (
      <div className="flex min-h-[380px] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-8 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100/80 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400">
            <FolderGit2 size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            No Repository Linked
          </h2>

          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            This project does not have a GitHub repository connected yet.
          </p>
        </div>
      </div>
    );
  }

  const repoPath = getRepoPath(githubUrl);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900">
          <GitBranch size={24} />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            GitHub Repository
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Source code and collaboration hub
          </p>
        </div>
      </div>

      {/* Main Repository Card */}
      <div className="group rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition duration-200 hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
        {/* Repo Header Tag */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <GitBranch size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span className="truncate">{repoPath || "Repository"}</span>
          </div>
        </div>

        {/* URL Box with Copy Button */}
        <div className="mb-6">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Repository Link
          </label>
          
          <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-gray-50/70 p-1.5 pl-4 dark:border-zinc-800 dark:bg-zinc-800/50">
            <span className="truncate text-sm font-mono text-gray-700 dark:text-gray-300">
              {githubUrl}
            </span>

            <button
              onClick={handleCopy}
              type="button"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-700/80"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-[0.99] sm:w-auto dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <GitBranch size={18} />
          <span>Open Repository</span>
          <ExternalLink size={15} className="opacity-70" />
        </a>
      </div>
    </div>
  );
};

export default GitHubCard;