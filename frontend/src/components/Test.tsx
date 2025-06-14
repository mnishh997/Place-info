import { useState } from "react";

export const Test = () => {
  const [email, setEmail] = useState("ishu2");
  const [password, setPassword] = useState("password");
  console.log("Rerendering")
  return (
    <>
      <div className="bg-white shadow border  min-h-10 rounded-sm flex flex-col p-4 gap-2">
        <input
          className="border rounded-sm p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded-sm p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-gray-200 py-1 rounded-sm hover:bg-gray-300"
          onClick={() => {
            fetch("http://localhost:5000/api/auth/login", {
              headers: {
                "Content-Type": "application/json",
              },

              method: "POST",
              credentials: "include",
              body: JSON.stringify({
                email,
                password,
              }),
            });
          }}
        >
          Login
        </button>
      </div>
      <div className="bg-white shadow border  min-h-10 rounded-sm flex flex-col p-4 gap-2">
        <button
          className="bg-gray-200 py-1 rounded-sm hover:bg-gray-300"
          onClick={async () => {
            const res = await fetch(
              "http://localhost:5000/api/auth/user",
              {
                credentials: "include",
              }
            );
            if (res.ok) {
              alert("Protected is accessible");
            } else {
              alert("Protected is inaccessible");
            }
          }}
        >
          Get Protected
        </button>
      </div>
      <div className="bg-white shadow border  min-h-10 rounded-sm flex flex-col p-4 gap-2">
        <button
          className="bg-gray-200 py-1 rounded-sm hover:bg-gray-300"
          onClick={async () => {
            const res = await fetch("http://localhost:5000/api/auth/logout", {
              credentials: "include",
              method: "POST"
            });

            if (res.ok) {
                alert("Logged Out successfully")
            } else {
                alert("Failed to logout")
            }
          }}

        >
          Logout
        </button>
      </div>
    </>
  );
};
