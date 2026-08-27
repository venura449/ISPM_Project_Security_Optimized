import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const Register = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register } = useAuth();

  const validateForm = () => {
    if (!name.trim()) {
      setLocalError('Name is required');
      return false;
    }
    if (!email.trim()) {
      setLocalError('Email is required');
      return false;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }
    if (!agreeTerms) {
      setLocalError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await register(name, email, password);

    if (result.success) {
      setSuccessMessage('Account created successfully! Redirecting...');
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgreeTerms(false);
      // In a real app, navigate to dashboard here
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } else {
      setLocalError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full md:w-[55%] glass-panel-light p-8 lg:p-12 flex flex-col justify-center max-h-[90vh] overflow-y-auto">
      {/* Form Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-800 tracking-tight">create account</h2>
        <p className="text-slate-500 text-sm mt-1.5 font-light">join the modern HR platform</p>
      </div>

      {/* Error Alert */}
      {localError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <i className="fas fa-circle-exclamation text-red-500 mt-0.5"></i>
          <span className="text-red-700 text-sm">{localError}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
          <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
          <span className="text-green-700 text-sm">{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="group">
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Full Name</label>
          <div className="flex items-center gap-2 bg-white/90 rounded-2xl border border-slate-200/80 px-4 transition-all duration-200 focus-within:border-indigo-300 focus-within:shadow-lg focus-within:shadow-indigo-100/50 group-hover:border-slate-300">
            <i className="fas fa-user text-slate-400 text-sm w-5"></i>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-3.5 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="group">
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email</label>
          <div className="flex items-center gap-2 bg-white/90 rounded-2xl border border-slate-200/80 px-4 transition-all duration-200 focus-within:border-indigo-300 focus-within:shadow-lg focus-within:shadow-indigo-100/50 group-hover:border-slate-300">
            <i className="fas fa-envelope text-slate-400 text-sm w-5"></i>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3.5 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="group">
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Password</label>
          <div className="flex items-center gap-2 bg-white/90 rounded-2xl border border-slate-200/80 px-4 transition-all duration-200 focus-within:border-indigo-300 focus-within:shadow-lg focus-within:shadow-indigo-100/50 group-hover:border-slate-300">
            <i className="fas fa-lock text-slate-400 text-sm w-5"></i>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="········"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3.5 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-indigo-600 transition text-sm focus:outline-none"
            >
              <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="group">
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Confirm Password</label>
          <div className="flex items-center gap-2 bg-white/90 rounded-2xl border border-slate-200/80 px-4 transition-all duration-200 focus-within:border-indigo-300 focus-within:shadow-lg focus-within:shadow-indigo-100/50 group-hover:border-slate-300">
            <i className="fas fa-lock text-slate-400 text-sm w-5"></i>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="········"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-3.5 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-400 hover:text-indigo-600 transition text-sm focus:outline-none"
            >
              <i className={`far ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        {/* Terms Checkbox */}
        <label className="flex items-start gap-3 text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-200 transition mt-1"
            disabled={isLoading}
          />
          <span className="text-sm leading-relaxed">
            I agree to the <a href="#" className="text-indigo-700 font-medium hover:underline">terms & conditions</a> and <a href="#" className="text-indigo-700 font-medium hover:underline">privacy policy</a>
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full bg-gradient-to-r from-indigo-800 to-indigo-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group mt-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creating account...
              </>
            ) : (
              <>
                Create account
                <i className="fas fa-arrow-right text-sm transition-transform duration-300 group-hover:translate-x-1.5"></i>
              </>
            )}
          </span>
        </button>
      </form>

      {/* Login Link */}
      <p className="text-xs text-slate-400 text-center mt-6 flex items-center justify-center gap-2 border-t border-slate-200/60 pt-5">
        <span>already have an account?</span>
        <button
          onClick={onSwitchToLogin}
          className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
        >
          sign in
        </button>
      </p>
    </div>
  );
};
