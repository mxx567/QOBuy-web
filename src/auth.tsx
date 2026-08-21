import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

type AuthContextValue = { user: User | null; profile: Record<string, unknown> | null; isLoading: boolean; isLoggedIn: boolean }
const AuthContext = createContext<AuthContextValue>({ user: null, profile: null, isLoading: true, isLoggedIn: false })

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    const syncAuthState = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.auth.getUser()
      if (error && error.name !== 'AuthSessionMissingError') console.error('Error getting user:', error)
      const nextUser = data.user ?? null
      if (!active) return
      setUser(nextUser)
      if (!nextUser) {
        setProfile(null)
        setIsLoading(false)
        return
      }
      const result = await supabase.from('profiles').select('*').eq('id', nextUser.id).maybeSingle()
      if (!active) return
      if (result.error) {
        console.error('Error fetching profile:', result.error)
        setProfile(null)
      } else setProfile(result.data ?? null)
      setIsLoading(false)
    }

    void syncAuthState()
    const { data: listener } = supabase.auth.onAuthStateChange(() => void syncAuthState())
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return(
    <AuthContext.Provider value={{ user, profile, isLoading, isLoggedIn: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)