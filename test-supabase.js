// test-supabase.js
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Učitaj .env fajl
dotenv.config();

// Čitanje promenljivih iz .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Provera da li su promenljive postavljene
if (!supabaseUrl || !supabaseKey) {
  throw new Error('supabaseUrl ili supabaseKey nisu postavljeni u .env fajlu!');
}

// Kreiranje Supabase klijenta
const supabase = createClient(supabaseUrl, supabaseKey);

// Funkcija za testiranje tabele profiles
async function testProfiles() {
  try {
    console.log("Fetching profiles...");
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      console.error("Greška pri dohvatanju profila:", error);
    } else {
      console.log("Profiles:", data);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

// Pokretanje testa
testProfiles();
