function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold text-slate-800 mb-3">
        Welcome to CollabSpace
      </h1>
      <p className="text-slate-500 text-lg mb-8 max-w-md">
        A real-time collaborative workspace for teams to manage tasks, share
        documents, and work together.
      </p>
      <a
        href="/login"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Get Started
      </a>
    </div>
  );
}

export default HomePage;
