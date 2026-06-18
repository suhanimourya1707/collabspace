import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import Navbar from "../components/Navbar";
import DashboardPage from "../pages/DashboardPage";
import RegisterPage from "../pages/RegisterPage";
import KanbanPage from "../pages/KanbanPage";
import DocumentsPage from "../pages/DocumentsPage";
function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/kanban/:workspaceId" element={<KanbanPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;
