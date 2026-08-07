import React from "react";
import {
  Pencil,
  Trash2,
  ExternalLink,
  ImageOff,
  Award,
  FileText,
  Globe,
  PlayCircle,
} from "lucide-react";

const TYPE_STYLES = {
  GITHUB: "bg-gray-100 text-gray-700",
  PORTFOLIO: "bg-indigo-100 text-indigo-700",
  CERTIFICATE: "bg-yellow-100 text-yellow-700",
  RESUME: "bg-green-100 text-green-700",
  VIDEO: "bg-red-100 text-red-700",
  OTHER: "bg-blue-100 text-blue-700",
};

const getTypeIcon = (type) => {
  switch (type) {
    case "PORTFOLIO":
      return <Globe size={14} />;
    case "CERTIFICATE":
      return <Award size={14} />;
    case "RESUME":
      return <FileText size={14} />;
    case "VIDEO":
      return <PlayCircle size={14} />;
    default:
      return <ExternalLink size={14} />;
  }
};

const formatType = (type) => {
  if (!type) return "";

  return type
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const FeaturedCard = ({ featured, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete "${featured.title}"?`)) {
      onDelete(featured);
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">

      {/* Thumbnail */}

      <a
        href={featured.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="aspect-video bg-gradient-to-r from-sky-50 to-indigo-50 flex items-center justify-center overflow-hidden">

          {featured.thumbnail ? (
            <img
              src={featured.thumbnail}
              alt={featured.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <ImageOff size={30} />
              <span className="text-xs mt-1">No Preview</span>
            </div>
          )}

        </div>
      </a>

      {/* Body */}

      <div className="p-4 flex flex-col flex-1 min-h-0">

        <span
          className={`inline-flex w-fit items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            TYPE_STYLES[featured.type] || "bg-gray-100 text-gray-700"
          }`}
        >
          {getTypeIcon(featured.type)}
          {formatType(featured.type)}
        </span>

        <h3 className="mt-3 text-lg font-bold text-gray-900 line-clamp-1">
          {featured.title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-1">
          {featured.description}
        </p>

        <div className="mt-4 flex justify-between items-center border-t pt-3">

          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            <ExternalLink size={15} />
            Visit
          </a>

          <div className="flex gap-2">

            <button
              onClick={() => onEdit(featured)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={handleDelete}
              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              <Trash2 size={16} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default FeaturedCard;