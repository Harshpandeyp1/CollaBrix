import React, { useEffect, useState } from "react";

import {
  CheckCircle2,
  FileText,
  Lightbulb,
  UserPlus,
  ListTodo,
  Activity as ActivityIcon,
} from "lucide-react";

import api from "../../Services/api";

const PlaygroundActivity = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/playground/${projectId}/activity`
        );

        console.log("ACTIVITY DATA:", response.data);

        setActivities(response.data);
        setError("");
      } catch (err) {
        console.error("ACTIVITY ERROR:", err);
        setError("Failed to load project activity.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [projectId]);

  // ---------------------------------------
  // ACTIVITY ICON
  // ---------------------------------------

  const getActivityIcon = (action) => {
    switch (action) {
      case "TASK_CREATED":
        return <ListTodo size={17} />;

      case "TASK_COMPLETED":
        return <CheckCircle2 size={17} />;

      case "IDEA_CREATED":
        return <Lightbulb size={17} />;

      case "FILE_UPLOADED":
        return <FileText size={17} />;

      case "MEMBER_JOINED":
        return <UserPlus size={17} />;

      default:
        return <ActivityIcon size={17} />;
    }
  };

  // ---------------------------------------
  // LOADING
  // ---------------------------------------

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-sm text-zinc-500">
          Loading activity...
        </p>
      </div>
    );
  }

  // ---------------------------------------
  // ERROR
  // ---------------------------------------

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-sm text-red-500">
          {error}
        </p>
      </div>
    );
  }

  // ---------------------------------------
  // EMPTY
  // ---------------------------------------

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400">
          <ActivityIcon size={22} />
        </div>

        <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
          No activity yet
        </h3>

        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-zinc-400">
          Project activity will appear here when team members create
          tasks, ideas, upload files, or join the project.
        </p>

      </div>
    );
  }

  // ---------------------------------------
  // ACTIVITY TIMELINE
  // ---------------------------------------

  return (
    <div className="w-full max-w-3xl">

      {/* HEADER */}

      <div className="mb-8">

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Project Activity
        </h2>

        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
          Recent activity from your project workspace
        </p>

      </div>


      {/* TIMELINE */}

      <div className="relative">

        {/* Vertical line */}

        <div className="absolute left-5 top-2 bottom-2 w-px bg-slate-200 dark:bg-zinc-800" />


        <div className="space-y-7">

          {activities.map((activity) => (

            <div
              key={activity.id}
              className="relative flex gap-4"
            >

              {/* ICON */}

              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-indigo-600 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-indigo-400">
                {getActivityIcon(activity.action)}
              </div>


              {/* ACTIVITY CONTENT */}

              <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

                {/* USER */}

                <div className="flex items-center gap-3">

                  {activity.profileImage ? (
                    <img
                      src={`http://localhost:8080${activity.profileImage}`}
                      alt={activity.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      {activity.username
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>
                  )}

                  <div>

                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {activity.username}
                    </p>

                    <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                      {new Date(
                        activity.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>


                {/* DESCRIPTION */}

                <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300">
                  {activity.description}
                </p>


                {/* ACTION */}

                <div className="mt-3">

                  <span className="inline-flex rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    {activity.action.replaceAll("_", " ")}
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default PlaygroundActivity;