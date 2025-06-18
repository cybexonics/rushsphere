import { useAuth } from "@/context/AuthProvider"
import { useNavigate } from 'react-router-dom';

const SignupFailed = () => {
const { error } = useAuth()
const navigate = useNavigate();
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
      {/* Failure Icon (e.g., an X mark or caution sign) */}
      <div className="flex items-center justify-center mb-6">
        <svg
          className="w-20 h-20 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </div>

      {/* Main Failure Message */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Sign-up Failed!
      </h1>

      {/* Detailed Error Message */}
      <p className="text-gray-600 mb-6 text-lg">
        We encountered an issue while trying to create your account. Please try again or contact support.
      </p>
      <p className="text-gray-600 mb-6 text-lg">
        {error}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => navigate(-1)} // Replace with actual navigation to previous page or home
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
        >
          Go Back
        </button>
      </div>
    </div>
    </div>
  );
};

export default SignupFailed;
