import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const Login = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      setSuccessMessage('Login successful! Redirecting...');
      // Clear form
      setEmail('');
      setPassword('');
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
    <div className="w-full md:w-[55%] glass-panel-light p-8 lg:p-12 flex flex-col justify-center">
      {/* Form Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-800 tracking-tight">welcome back</h2>
        <p className="text-slate-500 text-sm mt-1.5 font-light">enter your credentials to access dashboard</p>
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
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="group">
          <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email or employee ID</label>
          <div className="flex items-center gap-2 bg-white/90 rounded-2xl border border-slate-200/80 px-4 transition-all duration-200 focus-within:border-indigo-300 focus-within:shadow-lg focus-within:shadow-indigo-100/50 group-hover:border-slate-300">
            <i className="fas fa-envelope text-slate-400 text-sm w-5"></i>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-4 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm"
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
              className="w-full py-4 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm"
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

        {/* Options Row */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-200 transition"
              disabled={isLoading}
            />
            <span>Keep me signed in</span>
          </label>
          <a href="#" className="text-indigo-700 font-medium hover:text-indigo-800 border-b border-dotted border-indigo-200 hover:border-indigo-400 transition">
            Forgot?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full bg-gradient-to-r from-indigo-800 to-indigo-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/60 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group mt-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="flex items-center justify-center gap-3">
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Signing in...
              </>
            ) : (
              <>
                Sign in to dashboard
                <i className="fas fa-arrow-right text-sm transition-transform duration-300 group-hover:translate-x-1.5"></i>
              </>
            )}
          </span>
        </button>

        {/* SSO Hint */}
        <div className="text-center text-xs text-slate-400 pt-3 flex items-center justify-center gap-2">
          <span className="h-px w-6 bg-slate-200"></span>
          <span>saml sso · slack ready</span>
          <span className="h-px w-6 bg-slate-200"></span>
        </div>
      </form>

      {/* Register Link */}
      <p className="text-xs text-slate-400 text-center mt-6 flex items-center justify-center gap-2 border-t border-slate-200/60 pt-5">
        <span>no account?</span>
        <button
          onClick={onSwitchToRegister}
          className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
        >
          create one
        </button>
      </p>
    </div>
  );
};
