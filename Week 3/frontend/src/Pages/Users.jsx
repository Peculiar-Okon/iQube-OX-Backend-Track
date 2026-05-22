import { useState } from "react";

function Users() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);

  const API = "http://localhost:5000/api/users";

  // CREATE USER
  const createUser = async () => {
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          name,
          email
        })
      });

      const data = await res.json();

      console.log(data);

      // OPTIONAL:
      // Clear inputs after creating user
      setName("");
      setEmail("");

    } catch (error) {
      console.log(error);
    }
  };

  // GET USERS

  const getUsers = async () => {
  try {
    const res = await fetch(API);
    const data = await res.json();

    console.log("API RESPONSE:", data);

    // FORCE ARRAY SAFETY
    setUsers(Array.isArray(data) ? data : []);

  } catch (error) {
    console.log(error);
  }
};

//   const getUsers = async () => {
//     try {
//       const res = await fetch(API);

//       const data = await res.json();

//       setUsers(data);

//     } catch (error) {
//       console.log(error);
//     }
//   };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6">

        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Users CRUD App
        </h1>

        {/* INPUTS */}
        <div className="space-y-3">

          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mt-4">

          <button
            onClick={createUser}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Create User
          </button>

          <button
            onClick={getUsers}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition"
          >
            Load Users
          </button>

        </div>

        {/* USERS LIST */}
        <div className="mt-6 space-y-3">

          {users.map((u) => (

            <div
              key={u.id}
              className="p-3 border rounded-lg bg-gray-50 flex justify-between"
            >

              <span className="font-medium">
                {u.name}
              </span>

              <span className="text-gray-500">
                {u.email}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Users;