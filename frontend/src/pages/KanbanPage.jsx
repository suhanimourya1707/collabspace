import { useState, useEffect } from "react";
import api from "../api/axios";
import useWebSocket from "../hooks/useWebSocket";
import { useParams } from "react-router-dom";

function KanbanPage() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "user";
  const { workspaceId } = useParams();

  useWebSocket(workspaceId, username, (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === "users") {
        setOnlineUsers(data.users);
      }
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
    } catch (error) {
      alert("Failed to load tasks");
    }
  };
  const moveTask = async (taskId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      await api.put(
        `/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchTasks();
    } catch (error) {
      alert("Failed to move task");
    }
  };
  const createTask = async () => {
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
    } catch (error) {
      alert("Failed to create task");
    }
  };

  const todo = tasks.filter((t) => t.status === "todo");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Kanban Board</h1>
      <p className="text-gray-500 mb-2">Workspace ID: {workspaceId}</p>
      <div className="mb-4 flex gap-2">
        <span className="text-sm text-gray-600">Online:</span>
        {onlineUsers.map((user, index) => (
          <span
            key={index}
            className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
          >
            🟢 {user}
          </span>
        ))}
      </div>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          className="border p-2 rounded mr-2"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={createTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-3">TODO</h2>
          {todo.map((task) => (
            <div key={task.id} className="bg-white p-3 rounded shadow mb-2">
              <p className="font-semibold">{task.title}</p>
              <p className="text-gray-500 text-sm">{task.description}</p>
              <button
                onClick={() => moveTask(task.id, "in_progress")}
                className="mt-2 text-xs bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
              >
                → In Progress
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-3">IN PROGRESS</h2>
          {inProgress.map((task) => (
            <div key={task.id} className="bg-white p-3 rounded shadow mb-2">
              <p className="font-semibold">{task.title}</p>
              <p className="text-gray-500 text-sm">{task.description}</p>
              <button
                onClick={() => moveTask(task.id, "done")}
                className="mt-2 text-xs bg-green-400 px-2 py-1 rounded hover:bg-green-500"
              >
                → Done
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-3">DONE</h2>
          {done.map((task) => (
            <div key={task.id} className="bg-white p-3 rounded shadow mb-2">
              <p className="font-semibold">{task.title}</p>
              <p className="text-gray-500 text-sm">{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KanbanPage;
