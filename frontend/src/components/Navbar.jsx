import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <span className="text-xl font-bold">CollabSpace</span>
      <div className="flex gap-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
