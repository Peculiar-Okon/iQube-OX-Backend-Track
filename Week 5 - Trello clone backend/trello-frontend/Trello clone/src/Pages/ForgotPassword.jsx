import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../Theme/themeContext.jsx";
import { Mail, ArrowRight } from "lucide-react";
import { forgotPassword } from "../Services/authService";

function ForgotPassword() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email });
      navigate(`/verify-reset-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100 flex items-center justify-center px-4 py-10">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>

      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-xl p-8 dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 mb-6">
          <Mail size={28} />
        </div>

        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Forgot password?</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Enter your email and we'll send a reset code so you can choose a new password.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Sending code..." : "Send reset code"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
