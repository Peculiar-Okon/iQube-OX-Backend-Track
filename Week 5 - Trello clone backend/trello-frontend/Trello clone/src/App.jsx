import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Board from "./pages/Board";
import CreateBoard from "./pages/CreateBoard";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/boards/:boardId"
          element={<Board />}
        />

        <Route
          path="/boards/create"
          element={<CreateBoard />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;

