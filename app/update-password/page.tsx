"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) setError(error.message);
    else setMessage("Password updated successfully! You can log in now.");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Update Password</h1>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        {message && <p className="text-green-600 mb-3 text-center">{message}</p>}

        <form onSubmit={handleUpdate} className="flex flex-col">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
