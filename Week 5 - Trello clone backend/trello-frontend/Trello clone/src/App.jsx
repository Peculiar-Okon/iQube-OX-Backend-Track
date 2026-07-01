import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Board from "./Pages/Board";
import CreateBoard from "./Pages/CreateBoard";
import VerifyEmail from "./Pages/VerifyEmail";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyResetOTP from "./Pages/VerifyResetOTP";
import ResetPassword from "./Pages/ResetPassword";

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
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-reset-otp"
          element={<VerifyResetOTP />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
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

