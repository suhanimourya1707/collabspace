import { useState, useEffect } from "react";
import api from "../api/axios";

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.get("/documents/1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data);
    } catch (error) {
      alert("Failed to load documents");
    }
  };

  const createDocument = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api.post(
        "/documents/",
        { title, content, workspace_id: 1 },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setDocuments([...documents, response.data]);
      setTitle("");
      setContent("");
    } catch (error) {
      alert("Failed to create document");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Documents</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2 rounded mb-2"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="w-full border p-2 rounded mb-3"
          rows="4"
        />
        <button
          onClick={createDocument}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Document
        </button>
      </div>
      {documents.map((doc) => (
        <div key={doc.id} className="bg-white p-4 rounded-lg shadow mb-3">
          <h2 className="font-semibold text-lg">{doc.title}</h2>
          <p className="text-gray-600">{doc.content}</p>
        </div>
      ))}
    </div>
  );
}

export default DocumentsPage;
