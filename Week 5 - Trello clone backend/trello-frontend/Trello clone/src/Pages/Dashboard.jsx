import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, LogOut, Moon, Plus, Sparkles, Sun } from "lucide-react";

import { useTheme } from "../Theme/themeContext";

function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [user, setUser] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/boards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setBoards(data.data || data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.2),_transparent_24%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)] dark:text-slate-100">
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
              <LayoutGrid className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold">TaskFlow</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your calm command center</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-2xl border border-slate-200 bg-white/80 p-2.5 text-slate-700 transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-[0_25px_80px_-24px_rgba(59,130,246,0.7)] sm:p-8 lg:p-10">
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur">
                <Sparkles size={16} />
                Workspace overview
              </div>

              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">
                {getGreeting()}
                {user?.name ? `, ${user.name}` : ""}
                👋
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
                Keep your projects moving with a polished dashboard for boards, priorities, and momentum.
              </p>

              <button
                onClick={() => navigate("/boards/create")}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Plus size={18} />
                Create Board
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur">
              <p className="text-sm font-medium text-white/80">This week at a glance</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-slate-950/20 p-3 text-sm text-white/90">
                  <div className="font-semibold">{boards.length} active board{boards.length === 1 ? "" : "s"}</div>
                  <div className="mt-1 text-white/70">Ready for your next big move</div>
                </div>
                <div className="rounded-2xl bg-slate-950/20 p-3 text-sm text-white/90">
                  <div className="font-semibold">Focus mode</div>
                  <div className="mt-1 text-white/70">A calmer place to plan and ship</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-8 left-10 h-28 w-28 rounded-full bg-violet-400/20 blur-2xl" />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total boards</p>
            <h3 className="mt-3 text-3xl font-semibold dark:text-white">{boards.length}</h3>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-sm text-slate-500 dark:text-slate-400">Workspace</p>
            <h3 className="mt-3 text-xl font-semibold dark:text-white">Personal</h3>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
            <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
            <h3 className="mt-3 text-xl font-semibold text-emerald-500">Active</h3>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200/80 bg-white/80 p-4 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.2)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold dark:text-white">Boards</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Organize your work in beautiful, focused spaces.</p>
            </div>

            <button
              onClick={() => navigate("/boards/create")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
            >
              <Plus size={18} />
              Create Board
            </button>
          </div>

          {boards.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/80 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50 sm:p-12">
              <div className="mb-5 text-5xl">📋</div>
              <h4 className="text-xl font-semibold dark:text-white">No boards yet</h4>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Create your first board to turn ideas into action and keep everything easy to follow.
              </p>
              <button
                onClick={() => navigate("/boards/create")}
                className="mt-6 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Create your first board
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {boards.map((board) => (
                <div
                  key={board._id}
                  onClick={() => navigate(`/boards/${board._id}`)}
                  className="group cursor-pointer rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold dark:text-white">{board.title}</h4>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {board.description || "No description provided"}
                      </p>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <span>Board</span>
                    <span className="font-medium transition group-hover:text-blue-500">Open →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;