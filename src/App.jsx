import React, { useState } from "react";
import Routes from "./Routes";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [error, setError] = useState(null);

  return (
    <AuthProvider setError={setError}>
      <Routes />
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50">
          <div className="flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}

export default App;
