import TabBar from './components/TabBar'
import './styles.css'
import FavoritesScreen from './routes/FavoritesScreen'
import HomeScreen from './routes/HomeScreen'
import { redirect, Route, Routes } from 'react-router-dom'
import LoginScreen from './routes/LoginScreen'
import ProtectedRoute from './routes/ProtectedRoute'
import SignUpScreen from './routes/SignUpScreen'

function MainTabsScreen() {
  return (
    <div className="main-tabs-shell">
      <TabBar activeRoute={'/'} />
    </div>
  )
}

export default function App() {
  // const { isLoading, isLoggedIn } = useAuth()
  // const [screen, setScreen] = useState<'login' | 'signup'>('login')
  
  // if (isLoading){
  //   return (
  //     
  //   );
  // } 
  // if (isLoggedIn) return <MainTabsScreen />

  // return screen === 'signup'
  //   ? <SignUpScreen onBack={() => setScreen('login')} />
  //   : <LoginScreen onSignUp={() => setScreen('signup')} />
  return(
    <div>
      <MainTabsScreen />
      <Routes>
        
        <Route path='/login' element={<LoginScreen onSignUp={() => redirect("/")}/>} />
        <Route path='/signup' element={<SignUpScreen onBack={() => redirect("/login")}/>} />

        <Route element={<ProtectedRoute />}>
          <Route  path="/" element={<HomeScreen />} />
          <Route  path="/favourites" element={<FavoritesScreen />} />
        </Route>
      </Routes>
     
    </div>
  );
}