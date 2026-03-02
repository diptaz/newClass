import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables. 
// In Vercel, set VITE_SUPABASE_URL and VITE_SUPABASE_KEY in Project Settings.
// Safely access import.meta.env to avoid runtime errors if it's undefined
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://lvlpfocnblakfzwtbvzy.supabase.co';
const supabaseKey = env.VITE_SUPABASE_KEY || 'sb_publishable_b8kEW4BnGV5DY9RYTUIIrg_Oibh-C9Z';

// Create a single supabase client for interacting with your database
// We provide placeholder values if config is missing to prevent createClient from throwing an error immediately.
// Actual usage is guarded by isSupabaseConfigured() in the Store.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
);

// Helper to check if supabase is connected/configured
export const isSupabaseConfigured = () => {
    return supabaseUrl !== '' && supabaseKey !== '';
}