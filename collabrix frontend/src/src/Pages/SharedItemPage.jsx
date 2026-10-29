import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { getPostById } from "../Services/Post";
import { getProjectById } from "../Services/Project";

const SharedItemPage = ({ itemType }) => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchItem = async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          itemType === "POST"
            ? await getPostById(itemId)
            : await getProjectById(itemId);
        const data =
          response?.data ??
          response?.post ??
          response?.project ??
          response;

        if (active) setItem(data);
      } catch (requestError) {
        console.error(`Failed to load shared ${itemType.toLowerCase()}:`, requestError);
        if (active) {
          setError(
            requestError.response?.data?.message ||
              `Unable to load this ${itemType.toLowerCase()}.`
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchItem();
    return () => {
      active = false;
    };
  }, [itemId, itemType]);

  const techStack = Array.isArray(item?.techStack)
    ? item.techStack
    : typeof item?.techStack === "string"
      ? item.techStack.split(",").map((technology) => technology.trim()).filter(Boolean)
      : [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FDFBD4] px-4 py-8 dark:bg-black">
        <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Back
          </button>

          {loading ? (
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Loading {itemType.toLowerCase()}...
            </p>
          ) : error ? (
            <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
              {error}
            </p>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                Shared {itemType.toLowerCase()}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {item?.title || `Untitled ${itemType.toLowerCase()}`}
              </h1>
              {item?.image && (
                <img
                  src={item.image}
                  alt={item.title || ""}
                  className="mt-5 max-h-96 w-full rounded-xl object-cover"
                />
              )}
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
                {item?.description || item?.content || "No description available."}
              </p>
              {techStack.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {techStack.map((technology, index) => (
                    <span
                      key={`${technology}-${index}`}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              )}
              {itemType === "PROJECT" && (item?.githubUrl || item?.liveUrl) && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Source repository
                    </a>
                  )}
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      Live project
                    </a>
                  )}
                </div>
              )}
            </>
          )}

          <Link
            to="/Messages"
            className="mt-8 inline-block text-sm font-semibold text-slate-500 hover:underline dark:text-zinc-400"
          >
            Return to messages
          </Link>
        </article>
      </main>
    </>
  );
};

export default SharedItemPage;
