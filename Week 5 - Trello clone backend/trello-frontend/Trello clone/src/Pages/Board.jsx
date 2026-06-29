import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  Plus,
} from "lucide-react";

function Board() {
  const { boardId } =
    useParams();

  const navigate =
    useNavigate();

  const [board, setBoard] =
    useState(null);

  const [lists, setLists] =
    useState([]);

  useEffect(() => {
    getBoard();
    getLists();
  }, []);

  const token =
    localStorage.getItem(
      "token"
    );

  const getBoard =
    async () => {
      try {
        const res =
          await fetch(
            `http://localhost:5000/api/boards/${boardId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        setBoard(
          data.data || data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const getLists =
    async () => {
      try {
        const res =
          await fetch(
            `http://localhost:5000/api/lists/board/${boardId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await res.json();

        setLists(
          data.data || []
        );
      } catch (error) {
        console.log(error);
      }
    };

return (
  <div
    className="
    min-h-screen
    bg-slate-100
    dark:bg-slate-950
    "
  >
    <div
      className="
      max-w-[1600px]
      mx-auto
      p-8
      "
    >
      {/* Top Navigation */}

      <div
        className="
        flex
        items-center
        justify-between
        mb-6
        "
      >
        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="
          flex
          items-center
          gap-2
          px-4
          py-2
          rounded-2xl
          bg-white
          dark:bg-slate-900
          border
          border-slate-200
          dark:border-slate-800
          hover:shadow-md
          transition
          "
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          className="
          flex
          items-center
          gap-2
          px-5
          py-3
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          text-white
          shadow-lg
          shadow-blue-500/20
          hover:scale-105
          transition-all
          "
        >
          <Plus size={18} />
          Add List
        </button>
      </div>

      {/* Hero */}

      <div
        className="
        relative
        overflow-hidden
        rounded-3xl
        p-8
        md:p-10
        mb-10
        bg-gradient-to-r
        from-blue-600
        via-indigo-600
        to-violet-700
        text-white
        shadow-xl
        "
      >
        <div className="relative z-10">
          <p className="text-white/80 text-sm">
            Project Board
          </p>

          <h1
            className="
            text-4xl
            md:text-5xl
            font-bold
            mt-2
            "
          >
            {board?.title}
          </h1>

          <p
            className="
            mt-4
            text-white/80
            max-w-2xl
            "
          >
            {board?.description ||
              "Organize tasks, track progress and collaborate efficiently."}
          </p>
        </div>

        <div
          className="
          absolute
          -top-10
          -right-10
          w-52
          h-52
          rounded-full
          bg-white/10
          blur-3xl
          "
        />
      </div>

      {/* Empty State */}

      {lists.length === 0 ? (
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

          <h2
            className="
            text-2xl
            font-bold
            dark:text-white
            "
          >
            No Lists Yet
          </h2>

          <p
            className="
            mt-3
            text-slate-500
            "
          >
            Create your first list
            and start organizing
            your workflow.
          </p>

          <button
            className="
            mt-6
            px-6
            py-3
            rounded-2xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            "
          >
            Create List
          </button>
        </div>
      ) : (
        <div
          className="
          flex
          gap-6
          overflow-x-auto
          pb-5
          "
        >
          {lists.map((list) => (
            <div
              key={list._id}
              className="
              min-w-[340px]
              max-w-[340px]
              bg-white
              dark:bg-slate-900
              rounded-3xl
              p-5
              border
              border-slate-200
              dark:border-slate-800
              shadow-sm
              "
            >
              {/* List Header */}

              <div
                className="
                flex
                justify-between
                items-center
                mb-5
                "
              >
                <h2
                  className="
                  font-bold
                  text-lg
                  dark:text-white
                  "
                >
                  {list.title}
                </h2>

                <span
                  className="
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-medium
                  bg-slate-100
                  dark:bg-slate-800
                  dark:text-white
                  "
                >
                  0 Tasks
                </span>
              </div>

              {/* Tasks */}

              <div
                className="
                space-y-3
                min-h-[200px]
                "
              >
                {/* Task cards go here */}
              </div>

              {/* Add Task */}

              <button
                className="
                mt-4
                w-full
                py-3
                rounded-2xl
                border
                border-dashed
                border-slate-300
                dark:border-slate-700
                hover:border-blue-500
                hover:text-blue-500
                transition
                "
              >
                + Add Task
              </button>
            </div>
          ))}

          {/* Create List Card */}

          <button
            className="
            min-w-[340px]
            max-w-[340px]
            rounded-3xl
            border-2
            border-dashed
            border-slate-300
            dark:border-slate-700
            bg-white/50
            dark:bg-slate-900/50
            flex
            items-center
            justify-center
            text-slate-500
            font-semibold
            hover:border-blue-500
            hover:text-blue-500
            transition
            "
          >
            + Create New List
          </button>
        </div>
      )}
    </div>
  </div>
);



//   return (
//     <div
//       className="
//       min-h-screen
//       bg-slate-100
//       dark:bg-slate-950
//       "
//     >
//       <div
//         className="
//         p-8
//         "
//       >
//         {/* HEADER */}

//         <div
//           className="
//           flex
//           justify-between
//           items-center
//           mb-8
//           "
//         >
//           <div
//             className="
//             flex
//             items-center
//             gap-4
//             "
//           >
//             <button
//               onClick={() =>
//                 navigate(
//                   "/dashboard"
//                 )
//               }
//               className="
//               p-2
//               rounded-xl
//               bg-white
//               dark:bg-slate-900
//               "
//             >
//               <ArrowLeft />
//             </button>

//             <div>
//               <h1
//                 className="
//                 text-3xl
//                 font-bold
//                 dark:text-white
//                 "
//               >
//                 {board?.title}
//               </h1>

//               <p
//                 className="
//                 text-slate-500
//                 "
//               >
//                 {
//                   board?.description
//                 }
//               </p>
//             </div>
//           </div>

//           <button
//             className="
//             flex
//             items-center
//             gap-2
//             px-5
//             py-3
//             rounded-xl
//             bg-blue-600
//             text-white
//             "
//           >
//             <Plus size={18} />
//             Add List
//           </button>
//         </div>

//         {/* LISTS */}

//         <div
//           className="
//           flex
//           gap-6
//           overflow-x-auto
//           pb-5
//           "
//         >
//           {lists.map((list) => (
//             <div
//               key={list._id}
//               className="
//               min-w-[320px]
//               bg-white
//               dark:bg-slate-900
//               rounded-3xl
//               p-5
//               shadow-sm
//               "
//             >
//               <div
//                 className="
//                 flex
//                 justify-between
//                 items-center
//                 mb-5
//                 "
//               >
//                 <h2
//                   className="
//                   font-bold
//                   text-lg
//                   dark:text-white
//                   "
//                 >
//                   {list.title}
//                 </h2>
//               </div>

//               <div
//                 className="
//                 space-y-3
//                 "
//               >
//                 {/* tasks go here */}
//               </div>

//               <button
//                 className="
//                 mt-4
//                 w-full
//                 py-2
//                 rounded-xl
//                 border
//                 border-dashed
//                 border-slate-300
//                 dark:border-slate-700
//                 "
//               >
//                 + Add Task
//               </button>
//             </div>
//           ))}

//           {/* Create List Card */}

//           <button
//             className="
//             min-w-[320px]
//             h-[120px]
//             rounded-3xl
//             border-2
//             border-dashed
//             border-slate-300
//             dark:border-slate-700
//             text-slate-500
//             "
//           >
//             + Create New List
//           </button>
//         </div>
//       </div>
//     </div>
//   );
}

export default Board;