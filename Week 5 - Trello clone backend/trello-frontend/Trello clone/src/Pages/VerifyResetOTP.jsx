import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../Theme/themeContext.jsx";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { verifyResetOTP } from "../Services/authService";

function VerifyResetOTP() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      setError("No email found. Please request a reset code again.");
    }
  }, [email]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);
    setError("");

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const previousOtp = [...otp];
      previousOtp[index - 1] = "";
      setOtp(previousOtp);
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setError("No email found. Please request a reset code again.");
      return;
    }

    const code = otp.join("");
    if (code.length < 6) {
      setError("Enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyResetOTP({ email, otp: code });
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid code. Please try again.");
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

      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-xl p-8 dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 mb-6">
          <ShieldCheck size={28} />
        </div>

        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Verify reset code</h1>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Enter the code we sent to <span className="font-medium text-slate-900 dark:text-white">{email}</span>.
        </p>

        {error && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-6 gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 text-center text-xl font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify code"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
          <p>Didn’t get the message? Try again in a minute or request a new code.</p>
          <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            Request a new code
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyResetOTP;
