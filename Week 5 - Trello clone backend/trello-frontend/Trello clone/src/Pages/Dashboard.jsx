import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  LogOut,
  LayoutGrid,
  Moon,
  Sun,
} from "lucide-react";

import { useTheme } from "../Theme/themeContext";

function Dashboard() {
  const { theme, toggleTheme } =
    useTheme();

  const navigate = useNavigate();

  const [boards, setBoards] =
    useState([]);

  const [user, setUser] =
    useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12)
      return "Good morning";

    if (hour < 17)
      return "Good afternoon";

    return "Good evening";
  };

  useEffect(() => {
    const storedUser =
      JSON.parse(
        localStorage.getItem("user")
      );

    setUser(storedUser);

    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/boards",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await res.json();

      setBoards(
        data.data || data || []
      );
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  return (
    <div
      className="
      min-h-screen
      bg-slate-50
      dark:bg-slate-950
      transition
      "
    >
      {/* Navbar */}

      <nav
        className="
        sticky
        top-0
        z-50
        backdrop-blur-xl
        bg-white/70
        dark:bg-slate-950/70
        border-b
        border-slate-200
        dark:border-slate-800
        "
      >
        <div
          className="
          max-w-7xl
          mx-auto
          px-6
          h-16
          flex
          items-center
          justify-between
          "
        >
          <div
            className="
            flex
            items-center
            gap-3
            "
          >
            <div
              className="
              h-10
              w-10
              rounded-xl
              bg-blue-600
              flex
              items-center
              justify-center
              "
            >
              <LayoutGrid
                className="text-white"
                size={20}
              />
            </div>

            <h1
              className="
              font-bold
              text-xl
              dark:text-white
              "
            >
              TaskFlow
            </h1>
          </div>

          <div
            className="
            flex
            items-center
            gap-3
            "
          >
            <button
              onClick={
                toggleTheme
              }
              className="
              p-2
              rounded-xl
              border
              border-slate-200
              dark:border-slate-700
              "
            >
              {theme ===
              "dark" ? (
                <Sun
                  size={18}
                />
              ) : (
                <Moon
                  size={18}
                />
              )}
            </button>

            <button
              onClick={logout}
              className="
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-xl
              bg-red-500
              text-white
              "
            >
              <LogOut
                size={18}
              />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}

      <div
        className="
        max-w-7xl
        mx-auto
        px-6
        py-10
        "
      >
        {/* Hero */}

        {/* Premium Hero */}

<div
  className="
  relative
  overflow-hidden
  rounded-3xl
  p-8
  md:p-10
  mb-10
  bg-gradient-to-br
  from-blue-600
  via-indigo-600
  to-violet-700
  text-white
  shadow-xl
  "
>
  <div className="relative z-10">
    <p className="text-white/80 text-sm mb-2">
      Workspace Overview
    </p>

    <h2 className="text-4xl md:text-5xl font-bold">
      {getGreeting()}
      {user?.name
        ? `, ${user.name}`
        : ""}
      👋
    </h2>

    <p className="mt-4 text-white/80 max-w-xl">
      Stay focused, track progress,
      and manage all your projects
      from one beautiful workspace.
    </p>

    <button
      className="
      mt-6
      flex
      items-center
      gap-2
      px-6
      py-3
      rounded-2xl
      bg-white
      text-slate-900
      font-semibold
      hover:scale-105
      transition
      "
    onClick={() =>
    navigate("/boards/create")
  }
    >
      <Plus size={18} />
      Create Board
    </button>
  </div>

  <div
    className="
    absolute
    -right-10
    -top-10
    h-52
    w-52
    rounded-full
    bg-white/10
    blur-3xl
    "
  />
</div>

        {/* <div
          className="
          mb-10
          "
        >
          <h2
            className="
            text-4xl
            font-bold
            text-slate-900
            dark:text-white
            "
          >
            {getGreeting()}
            {user?.name
              ? `, ${user.name}`
              : ""}
            👋
          </h2>

          <p
            className="
            mt-3
            text-slate-500
            dark:text-slate-400
            "
          >
            Manage boards,
            organize tasks and
            keep projects moving.
          </p>
        </div> */}

        {/* Stats */}

        <div
  className="
  grid
  md:grid-cols-3
  gap-5
  mb-10
  "
>
  <div
    className="
    bg-white
    dark:bg-slate-900
    rounded-3xl
    p-6
    border
    border-slate-200
    dark:border-slate-800
    shadow-sm
    "
  >
    <p className="text-slate-500">
      Total Boards
    </p>

    <h3
      className="
      text-4xl
      font-bold
      mt-3
      dark:text-white
      "
    >
      {boards.length}
    </h3>
  </div>

  <div
    className="
    bg-white
    dark:bg-slate-900
    rounded-3xl
    p-6
    border
    border-slate-200
    dark:border-slate-800
    shadow-sm
    "
  >
    <p className="text-slate-500">
      Workspace
    </p>

    <h3
      className="
      text-xl
      font-semibold
      mt-3
      dark:text-white
      "
    >
      Personal
    </h3>
  </div>

  <div
    className="
    bg-white
    dark:bg-slate-900
    rounded-3xl
    p-6
    border
    border-slate-200
    dark:border-slate-800
    shadow-sm
    "
  >
    <p className="text-slate-500">
      Status
    </p>

    <h3
      className="
      text-xl
      font-semibold
      mt-3
      text-emerald-500
      "
    >
      Active
    </h3>
  </div>
</div>

        {/* <div
          className="
          grid
          md:grid-cols-3
          gap-5
          mb-10
          "
        >
          <div
            className="
            bg-white
            dark:bg-slate-900
            rounded-3xl
            p-6
            border
            border-slate-200
            dark:border-slate-800
            "
          >
            <p
              className="
              text-slate-500
              "
            >
              Total Boards
            </p>

            <h3
              className="
              text-3xl
              font-bold
              dark:text-white
              mt-2
              "
            >
              {boards.length}
            </h3>
          </div>

          <div
            className="
            bg-white
            dark:bg-slate-900
            rounded-3xl
            p-6
            border
            border-slate-200
            dark:border-slate-800
            "
          >
            <p>
              Workspace
            </p>

            <h3
              className="
              text-xl
              font-semibold
              mt-2
              dark:text-white
              "
            >
              Personal
            </h3>
          </div>

          <div
            className="
            bg-white
            dark:bg-slate-900
            rounded-3xl
            p-6
            border
            border-slate-200
            dark:border-slate-800
            "
          >
            <p>
              Status
            </p>

            <h3
              className="
              text-xl
              font-semibold
              mt-2
              text-green-500
              "
            >
              Active
            </h3>
          </div>
        </div> */}

        {/* Boards Header */}

        <div
          className="
          flex
          justify-between
          items-center
          mb-6
          "
        >
          <h3
            className="
            text-2xl
            font-bold
            dark:text-white
            "
          >
            Boards
          </h3>

          <button
            className="
            flex
            items-center
            gap-2
            px-5
            py-3
            rounded-2xl
            // bg-blue-600
            // hover:bg-blue-700
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            shadow-lg
            shadow-blue-500/20
            hover:scale-105
            transition-all
            text-white
            "

              onClick={() =>
    navigate("/boards/create")
  }
          >
            <Plus
              size={18}
            />
            Create Board
          </button>
        </div>

        {/* Empty State */}

        {boards.length === 0 ? (
            <div
  className="
  bg-white
  dark:bg-slate-900
  rounded-3xl
  border
  border-dashed
  border-slate-300
  dark:border-slate-700
  p-20
  text-center
  "
>
  <div className="text-6xl mb-5">
    📋
  </div>

  <h3
    className="
    text-2xl
    font-bold
    dark:text-white
    "
  >
    No boards yet
  </h3>

  <p
    className="
    mt-3
    text-slate-500
    max-w-md
    mx-auto
    "
  >
    Create your first board
    and start organizing your
    projects like a civilized
    software engineer instead
    of storing plans in random
    notebooks and forgotten tabs.
  </p>

  <button
    className="
    mt-6
    px-6
    py-3
    rounded-2xl
    bg-blue-600
    text-white
    hover:bg-blue-700
    "
      onClick={() =>
    navigate("/boards/create")
  }
  >
    Create Board
  </button>
</div>
        //   <div
        //     className="
        //     bg-white
        //     dark:bg-slate-900
        //     rounded-3xl
        //     border
        //     border-dashed
        //     border-slate-300
        //     dark:border-slate-700
        //     p-20
        //     text-center
        //     "
        //   >
        //     <h3
        //       className="
        //       text-xl
        //       font-semibold
        //       dark:text-white
        //       "
        //     >
        //       No boards yet
        //     </h3>

        //     <p
        //       className="
        //       mt-3
        //       text-slate-500
        //       "
        //     >
        //       Create your
        //       first board to
        //       get started.
        //     </p>
        //   </div>
        ) : (
          <div
            className="
            grid
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
            "
          >
            {boards.map(
              (board) => (
                <div
                  key={
                    board._id
                  }
                  onClick={() =>
                    navigate(
                      `/boards/${board._id}`
                    )
                  }
                //   className="
                //   cursor-pointer
                //   bg-white
                //   dark:bg-slate-900
                //   rounded-3xl
                //   p-6
                //   border
                //   border-slate-200
                //   dark:border-slate-800
                //   hover:-translate-y-1
                //   transition
                //   "

                className="
                    group
                    cursor-pointer
                    bg-white
                    dark:bg-slate-900
                    rounded-3xl
                    p-6
                    border
                    border-slate-200
                    dark:border-slate-800
                    shadow-sm
                    hover:shadow-xl
                    hover:shadow-blue-500/10
                    hover:border-blue-500/30
                    hover:-translate-y-2
                    transition-all
                    duration-300
                    "
                >
                    <div className="flex items-start justify-between">
                        <h3
                            className="
                            text-xl
                            font-semibold
                            dark:text-white
                            "
                        >
                            {board.title}
                        </h3>

                        <div
                            className="
                            h-3
                            w-3
                            rounded-full
                            bg-emerald-500
                            "
                        />
                        </div>

                        <p
                        className="
                        mt-3
                        text-slate-500
                        line-clamp-2
                        "
                        >
                        {board.description ||
                            "No description provided"}
                        </p>

                        <div
                        className="
                        mt-6
                        pt-4
                        border-t
                        border-slate-200
                        dark:border-slate-800
                        flex
                        justify-between
                        text-sm
                        text-slate-500
                        "
                        >
                        <span>Board</span>

                        <span
                            className="
                            group-hover:text-blue-500
                            transition
                            "
                        >
                            Open →
                        </span>
                        </div>
                  {/* <h3
                    className="
                    text-xl
                    font-semibold
                    dark:text-white
                    "
                  >
                    {
                      board.title
                    }
                  </h3>

                  <p
                    className="
                    mt-3
                    text-slate-500
                    "
                  >
                    {
                      board.description
                    }
                  </p> */}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;