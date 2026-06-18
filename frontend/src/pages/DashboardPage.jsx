import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function DashboardPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createWorkspace = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/workspaces/",
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setWorkspaces([...workspaces, response.data]);
      setName("");
      setDescription("");
    } catch (error) {
      alert("Failed to create workspace");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchWorkspaces(token);
  }, []);

  const fetchWorkspaces = async (token) => {
    try {
      const response = await api.get("/workspaces/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkspaces(response.data);
    } catch (error) {
      alert("Failed to load workspaces");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">
          My Workspaces
        </h1>
        <p className="text-slate-500 mb-8">
          Pick a workspace to manage tasks, or create a new one.
        </p>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            Create Workspace
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workspace name"
              className="flex-1 border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="flex-1 border border-slate-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={createWorkspace}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
            >
              Create
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          {workspaces.map((workspace) => (
            <Link key={workspace.id} to={`/kanban/${workspace.id}`}>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                <h2 className="text-lg font-semibold text-slate-800">
                  {workspace.name}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {workspace.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
