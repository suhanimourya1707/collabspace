import { useState, useEffect } from "react";
import api from "../api/axios";
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
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Workspaces</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Create Workspace</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name"
          className="w-full border p-2 rounded mb-2"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border p-2 rounded mb-3"
        />
        <button
          onClick={createWorkspace}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Workspace
        </button>
      </div>
      {workspaces.map((workspace) => (
        <div key={workspace.id} className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-xl font-semibold">{workspace.name}</h2>
          <p className="text-gray-600">{workspace.description}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardPage;
