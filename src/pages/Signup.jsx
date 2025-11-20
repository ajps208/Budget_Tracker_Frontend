import React, { useState } from "react";
import { signup } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();

  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  // handle signup
  async function handleSignup(e) {
    e.preventDefault();
    try {
      const res = await signup(name, email, password);

      // save auth data
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // redirect
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Create Account</h2>

        {/* error message */}
        {err && <div className="bg-red-100 text-red-600 p-2 rounded">{err}</div>}

        {/* name input */}
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        {/* signup button */}
        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Sign Up
        </button>

        {/* login link */}
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
