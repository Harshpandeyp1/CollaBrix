import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Loader2, Share2, X } from "lucide-react";
import { getMyConnections } from "../Services/Connection";
import { shareItem } from "../Services/Share";
import { getProfileImageUrl } from "../Services/Profile";

const ShareModal = ({ open, onClose, itemType, itemId, itemTitle }) => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");

  const normalizeConnectionList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.connections)) return data.connections;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  };

  useEffect(() => {
    if (!open) return undefined;

    let active = true;
    setLoadingConnections(true);
    setError("");

    getMyConnections()
      .then((data) => {
        if (active) {
          setConnections(normalizeConnectionList(data));
        }
      })
      .catch((requestError) => {
        console.error("Failed to load connections for sharing:", requestError);
        if (active) {
          setError(
            requestError.response?.data?.message ||
              "Unable to load your connections."
          );
        }
      })
      .finally(() => {
        if (active) setLoadingConnections(false);
      });

    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSelectedIds([]);
      setMessage("");
      setError("");
    }
  }, [open]);

  const toggleRecipient = (recipientId) => {
    const id = String(recipientId);
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === connections.length) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(connections.map((connection) => String(connection.id)));
  };

  const handleShare = async (event) => {
    event.preventDefault();
    if (itemId == null || selectedIds.length === 0 || sharing) return;

    const normalizedItemId = Number(itemId);
    const recipientIds = selectedIds.map(Number);
    if (
      !Number.isSafeInteger(normalizedItemId) ||
      recipientIds.some((id) => !Number.isSafeInteger(id))
    ) {
      setError("One or more selected connections have an invalid ID.");
      return;
    }

    setSharing(true);
    setError("");

    try {
      await shareItem({
        itemType,
        itemId: normalizedItemId,
        recipientIds,
        message: message.trim() || null,
      });

      const firstRecipient = connections.find(
        (connection) => String(connection.id) === selectedIds[0]
      );
      onClose();

      if (firstRecipient) {
        navigate("/Messages", {
          state: { selectedUser: firstRecipient },
        });
      }
    } catch (requestError) {
      console.error("Failed to share item:", requestError);
      setError(
        requestError.response?.data?.message ||
          "Unable to share this item. Please try again."
      );
    } finally {
      setSharing(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="share-modal-title"
              className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white"
            >
              <Share2 size={18} className="text-indigo-600 dark:text-indigo-400" />
              Share with connections
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              {itemTitle || `Share this ${itemType?.toLowerCase() || "item"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleShare} className="mt-5">
          <label
            htmlFor="share-note"
            className="text-sm font-semibold text-slate-700 dark:text-zinc-200"
          >
            Add a message <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="share-note"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={2}
            maxLength={500}
            placeholder="Say something about this..."
            className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />

          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
              Select connections
            </p>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              {selectedIds.length === connections.length ? "Clear all" : "Select all"}
            </button>
          </div>
          <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-zinc-700">
            {loadingConnections ? (
              <div className="flex items-center justify-center gap-2 p-6 text-sm text-slate-500 dark:text-zinc-400">
                <Loader2 size={16} className="animate-spin" />
                Loading connections...
              </div>
            ) : connections.length === 0 && !error ? (
              <p className="p-6 text-center text-sm text-slate-500 dark:text-zinc-400">
                You don’t have any connections to share with yet.
              </p>
            ) : (
              connections.map((connection) => (
                <label
                  key={connection.id}
                  className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2.5 last:border-b-0 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/70"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(String(connection.id))}
                    onChange={() => toggleRecipient(connection.id)}
                    className="h-4 w-4 accent-indigo-600"
                  />
                  {getProfileImageUrl(connection) ? (
                    <img
                      src={getProfileImageUrl(connection)}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {(connection.fullName || connection.username || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-800 dark:text-zinc-100">
                      {connection.fullName ||
                        connection.username ||
                        "Unknown connection"}
                    </span>
                    {connection.username && connection.fullName && (
                      <span className="block truncate text-xs text-slate-500 dark:text-zinc-400">
                        @{connection.username}
                      </span>
                    )}
                  </span>
                </label>
              ))
            )}
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-400">
              {error}
            </p>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                sharing ||
                loadingConnections ||
                selectedIds.length === 0 ||
                itemId == null
              }
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sharing && <Loader2 size={15} className="animate-spin" />}
              {sharing ? "Sharing..." : `Share${selectedIds.length ? ` (${selectedIds.length})` : ""}`}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body
  );
};

export default ShareModal;
