import React, { useState } from "react";
import { login } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  // form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  // handle login
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await login(email, password);

      // save auth data
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // go to home
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Login</h2>

        {/* error message */}
        {err && <div className="bg-red-100 text-red-600 p-2 rounded">{err}</div>}

        {/* email input */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* password input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* login button */}
        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Login
        </button>

        {/* signup link */}
        <div className="text-center text-sm">
          New user?{" "}
          <Link to="/signup" className="text-indigo-600">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}
