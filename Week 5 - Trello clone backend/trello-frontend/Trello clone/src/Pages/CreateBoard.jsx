import { useState } from "react";
import {
  ArrowLeft,
  LayoutGrid,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Theme/themeContext";

function CreateBoard() {
  const navigate =
    useNavigate();

  const { theme } =
    useTheme();

  const [title, setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            "http://localhost:5000/api/boards",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  title,
                  description,
                }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          alert(
            data.message
          );

          return;
        }

        alert(
          "Board created 🎉"
        );

        navigate(
          "/dashboard"
        );

      } catch (error) {
        console.log(error);

        alert(
          "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="
      min-h-screen
      bg-slate-50
      dark:bg-slate-950
      flex
      items-center
      justify-center
      px-4
      "
    >
      <div
        className="
        w-full
        max-w-lg
        bg-white
        dark:bg-slate-900
        rounded-3xl
        border
        border-slate-200
        dark:border-slate-800
        shadow-xl
        p-8
        "
      >
        <button
          onClick={() =>
            navigate(
              "/dashboard"
            )
          }
          className="
          flex
          items-center
          gap-2
          text-slate-500
          mb-6
          "
        >
          <ArrowLeft
            size={18}
          />

          Back
        </button>

        <div
          className="
          flex
          items-center
          gap-3
          mb-6
          "
        >
          <div
            className="
            h-12
            w-12
            rounded-2xl
            bg-blue-600
            flex
            items-center
            justify-center
            "
          >
            <LayoutGrid
              className="text-white"
            />
          </div>

          <div>
            <h1
              className="
              text-2xl
              font-bold
              dark:text-white
              "
            >
              Create Board
            </h1>

            <p
              className="
              text-slate-500
              "
            >
              Start organizing
              your project.
            </p>
          </div>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="
          space-y-5
          "
        >
          <div>
            <label
              className="
              block
              mb-2
              font-medium
              dark:text-white
              "
            >
              Board Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Website Redesign"
              className="
              w-full
              p-3
              rounded-xl
              border
              border-slate-300
              dark:border-slate-700
              bg-transparent
              "
              required
            />
          </div>

          <div>
            <label
              className="
              block
              mb-2
              font-medium
              dark:text-white
              "
            >
              Description
            </label>

            <textarea
              rows="4"
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Describe this board..."
              className="
              w-full
              p-3
              rounded-xl
              border
              border-slate-300
              dark:border-slate-700
              bg-transparent
              resize-none
              "
            />
          </div>

          <button
            type="submit"
            disabled={
              loading
            }
            className="
            w-full
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-semibold
            "
          >
            {loading
              ? "Creating..."
              : "Create Board"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBoard;