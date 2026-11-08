import React, { useState } from "react";
import { X, Copy, Check, RefreshCw } from "lucide-react";
import { planFromIdea, aiErrorMessage } from "../../Services/aiService";

// Turns the plan object into plain text for "Copy".
// flatMap = map, then flatten. For each milestone we return an ARRAY of lines
// (the title line + its task lines), and flatMap joins all those arrays into one.
// "?? []" means "if this is null/undefined, use an empty list", because the
// model's output should never be trusted to be complete.
const planToText = (p) =>
  [
    p.projectName,
    "",
    p.summary,
    "",
    ...(p.milestones ?? []).flatMap((m, i) => [
      `${i + 1}. ${m.title}: ${m.goal}`,
      ...(m.tasks ?? []).map((t) => `   - ${t}`),
    ]),
  ].join("\n");


// Props: idea = the idea to plan, onClose = function to call to close the modal.
// The PARENT decides whether this component exists (see Ideas.jsx below).
// When the parent stops rendering it, all its state disappears, so it resets itself.
const PlanModal = ({ idea, onClose }) => {

  // ONE state variable for the four states, instead of several booleans.
  // With separate booleans (loading, done, error) you can end up "loading AND done"
  // by mistake. A single status string makes impossible combinations impossible.
  const [status, setStatus] = useState("idle");   // "idle" | "loading" | "done" | "error"

  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {

    // Guard against double-clicks. Each request costs money and a rate-limit slot.
    if (status === "loading") return;

    setStatus("loading");
    setError("");

    try {

      const result = await planFromIdea(idea.id);

      setPlan(result);
      setStatus("done");

    } catch (err) {

      console.error("PLAN ERROR:", err);     // full detail for YOU, in the browser console

      setError(aiErrorMessage(err));         // friendly sentence for the USER
      setStatus("error");
    }
  };

  const copyPlan = async () => {

    try {
      // The browser's clipboard API. It can fail (permissions, non-https),
      // so it lives in a try/catch.
      await navigator.clipboard.writeText(planToText(plan));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);   // show "Copied" for 2 seconds
    } catch (err) {
      console.error("COPY ERROR:", err);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-900">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Project plan
            </h3>
            <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
              From: {idea.title}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X size={18} />
          </button>

        </div>


        {/* BODY: exactly one of these four blocks shows, chosen by "status" */}

        <div className="mt-5 flex-1 overflow-y-auto">

          {/* IDLE: nothing has been spent yet */}
          {status === "idle" && (
            <div className="py-10 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Turn this idea into a starter plan with milestones and tasks.
                The plan is a suggestion, and nothing is saved.
              </p>
              <button
                onClick={generate}
                className="mt-5 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Generate plan
              </button>
            </div>
          )}

          {/* LOADING: tell the user it is normal for this to take a while */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-white" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Planning... this can take up to 30 seconds.
              </p>
            </div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <div className="py-10 text-center">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={generate}
                className="mt-4 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Try again
              </button>
            </div>
          )}

          {/* DONE.
              All of this text came from an AI. React escapes text in JSX, so
              <script> inside it would show as text, not run. Never render AI
              output with dangerouslySetInnerHTML. */}
          {status === "done" && plan && (
            <div className="space-y-5">

              <div>
                <h4 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {plan.projectName}
                </h4>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  {plan.summary}
                </p>
              </div>

              <div className="space-y-3">
                {(plan.milestones ?? []).map((m, i) => (
                  // key must be unique among siblings. The model gives no ids,
                  // and this list never reorders, so the index is acceptable here.
                  <div
                    key={i}
                    className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700"
                  >
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {i + 1}. {m.title}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {m.goal}
                    </p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                      {(m.tasks ?? []).map((t, j) => (
                        <li key={j}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>


        {/* FOOTER: only when a plan exists */}

        {status === "done" && (
          <div className="mt-5 flex justify-end gap-2">

            <button
              onClick={generate}
              className="flex items-center gap-2 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <RefreshCw size={15} />
              Regenerate
            </button>

            <button
              onClick={copyPlan}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy plan"}
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default PlanModal;