"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setError(error.message);
    else router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

