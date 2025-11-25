import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useUser() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cek user yang sedang login
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Dengarkan perubahan login/logout (real-time)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Cleanup
    return () => listener?.subscription.unsubscribe()
  }, [])

  return { user, loading }
}