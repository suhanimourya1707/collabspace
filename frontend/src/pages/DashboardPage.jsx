import { useState, useEffect } from "react";
import api from "../api/axios";

function DashboardPage() {
  const [workspaces, setWorkspaces] = useState([]);

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
