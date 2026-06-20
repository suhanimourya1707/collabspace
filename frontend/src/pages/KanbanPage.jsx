import { useState, useEffect } from "react";
import api from "../api/axios";
import useWebSocket from "../hooks/useWebSocket";
import { useParams } from "react-router-dom";

function KanbanPage() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiTasks, setAiTasks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const { workspaceId } = useParams();
  const username = localStorage.getItem("username") || "user";

  const generateAiTasks = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/ai/generate-tasks",
        { prompt: aiPrompt },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAiTasks(response.data.tasks.map((t) => ({ ...t, selected: true })));
    } catch {
      alert("AI task generation failed, try again");
    }
    setAiLoading(false);
  };

  const toggleAiTask = (index) => {
    setAiTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, selected: !t.selected } : t)),
    );
  };

  const addSelectedAiTasks = async () => {
    const token = localStorage.getItem("token");
    const selected = aiTasks.filter((t) => t.selected);
    try {
      await Promise.all(
        selected.map((t) =>
          api.post(
            "/tasks/",
            {
              title: t.title,
              description: t.description,
              status: "todo",
              deadline: "2026-12-31T00:00:00",
              workspace_id: workspaceId,
              assigned_to: 1,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        ),
      );
      setShowAiModal(false);
      setAiTasks([]);
      setAiPrompt("");
      fetchTasks();
    } catch {
      alert("Failed to add tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useWebSocket(workspaceId, username, (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === "users") setOnlineUsers(data.users);
    } catch {
      fetchTasks();
    }
  });

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get(`/tasks/${workspaceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch {
      alert("Failed to load tasks");
    }
  };

  const moveTask = async (taskId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(
        `/tasks/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchTasks();
    } catch {
      alert("Failed to move task");
    }
  };

  const createTask = async () => {
    if (!title.trim()) return;
    const token = localStorage.getItem("token");
    try {
      await api.post(
        "/tasks/",
        {
          title,
          description,
          status: "todo",
          deadline: "2026-12-31T00:00:00",
          workspace_id: workspaceId,
          assigned_to: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch {
      alert("Failed to create task");
    }
  };

  const todo = tasks.filter((t) => t.status === "todo");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const done = tasks.filter((t) => t.status === "done");

  const Column = ({ title: colTitle, items, color, action }) => (
    <div className="bg-slate-100 rounded-xl p-4 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-2 h-2 rounded-full ${color}`}></span>
        <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
          {colTitle}
        </h2>
        <span className="text-xs text-slate-400">{items.length}</span>
      </div>
      <div className="space-y-3">
        {items.map((task) => (
          <div
            key={task.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
          >
            <p className="font-medium text-slate-800">{task.title}</p>
            <p className="text-slate-500 text-sm mt-1">{task.description}</p>
            {action && (
              <button
                onClick={() => action(task.id)}
                className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                {action === moveTask ? "" : ""}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-bold text-slate-800">Kanban Board</h1>
          <div className="flex gap-1.5">
            {onlineUsers.map((user, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium"
              >
                ● {user}
              </span>
            ))}
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-6">Workspace #{workspaceId}</p>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="flex-1 border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="flex-1 border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={createTask}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
          >
            + Add Task
          </button>
          <button
            onClick={() => setShowAiModal(true)}
            className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 font-medium whitespace-nowrap"
          >
            ✨ Generate Tasks (AI)
          </button>
        </div>

        {showAiModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Generate Tasks with AI
              </h2>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Paste your project goal or meeting notes..."
                rows={4}
                className="w-full border border-slate-300 p-2.5 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={generateAiTasks}
                disabled={aiLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium mb-4 disabled:opacity-50"
              >
                {aiLoading ? "Generating..." : "Generate"}
              </button>

              {aiTasks.length > 0 && (
                <div className="space-y-2 mb-4">
                  {aiTasks.map((t, i) => (
                    <label
                      key={i}
                      className="flex items-start gap-2 border border-slate-200 rounded-lg p-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={t.selected}
                        onChange={() => toggleAiTask(i)}
                        className="mt-1"
                      />
                      <div>
                        <p className="font-medium text-slate-800">{t.title}</p>
                        <p className="text-slate-500 text-sm">
                          {t.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAiModal(false);
                    setAiTasks([]);
                  }}
                  className="text-slate-500 px-4 py-2 hover:text-slate-700"
                >
                  Cancel
                </button>
                {aiTasks.length > 0 && (
                  <button
                    onClick={addSelectedAiTasks}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Add Selected to Board
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                Todo
              </h2>
              <span className="text-xs text-slate-400">{todo.length}</span>
            </div>
            <div className="space-y-3">
              {todo.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
                >
                  <p className="font-medium text-slate-800">{task.title}</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {task.description}
                  </p>
                  <button
                    onClick={() => moveTask(task.id, "in_progress")}
                    className="mt-3 text-xs font-semibold text-amber-600 hover:text-amber-800"
                  >
                    Move to In Progress →
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                In Progress
              </h2>
              <span className="text-xs text-slate-400">
                {inProgress.length}
              </span>
            </div>
            <div className="space-y-3">
              {inProgress.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-slate-200"
                >
                  <p className="font-medium text-slate-800">{task.title}</p>
                  <p className="text-slate-500 text-sm mt-1">
                    {task.description}
                  </p>
                  <button
                    onClick={() => moveTask(task.id, "done")}
                    className="mt-3 text-xs font-semibold text-green-600 hover:text-green-800"
                  >
                    Mark Done →
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <h2 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                Done
              </h2>
              <span className="text-xs text-slate-400">{done.length}</span>
            </div>
            <div className="space-y-3">
              {done.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 opacity-70"
                >
                  <p className="font-medium text-slate-800 line-through">
                    {task.title}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    {task.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KanbanPage;
