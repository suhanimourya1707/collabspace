import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <Link to="/" className="text-xl font-bold text-blue-600">
        CollabSpace
      </Link>
      <div className="flex gap-6 text-sm font-medium text-slate-600">
        <Link to="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
          Dashboard
        </Link>
        <Link to="/login" className="hover:text-blue-600 transition-colors">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
