import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate()

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md text-center animate-fade-in">
        {/* SVG Illustration */}
        <div className="w-full mx-auto mb-8 animate-float">
          <svg
            className="w-full h-auto max-w-xs mx-auto"
            viewBox="0 0 400 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="30" y="60" width="340" height="200" rx="12" fill="#f3f4f6" />
            <rect x="50" y="80" width="300" height="20" rx="5" fill="#d1d5db" />
            <rect x="50" y="110" width="260" height="20" rx="5" fill="#e5e7eb" />
            <rect x="50" y="140" width="280" height="20" rx="5" fill="#e5e7eb" />
            <line x1="50" y1="180" x2="280" y2="220" stroke="#ef4444" strokeWidth="3" />
            <line x1="280" y1="180" x2="50" y2="220" stroke="#ef4444" strokeWidth="3" />
            <circle cx="60" cy="75" r="5" fill="#ef4444" />
            <circle cx="75" cy="75" r="5" fill="#facc15" />
            <circle cx="90" cy="75" r="5" fill="#10b981" />
          </svg>
        </div>

        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">
          Oops! The page you're looking for can't be found.
        </p>
        <button
          onClick={()=>navigate(-1)}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-medium shadow-md hover:bg-blue-700 transition-transform hover:scale-105"
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default NotFound;

