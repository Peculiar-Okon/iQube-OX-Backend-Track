import { useState } from "react";
import { useTheme } from "../Theme/themeContext.jsx";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


function Register() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const [showPassword, setShowPassword] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);

const getStrength = (password) => {
  let score = 0;

  if (!password) return 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score; // 0 - 5
};

const strength = getStrength(formData.password);

const getBarColor = (index) => {
  if (strength <= 1) return "bg-red-500";
  if (strength === 2) return "bg-orange-500";
  if (strength === 3) return "bg-yellow-400";
  if (strength >= 4) return "bg-green-500";

  return "bg-slate-700";
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

  if (!passwordRegex.test(formData.password)) {
    alert("Password is too weak");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }
    console.log(formData);

      try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();

    console.log("SERVER RESPONSE:", data);

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Account created successfully 🎉");
    navigate("/login");

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
  };

  return (
    <div
      className="
      min-h-screen
      bg-gradient-to-br
      from-slate-50
      via-blue-50
      to-indigo-100
      dark:from-slate-900
      dark:via-slate-900
      dark:to-slate-950
      flex
      items-center
      justify-center
      px-4
      relative
      "
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="
        absolute top-6 right-6
        px-4 py-2
        rounded-xl
        bg-slate-200
        dark:bg-slate-800
        text-slate-700
        dark:text-slate-200
        text-sm
        font-medium
        transition
        "
      >
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>

      {/* Card */}
      <div
        className="
        w-full
        max-w-md
        bg-white
        dark:bg-slate-900
        rounded-3xl
        shadow-xl
        border
        border-slate-100
        dark:border-slate-800
        p-8
        "
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="
            text-3xl
            font-bold
            text-slate-900
            dark:text-white
            "
          >
            Create account
          </h1>

          <p
            className="
            text-slate-500
            dark:text-slate-400
            mt-2
            "
          >
            Organize projects, tasks and ideas.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              className="
              block
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
              mb-2
              "
            >
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Pearl"
              className="
              w-full
              p-3
              rounded-xl
              border
              border-slate-200
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              text-slate-900
              dark:text-white
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              "
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="
              block
              text-sm
              font-medium
              text-slate-700
              dark:text-slate-300
              mb-2
              "
            >
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="
              w-full
              p-3
              rounded-xl
              border
              border-slate-200
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              text-slate-900
              dark:text-white
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              "
            />
          </div>

          {/* Password */}
<div>
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
    Password
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="••••••••"
      className="
      w-full p-3 pr-10 rounded-xl
      border border-slate-200 dark:border-slate-700
      bg-white dark:bg-slate-800
      text-slate-900 dark:text-white
      focus:outline-none focus:ring-2 focus:ring-blue-500
      "
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-3 text-slate-500"
    >
{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  {/* PASSWORD STRENGTH BAR */}
  {formData.password && (
    <div className="flex gap-1 mt-3 max-w-[120px]">
      {[1, 2, 3, 4].map((_, i) => (
        <div
          key={i}
          className={`
            h-2 flex-1 rounded
            ${strength > i ? getBarColor(i) : "bg-slate-200 dark:bg-slate-700"}
          `}
        />
      ))}
    </div>
  )}
</div>

<div>
  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
    Confirm Password
  </label>

  <div className="relative">
    <input
      type={showConfirm ? "text" : "password"}
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      placeholder="••••••••"
      className="
      w-full p-3 pr-10 rounded-xl
      border border-slate-200 dark:border-slate-700
      bg-white dark:bg-slate-800
      text-slate-900 dark:text-white
      focus:outline-none focus:ring-2 focus:ring-blue-500
      "
    />

    <button
      type="button"
      onClick={() => setShowConfirm(!showConfirm)}
      className="absolute right-3 top-3 text-slate-500"
    >
{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  {/* MATCH VALIDATION */}
  {formData.confirmPassword && (
    <p
      className={`text-xs mt-2 ${
        formData.password === formData.confirmPassword
          ? "text-green-500"
          : "text-red-500"
      }`}
    >
      {formData.password === formData.confirmPassword
        ? "Passwords match"
        : "Passwords do not match"}
    </p>
  )}
</div>

          {/* Button */}
          <button
            type="submit"
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-3
            rounded-xl
            font-semibold
            transition
            "
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        {/* link to login page */}
        
          <div
            className="
          mt-6
          text-center
          text-sm
          text-slate-500
          dark:text-slate-400
          "
        >
          Already have an account?
          <Link to="/login">
          <span
            className="
            text-blue-600
            ml-1
            cursor-pointer
            font-medium
            "
          >
            Sign In
          </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
