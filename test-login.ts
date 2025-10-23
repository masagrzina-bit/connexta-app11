import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL ili KEY nisu postavljeni!')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth() {
  const email = 'test@example.com'
  const password = 'password123'

  console.log('📧 Pokušavam da registrujem korisnika...')
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    console.error('❌ Greška pri registraciji:', error.message)
  } else {
    console.log('✅ Korisnik registrovan:', data)
  }
}

testAuth()
