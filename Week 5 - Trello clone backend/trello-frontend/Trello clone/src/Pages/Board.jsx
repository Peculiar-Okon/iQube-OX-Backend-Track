import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  GripVertical,
  LayoutGrid,
  MoonStar,
  Plus,
  Sparkles,
  SunMedium,
  Trash2,
} from "lucide-react";
import { useTheme } from "../Theme/themeContext";

function Board() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const [newListTitle, setNewListTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalListId, setModalListId] = useState(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", priority: "Medium", dueDate: "", tags: "" });

  const token = localStorage.getItem("token");

  const api = (path, opts = {}) =>
    fetch(`http://localhost:5000/api${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": opts.body ? "application/json" : "application/json",
      },
      ...opts,
    });

  const getBoard = async () => {
    try {
      const res = await api(`/boards/${boardId}`);
      const data = await res.json();
      setBoard(data.data || data);
    } catch (error) {
      console.error(error);
    }
  };

  const getLists = async () => {
    try {
      const res = await api(`/lists/${boardId}`);
      const data = await res.json();
      const listsData = data.data || [];
      setLists(listsData);
      listsData.forEach((list) => fetchTasksForList(list._id));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasksForList = async (listId) => {
    try {
      const res = await api(`/tasks/${listId}`);
      const data = await res.json();
      setTasksByList((prev) => ({ ...prev, [listId]: data.data || [] }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!boardId || !token) {
      setLoading(false);
      return;
    }

    const loadBoardData = async () => {
      setLoading(true);
      await Promise.all([getBoard(), getLists()]);
      setLoading(false);
    };

    loadBoardData();
  }, [boardId, token]);

  const createList = async () => {
    if (!newListTitle.trim()) return;

    try {
      await api(`/lists`, {
        method: "POST",
        body: JSON.stringify({ title: newListTitle.trim(), boardId }),
      });
      setNewListTitle("");
      getLists();
    } catch (error) {
      console.error(error);
    }
  };

  const openTaskModal = (listId) => {
    setModalListId(listId);
    setTaskForm({ title: "", description: "", priority: "Medium", dueDate: "", tags: "" });
    setModalOpen(true);
  };

  const closeTaskModal = () => {
    setModalOpen(false);
    setModalListId(null);
  };

  const addTask = async () => {
    if (!taskForm.title.trim() || !modalListId) return;

    const payload = {
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
      listId: modalListId,
    };

    try {
      const tempTask = { _id: `tmp-${Date.now()}`, ...payload };
      setTasksByList((prev) => ({
        ...prev,
        [modalListId]: [...(prev[modalListId] || []), tempTask],
      }));

      const res = await api(`/tasks`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      setTasksByList((prev) => ({
        ...prev,
        [modalListId]: prev[modalListId].map((task) =>
          task._id === tempTask._id ? data.data : task
        ),
      }));
      closeTaskModal();
    } catch (error) {
      console.error(error);
    }
  };

  const editBoard = async () => {
    const title = prompt("Board title:", board?.title || "");
    if (title === null || !title.trim()) return;

    const description = prompt("Board description:", board?.description || "");
    if (description === null) return;

    try {
      const res = await api(`/boards/${boardId}`, {
        method: "PUT",
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });
      const data = await res.json();
      setBoard(data.data || data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBoard = async () => {
    if (!confirm("Delete this board? This will remove all lists and tasks.")) return;

    try {
      await api(`/boards/${boardId}`, {
        method: "DELETE",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const editList = async (list) => {
    const title = prompt("List title:", list.title);
    if (title === null || !title.trim()) return;

    const trimmedTitle = title.trim();
    if (trimmedTitle === list.title) return;

    try {
      const res = await api(`/lists/${list._id}`, {
        method: "PUT",
        body: JSON.stringify({ title: trimmedTitle }),
      });
      const data = await res.json();
      setLists((prev) => prev.map((item) => (item._id === list._id ? data.data || item : item)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteList = async (listId) => {
    if (!confirm("Delete this list? Tasks inside it will also be removed.")) return;

    try {
      await api(`/lists/${listId}`, {
        method: "DELETE",
      });
      setLists((prev) => prev.filter((list) => list._id !== listId));
      setTasksByList((prev) => {
        const next = { ...prev };
        delete next[listId];
        return next;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const editTask = async (task, listId) => {
    const title = prompt("Task title:", task.title);
    if (title === null || !title.trim()) return;

    const description = prompt("Task description:", task.description || "");
    if (description === null) return;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (trimmedTitle === task.title && trimmedDescription === (task.description || "")) return;

    try {
      const res = await api(`/tasks/${task._id}`, {
        method: "PUT",
        body: JSON.stringify({ title: trimmedTitle, description: trimmedDescription }),
      });
      const data = await res.json();
      setTasksByList((prev) => ({
        ...prev,
        [listId]: prev[listId].map((item) =>
          item._id === task._id ? data.data || item : item
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId, listId) => {
    if (!confirm("Delete this task?")) return;

    try {
      await api(`/tasks/${taskId}`, {
        method: "DELETE",
      });
      setTasksByList((prev) => ({
        ...prev,
        [listId]: (prev[listId] || []).filter((task) => task._id !== taskId),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.22),_transparent_24%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)]">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ArrowLeft size={18} /> Back
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-blue-300">Board Workspace</p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{board?.title || "Loading board..."}</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <LayoutGrid size={16} /> {lists.length} lists
              </div>
              <button
                type="button"
                onClick={editBoard}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label="Edit board"
                title="Edit board"
              >
                <Edit size={18} />
              </button>
              <button
                type="button"
                onClick={deleteBoard}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-red-500 transition hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-900/20"
                aria-label="Delete board"
                title="Delete board"
              >
                <Trash2 size={18} />
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label="Toggle theme"
              >
                {isDark ? <SunMedium size={18} /> : <MoonStar size={18} />}
              </button>
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1.6fr_0.9fr]">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-6 text-white shadow-lg">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/85"><Sparkles size={14} /> Workspace overview</div>
            <h2 className="mt-5 text-3xl font-semibold">{board?.title || "Board overview"}</h2>
            <p className="mt-3 max-w-2xl text-sm text-white/80">{board?.description || "Organize your board with lists and tasks that keep work moving forward."}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950/80">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Summary</div>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-3xl bg-slate-100 px-4 py-5 dark:bg-slate-800">
              <div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Lists</div>
                <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{lists.length}</div>
              </div>
              <div className="rounded-2xl bg-blue-600 px-3 py-2 text-white">Live</div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white/90 p-5 shadow-sm dark:bg-slate-950/80">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Board lanes</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add lists and tasks to keep your board moving.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="New list title"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-400 dark:focus:bg-slate-800 sm:min-w-[240px]"
              />
              <button
                onClick={createList}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
              >
                <Plus size={18} /> Create list
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-14 text-center text-slate-500">Loading your board...</div>
          ) : lists.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-8 py-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
              <div className="text-5xl">📋</div>
              <h4 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">No lists yet</h4>
              <p className="mt-2 text-sm">Create a list to start organizing your tasks.</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {lists.map((list) => (
                <article key={list._id} className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/95">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"><GripVertical size={16} /></div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{list.title}</h4>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{(tasksByList[list._id] || []).length} task{(tasksByList[list._id] || []).length === 1 ? "" : "s"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                      <button title="Edit list" onClick={() => editList(list)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><Edit size={16} /></button>
                      <button title="Delete list" onClick={() => deleteList(list._id)} className="rounded-xl p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {(tasksByList[list._id] || []).length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">No tasks yet. Add one to get started.</div>
                    ) : (
                      (tasksByList[list._id] || []).map((task) => (
                        <div key={task._id} className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/70">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{task.title}</p>
                            {task.description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{task.description}</p> : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => editTask(task, list._id)} className="rounded-2xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><Edit size={14} /></button>
                            <button onClick={() => deleteTask(task._id, list._id)} className="rounded-2xl p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <button onClick={() => openTaskModal(list._id)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                    <Plus size={16} /> Add task
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeTaskModal} />
            <div className="relative z-10 w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-blue-600">New Task</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Add a task</h2>
                </div>
                <button onClick={closeTaskModal} className="rounded-2xl border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Close</button>
              </div>

              <div className="mt-6 grid gap-4">
                <input value={taskForm.title} onChange={(e) => setTaskForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Task title" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                <textarea value={taskForm.description} onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description (optional)" rows={4} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                <div className="grid gap-3 md:grid-cols-2">
                  <select value={taskForm.priority} onChange={(e) => setTaskForm((prev) => ({ ...prev, priority: e.target.value }))} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <input type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
                </div>
                <input value={taskForm.tags} onChange={(e) => setTaskForm((prev) => ({ ...prev, tags: e.target.value }))} placeholder="Tags (comma separated)" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button onClick={closeTaskModal} className="rounded-3xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
                <button onClick={addTask} className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">Create Task</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Board;
