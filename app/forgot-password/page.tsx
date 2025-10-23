"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://connexta.app/update-password",
    });

    if (error) setError(error.message);
    else setMessage("Check your email for the password reset link.");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        {message && <p className="text-green-600 mb-3 text-center">{message}</p>}

        <form onSubmit={handleReset} className="flex flex-col">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
