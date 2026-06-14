import { useState, useEffect } from "react";
import api from "../api/axios";

function KanbanPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get("/tasks/1", {
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

  const todo = tasks.filter((t) => t.status === "todo");
  const inProgress = tasks.filter((t) => t.status === "in_progress");
  const done = tasks.filter((t) => t.status === "done");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Kanban Board</h1>
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
