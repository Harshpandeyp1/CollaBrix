import React, { useEffect, useState, useRef } from "react";
import api from "../../Services/api";

const Files = ({ projectId }) => {
    // =====================================================
    // STATE
    // =====================================================
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [actionLoading, setActionLoading] = useState({});
    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef(null);

    // =====================================================
    // FETCH FILES
    // =====================================================
    useEffect(() => {
        if (projectId) {
            fetchFiles();
        }
    }, [projectId]);

    const fetchFiles = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get(`/playground/${projectId}/files`);
            setFiles(response.data || []);
        } catch (err) {
            console.error("Failed to fetch files:", err);
            setError("Failed to load files. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FILE HANDLERS
    // =====================================================
    const handleFileSelect = (file) => {
        if (!file) return;
        setSelectedFile(file);
        setError("");
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // =====================================================
    // UPLOAD FILE
    // =====================================================
    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a file first.");
            return;
        }

        try {
            setUploading(true);
            setError("");

            const formData = new FormData();
            formData.append("file", selectedFile);

            const response = await api.post(
                `/playground/${projectId}/files`,
                formData
            );

            setFiles((prev) => [response.data, ...prev]);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) {
            console.error("Failed to upload file:", err);
            setError("Failed to upload file. Please check the file size and type.");
        } finally {
            setUploading(false);
        }
    };

    // =====================================================
    // DOWNLOAD FILE
    // =====================================================
    const handleDownload = async (file) => {
        try {
            setActionLoading((prev) => ({ ...prev, [`download-${file.id}`]: true }));
            const response = await api.get(`/playground/files/${file.id}`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.fileName);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to download file:", err);
            setError("Failed to download file.");
        } finally {
            setActionLoading((prev) => ({ ...prev, [`download-${file.id}`]: false }));
        }
    };

    // =====================================================
    // DELETE FILE
    // =====================================================
    const handleDelete = async (fileId) => {
        if (!window.confirm("Are you sure you want to delete this file?")) {
            return;
        }

        try {
            setActionLoading((prev) => ({ ...prev, [`delete-${fileId}`]: true }));
            setError("");
            await api.delete(`/playground/files/${fileId}`);
            setFiles((prev) => prev.filter((f) => f.id !== fileId));
        } catch (err) {
            console.error("Failed to delete file:", err);
            setError("Failed to delete file.");
        } finally {
            setActionLoading((prev) => ({ ...prev, [`delete-${fileId}`]: false }));
        }
    };

    // =====================================================
    // UTILS
    // =====================================================
    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return "0 Bytes";
        const units = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // =====================================================
    // RENDER
    // =====================================================
    return (
        <div className="max-w-5xl mx-auto space-y-8 p-1 text-slate-800 dark:text-zinc-100">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200 dark:border-zinc-800">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        Project Documents
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                        Manage, upload, and download assets attached to this workspace.
                    </p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 rounded-full">
                    {files.length} {files.length === 1 ? "File" : "Files"}
                </span>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 text-sm">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                    <button onClick={() => setError("")} className="hover:opacity-75">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all duration-200 text-center ${
                    isDragging
                        ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                        : "border-slate-300 hover:border-slate-400 bg-slate-50/50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-zinc-900/40"
                }`}
            >
                <input
                    ref={fileInputRef}
                    id="fileInput"
                    type="file"
                    onChange={handleInputChange}
                    className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3.5 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-slate-200/80 dark:border-zinc-700/60 text-slate-600 dark:text-zinc-300 group-hover:scale-105 transition-transform">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-zinc-200">
                            <span className="text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
                            Any standard document, compressed archive, or media file
                        </p>
                    </div>
                </div>

                {/* Selected File Card Bar */}
                {selectedFile && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-6 flex items-center justify-between gap-4 p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-sm max-w-xl mx-auto text-left"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate text-slate-800 dark:text-zinc-200">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-zinc-500">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => setSelectedFile(null)}
                                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={uploading}
                                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 transition"
                            >
                                {uploading ? (
                                    <>
                                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    "Confirm Upload"
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* File List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-zinc-500">
                    <svg className="w-6 h-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm">Fetching files...</span>
                </div>
            ) : files.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 p-12 text-center bg-white dark:bg-zinc-900/50">
                    <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500 mb-3">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12.75M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-zinc-200">No files found</p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
                        Upload your first file using the dropzone above.
                    </p>
                </div>
            ) : (
                <div className="grid gap-3">
                    {files.map((file) => {
                        const isDownloading = actionLoading[`download-${file.id}`];
                        const isDeleting = actionLoading[`delete-${file.id}`];

                        return (
                            <div
                                key={file.id}
                                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700 transition-all shadow-sm hover:shadow"
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5-3h7.5M6 20.25h12A2.25 2.25 0 0020.25 18V8.25A2.25 2.25 0 0018 6H6A2.25 2.25 0 003.75 8.25v9.75A2.25 2.25 0 006 20.25z" />
                                        </svg>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900 dark:text-zinc-100 truncate">
                                            {file.fileName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 dark:text-zinc-500 flex-wrap">
                                            <span>{formatFileSize(file.fileSize)}</span>
                                            <span>•</span>
                                            <span>Uploaded by {file.uploadedByUsername || "Unknown"}</span>
                                            {file.createdAt && (
                                                <>
                                                    <span>•</span>
                                                    <span>{formatDate(file.createdAt)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                    <button
                                        onClick={() => handleDownload(file)}
                                        disabled={isDownloading}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition disabled:opacity-50"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                        </svg>
                                        {isDownloading ? "Saving..." : "Download"}
                                    </button>

                                    <button
                                        onClick={() => handleDelete(file.id)}
                                        disabled={isDeleting}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition disabled:opacity-50"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Files;