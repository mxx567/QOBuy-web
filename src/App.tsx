import TabBar from './components/TabBar'
import './styles.css'
import FavoritesScreen from './routes/FavoritesScreen'
import HomeScreen from './routes/HomeScreen'
import { redirect, Route, Routes, useNavigate } from 'react-router-dom'
import LoginScreen from './routes/LoginScreen'
import ProtectedRoute from './routes/ProtectedRoute'
import SignUpScreen from './routes/SignUpScreen'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import { supabase } from './supabase'

function MainTabsScreen() {
  return (
    <div className="main-tabs-shell">
      <TabBar activeRoute={'/'} />
    </div>
  )
}

export default function App() {
  const isLoggedIn = useAuthStore((i) => i.isLoggedIn)
  const syncAuthState  = useAuthStore((s) => s.syncAuthState)

  useEffect(()=>{
    let active = true
    void syncAuthState(active)
    const { data: listener } = supabase.auth.onAuthStateChange(() => void syncAuthState(active))
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])
  
  const nav = useNavigate();
  return(
    <div>
      {isLoggedIn &&
      <MainTabsScreen/>}
      <Routes>
        <Route path='/login' element={<LoginScreen onSignUp={() =>nav("/signup")}/>} />
        <Route path='/signup' element={<SignUpScreen onBack={() =>nav("/login")}/>} />

        <Route element={<ProtectedRoute />}>
          <Route  path="/" element={<HomeScreen />} />
          <Route  path="/favourites" element={<FavoritesScreen />} />
        </Route>
      </Routes>
     
    </div>
  );
}