import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Users from "./Pages/Users";

function App() {
  return (
    <BrowserRouter>

      <div className="min-h-screen bg-gray-100">

        {/* NAVBAR */}
        <nav className="bg-black text-white p-4 flex gap-4">

          <Link to="/">Home</Link>

          <Link to="/users">Users</Link>

          <Link to="/about">About</Link>

        </nav>

        {/* ROUTES */}
        <div className="p-6">

          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/users" element={<Users />} />

            <Route path="/about" element={<About />} />

          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;