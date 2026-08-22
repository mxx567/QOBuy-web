import type { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'
import { create } from 'zustand';

type AuthContextValue = { 
  user: User | null; 
  profile: Record<string, unknown> | null;
  isLoading: boolean; 
  isLoggedIn: boolean;
  setUser(isLoading: User | null): void;
  setProfile(profile : any): void;
  setIsLoading(isLoading: boolean): void;
  setLoggedIn(isLoggedIn: boolean): void;
  syncAuthState(active : boolean): void;
}


export const useAuthStore = create<AuthContextValue>((set,get)=>({
  user: null,
  profile: null,
  isLoading: true,
  isLoggedIn: false,
  setUser: (user) => { set({user}) },
  setProfile: (profile) => { set({profile}) },
  setIsLoading: (isLoading) => { set({isLoading}) },
  setLoggedIn: (isLoggedIn) => { set({isLoggedIn}) },
  syncAuthState: async (active) => {
    set({isLoading: true})
    const { data, error } = await supabase.auth.getUser()
    if (error && error.name !== 'AuthSessionMissingError') console.error('Error getting user:', error)
    const nextUser = data.user ?? null
    if (!active) return
    set({user: nextUser, isLoggedIn: !!nextUser})
    if (!nextUser) {
        set({profile: null, isLoading: false})
        return
    }
    const result = await supabase.from('profiles').select('*').eq('id', nextUser.id).maybeSingle()
    if (!active) return
    if (result.error) {
        console.error('Error fetching profile:', result.error)
        set({profile: null, isLoading: false})
    } else{
        set({profile: result.data ?? null, isLoading: false})
    }
  }
})) 
