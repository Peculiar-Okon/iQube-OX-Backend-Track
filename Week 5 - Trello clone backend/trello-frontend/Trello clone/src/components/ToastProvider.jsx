import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const toneStyles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-300",
  error: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/60 dark:text-rose-300",
  info: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/60 dark:text-sky-300",
};

const toneIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);

    if (duration > 0) {
      window.setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[120] flex w-[min(92vw,24rem)] flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = toneIcons[toast.type] || Info;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-2xl border p-4 shadow-xl backdrop-blur ${toneStyles[toast.type] || toneStyles.info}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-white/70 p-1 dark:bg-slate-900/40">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  {toast.title ? <p className="font-semibold">{toast.title}</p> : null}
                  {toast.message ? <p className="mt-1 text-sm opacity-90">{toast.message}</p> : null}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="rounded-full p-1 transition hover:bg-black/10 dark:hover:bg-white/10"
                  aria-label="Dismiss notification"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
