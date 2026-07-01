import { useState } from "react";
import { useTheme } from "../Theme/themeContext.jsx";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginUser } from "../Services/authService";

function Login() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const successMessage = location.state?.message;


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await loginUser(formData);

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
      from-slate-50
      via-blue-50
      to-indigo-100
      dark:from-slate-900
      dark:via-slate-900
      dark:to-slate-950
      flex items-center justify-center
      px-4
      relative
    ">

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="
          absolute top-6 right-6
          px-4 py-2
          rounded-xl
          bg-slate-200 dark:bg-slate-800
          text-slate-700 dark:text-slate-200
          text-sm font-medium
        "
      >
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>

      {/* Card */}
      <div className="
        w-full max-w-md
        bg-white dark:bg-slate-900
        rounded-3xl shadow-xl
        border border-slate-100 dark:border-slate-800
        p-8
      ">

        {successMessage && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            {successMessage}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Sign in to continue your workspace
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="
                w-full p-3 rounded-xl
                border border-slate-200 dark:border-slate-700
                bg-white dark:bg-slate-800
                text-slate-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="
                w-full p-3 rounded-xl
                border border-slate-200 dark:border-slate-700
                bg-white dark:bg-slate-800
                text-slate-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

          <div className="text-right text-sm text-slate-500 dark:text-slate-400">
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-blue-600 hover:bg-blue-700
              text-white py-3 rounded-xl
              font-semibold transition
              disabled:opacity-50
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="
          mt-6 text-center
          text-sm text-slate-500 dark:text-slate-400
        ">
          Don't have an account?
          <Link to="/register">
          <span className="text-blue-600 ml-1 cursor-pointer font-medium">
            Sign up
          </span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;