import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import { resendVerification, verifyEmail } from "../Services/authService";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialEmail = queryParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) {
      setError("We could not find your email. Please go back and register again.");
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

    const code = otp.join("");

    if (code.length < 6) {
      setError("Please enter the full 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await verifyEmail({ email, otp: code });
      navigate("/login", {
        state: { message: "Email verified successfully. Please sign in." },
        replace: true,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setResending(true);
    setError("");
    setMessage("");

    try {
      await resendVerification(email);
      setMessage("A fresh verification code has been sent to your email.");
    } catch (err) {
      setError(err?.response?.data?.message || "We could not resend the code right now.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl p-8 md:p-10 dark:border-slate-800 dark:bg-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-600 dark:text-blue-400 mb-5">
          <MailCheck size={24} />
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Verify your email</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            We sent a six-digit code to <span className="font-medium text-slate-900 dark:text-white">{email || "your email"}</span>.
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-3">
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
                className="h-14 w-12 rounded-xl border border-slate-200 bg-white text-center text-xl font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:border-slate-700 dark:bg-slate-900/80 dark:text-white"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify email"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-100/80 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
            Your account will be activated after successful verification.
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="flex items-center gap-2 text-blue-400 transition hover:text-blue-300 disabled:opacity-60"
          >
            <RefreshCw size={16} />
            {resending ? "Sending code..." : "Resend verification code"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-400">
          Back to <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">register</Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
