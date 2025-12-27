import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('useUser: Initializing hook, loading = true');
    // Cek user yang sedang login
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useUser: getSession resolved, user:', session?.user?.id ? 'found' : 'null', 'setting loading = false');
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Dengarkan perubahan login/logout (real-time)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('useUser: Auth state changed, event:', _event, 'user:', session?.user?.id ? 'found' : 'null', 'setting loading = false');
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Cleanup
    return () => {
        console.log('useUser: Cleaning up auth state listener.');
        listener?.subscription.unsubscribe();
    }
  }, [])
  
  console.log('useUser: Rendered with user:', user?.id ? 'found' : 'null', 'loading:', loading);

  return { user, loading }
}