import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../Theme/themeContext.jsx";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { resetPassword } from "../Services/authService";

function ResetPassword() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      setError("No email found. Please restart the password reset flow.");
    }
  }, [email]);

  const getStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength(formData.password);
  const getBarColor = () => {
    if (strength <= 1) return "bg-rose-500";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-400";
    return "bg-emerald-500";
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email) {
      setError("No email found. Please restart the password reset flow.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must be 8+ chars, include uppercase, lowercase, number, and symbol.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, newPassword: formData.password });
      navigate("/login", {
        state: { message: "Password reset successfully. Please sign in." },
        replace: true,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to reset password. Please try again.");
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
          <ShieldCheck size={28} />
        </div>

        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Choose a new password</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Set a strong password for <span className="font-medium text-slate-900 dark:text-white">{email || "your account"}</span>.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 dark:text-slate-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-3 flex gap-1 max-w-[140px]">
                {[1, 2, 3, 4].map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full ${strength > index ? getBarColor() : "bg-slate-200 dark:bg-slate-700"}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-500 dark:text-slate-300"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.confirmPassword && (
              <p className={`mt-2 text-xs ${formData.password === formData.confirmPassword ? "text-emerald-500" : "text-rose-500"}`}>
                {formData.password === formData.confirmPassword ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Resetting password..." : "Reset password"}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Back to <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
