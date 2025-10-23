'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://connexta.app/update-password',
    })

    if (error) setError(error.message)
    else setMessage('✅ Proveri svoj email – poslat je link za reset lozinke.')

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Zaboravljena lozinka
        </h1>

        <input
          type="email"
          placeholder="Email adresa"
          className="w-full mb-3 px-4 py-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? 'Slanje...' : 'Pošalji link za reset'}
        </button>

        <p className="text-center mt-4 text-sm">
          <a href="/login" className="text-blue-600 hover:underline">
            Nazad na prijavu
          </a>
        </p>
      </form>
    </div>
  )
}
