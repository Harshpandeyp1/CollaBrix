import React, { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { saveIdea, unsaveIdea } from "../Services/Ideas";

/**
 * Drop this into any idea card in the feed:
 *
 *   <SaveIdeaButton idea={idea} />
 *
 * `idea.savedByMe` must come from the backend (IdeaDto.savedByMe).
 * Optional: onChange(ideaId, saved) lets the parent react to the change.
 */
const SaveIdeaButton = ({ idea, onChange }) => {

  const [saved, setSaved] = useState(Boolean(idea.savedByMe));
  const [busy, setBusy] = useState(false);

  // keep in sync if the parent reloads the feed
  useEffect(() => {
    setSaved(Boolean(idea.savedByMe));
  }, [idea.savedByMe]);

  const handleClick = async () => {

    if (busy) return;

    const next = !saved;

    setSaved(next);   // update immediately
    setBusy(true);

    try {

      if (next) {
        await saveIdea(idea.id);
      } else {
        await unsaveIdea(idea.id);
      }

      onChange?.(idea.id, next);

    } catch (err) {

      console.error("SAVE IDEA ERROR:", err);

      setSaved(!next);  // roll back

    } finally {

      setBusy(false);

    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      title={saved ? "Remove from saved" : "Save idea"}
      className={`rounded-lg p-2 transition hover:bg-zinc-100 disabled:opacity-60 dark:hover:bg-zinc-800 ${
        saved
          ? "text-yellow-500"
          : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
      }`}
    >
      {saved ? (
        <BookmarkCheck size={16} className="fill-yellow-100" />
      ) : (
        <Bookmark size={16} />
      )}
    </button>
  );
};

export default SaveIdeaButton;