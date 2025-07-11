import React, { useState } from 'react';
import axios from 'axios';

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); // State to store the OTP entered by the user
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Set New Password
  const [generatedOtp, setGeneratedOtp] = useState<number | null>(null); // To store the OTP we generated and sent

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const otpValue = generateOTP(); // Generate OTP
    setGeneratedOtp(otpValue); // Store it in state for later verification

    try {
      // 1. Check if customer exists (optional, but good for UX)
      const customerResponse = await axios.get(`https://rushsphere.onrender.com/api/customers?filters[email][$eq]=${email}`);
      if (customerResponse.data.data.length === 0) {
        setError('No account found with that email address.');
        setLoading(false);
        return;
      }

      // 2. Save OTP to your backend (e.g., Strapi 'otps' collection)
      await axios.post(`https://rushsphere.onrender.com/api/otps`, {
        data: { isUsed: false, otp: otpValue, email: email,other:{ expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()} } // Add expiry
      });

      // 3. Send OTP via email
      await axios.post(`https://rushsphere.onrender.com/api/send-email`, {
        to: email,
        subject: "Your Password Reset OTP",
        message: `Hi there, your One-Time Password (OTP) for password reset is: ${otpValue}. This code is valid for 10 minutes. Please don't share it with anyone.`
      });

      setMessage('A 6-digit OTP has been sent to your email. Please check your inbox.');
      setStep(2); // Move to OTP verification step
    } catch (err: any) {
      console.error("OTP Request Error:", err);
      setError(err.response?.data?.error?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Client-side basic check (optional, but good for immediate feedback)
    if (parseInt(otp, 10) !== generatedOtp) { // Compare entered OTP with stored generated OTP
      setError('Invalid OTP. Please try again.');
      setLoading(false);
      return;
    }

    try {
const otpValidationResponse = await axios.get(`https://rushsphere.onrender.com/api/otps?filters[otp][$eq]=${otp}`);

// Check if any OTP records were found
if (otpValidationResponse.data.data.length === 0) {
  setError('Invalid OTP. Please request a new one.');
  setLoading(false);
  return;
}

// Find the correct OTP record that matches email, isUsed, and expiration
const foundOtpRecord = otpValidationResponse.data.data.find(record =>
  record.email === email &&
  record.isUsed === false &&
  new Date(record.other.expiresAt) > new Date()
);

if (!foundOtpRecord) {
  setError('Invalid or expired OTP. Please request a new one.');
  setLoading(false);
  return;
}

// Mark OTP as used on the backend
const otpRecordId = foundOtpRecord.documentId;
await axios.put(`https://rushsphere.onrender.com/api/otps/${otpRecordId}`, {
  data: { isUsed: true }
});

setMessage('OTP verified successfully. You can now set your new password.');
setStep(3); // Move to set new password step
    } catch (err: any) {
      console.error("OTP Verification Error:", err);
      setError(err.response?.data?.error?.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) { // Basic password strength check
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const customerRes = await axios.get(`https://rushsphere.onrender.com/api/customers?filters[email][$eq]=${email}`);
      console.log(`https://rushsphere.onrender.com/api/customers?filters[email][$eq]=${email}`,customerRes.data)
      if (customerRes.data.data.length === 0) {
        setError('Customer not found for password update.');
        setLoading(false);
        return;
      }
      const customerId = customerRes.data.data[0].documentId;
      await axios.put(`https://rushsphere.onrender.com/api/customers/${customerId}`, {
        data: {
          password: newPassword 
        }
      });


      setMessage('Your password has been successfully reset. You can now log in.');
      setStep(1); // Go back to the initial step or redirect to login
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setGeneratedOtp(null);
    } catch (err: any) {
      console.error("Password Reset Error:", err);
      setError(err.response?.data?.error?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const renderForm = () => {
    switch (step) {
      case 1: // Enter Email
        return (
          <form onSubmit={handleRequestOtp}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
              placeholder="you@example.com"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        );
      case 2: // Enter OTP
        return (
          <form onSubmit={handleVerifyOtp}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <input
              type="text" // OTPs are usually text, or number with pattern
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
              placeholder="6-digit OTP"
              maxLength={6}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => { // Allow re-sending OTP
                setStep(1);
                setMessage('');
                setError('');
              }}
              className="mt-2 w-full text-blue-600 hover:underline text-sm"
            >
              Request a new OTP
            </button>
          </form>
        );
      case 3: // Set New Password
        return (
          <form onSubmit={handleSetNewPassword}>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
              placeholder="Enter new password"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4"
              placeholder="Confirm new password"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Setting Password...' : 'Reset Password'}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {step === 1 && 'Forgot Password for Customer'}
          {step === 2 && 'Verify OTP'}
          {step === 3 && 'Set New Password'}
        </h2>
        <p className="text-gray-600 text-sm mb-4 text-center">
          {step === 1 && 'Enter your email address to receive an OTP.'}
          {step === 2 && `An OTP has been sent to ${email}. Please enter it below.`}
          {step === 3 && 'Enter your new password.'}
        </p>

        {renderForm()}

        {message && <p className="mt-4 text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
