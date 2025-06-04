import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordStepTwo = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.post('http://localhost:1337/api/auth/reset-password-otp', {
        email,
        otp,
        newPassword,
      });

      setMessage('Password reset successfully. You can now log in.');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-md rounded-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">Check your email for the OTP and set a new password.</p>

      <form onSubmit={handleResetPassword}>
        <label className="block text-sm font-medium mb-1">OTP</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Enter OTP"
        />

        <label className="block text-sm font-medium mb-1">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="New password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default ForgotPasswordStepTwo;

