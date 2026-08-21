import { useEffect, useState } from 'react'
import { useAuth } from './auth'
import { supabase } from './supabase'
import logo from './assets/Logo.png'
import CommonButton from './components/CommonButton'
import CommonErrorText from './components/CommonErrorText'
import CommonHeader from './components/CommonHeader'
import InputLine from './components/InputLine'
import TabBar, { type TabRoute } from './components/TabBar'
import './styles.css'
import LoadingSpinner from './components/LoadingSpinner'
import FavoritesScreen from './routes/FavoritesScreen'
import HomeScreen from './routes/HomeScreen'

function getFriendlyAuthError(error: { message?: string } | null) {
  if (!error?.message) return ''
  const message = error.message.toLowerCase()
  if (message.includes('invalid login credentials')) return 'Email or password is incorrect. Please try again.'
  if (message.includes('email not confirmed')) return 'Please confirm your email before signing in.'
  if (message.includes('user not found')) return 'No account found for that email.'
  if (message.includes('network')) return 'Network issue. Please check your connection and try again.'
  return 'Unable to sign in right now. Please try again.'
}

type LoginScreenProps = {
  onSignUp: () => void
}

function LoginScreen({ onSignUp }: LoginScreenProps) {
  const [iemail, setIEmail] = useState('')
  const [ipassword, setIPassword] = useState('')
  const [message, setMessage] = useState('')

  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
      email: iemail,
      password: ipassword,
    })

    if (error) setMessage(getFriendlyAuthError(error))
  }

  return (
    <main className="login-container">
      <img className="logo" src={logo} alt="QOBuy" />
      <h1>Sign in</h1>
      <InputLine
        placeholder="Email"
        value={iemail}
        onChangeText={setIEmail}
        placeholderTextColor="#555"
        inputMode="email"
      />
      <InputLine
        placeholder="Password"
        value={ipassword}
        onChangeText={setIPassword}
        placeholderTextColor="#555"
        secureTextEntry
      />
      <CommonErrorText value={message} />
      <CommonButton title="Next" onPress={() => void signInWithEmail()} />
      <CommonButton title="Sign-up" onPress={onSignUp} />
    </main>
  )
}

type SignUpScreenProps = {
  onBack: () => void
}

function SignUpScreen({ onBack }: SignUpScreenProps) {
  const [iemail, setIEmail] = useState('')
  const [iusername, setIUsername] = useState('')
  const [ipassword, setIPassword] = useState('')
  const [icpassword, setIcPassword] = useState('')
  const [message, setMessage] = useState('')

  async function signUp() {
    if (ipassword !== icpassword) {
      setMessage('Password and conformation password should be the same!')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: iemail,
      password: ipassword,
      options: {
        data: {
          username: iusername,
          full_name: iusername,
        },
      },
    })

    if (!error && data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        username: iusername,
        full_name: iusername,
      })

      if (profileError) setMessage(profileError.message)
    }

    if (error) setMessage(error.message)
  }

  return (
    <main className="signup-container">
      <CommonHeader headerText="Sign Up" onBack={onBack} />
      <section className="signup-input-container">
        <h1>Sign up</h1>
        <InputLine
          placeholder="Email"
          value={iemail}
          onChangeText={setIEmail}
          placeholderTextColor="#555"
          inputMode="email"
        />
        <InputLine
          placeholder="Username"
          value={iusername}
          onChangeText={setIUsername}
          placeholderTextColor="#555"
        />
        <InputLine
          placeholder="Password"
          value={ipassword}
          onChangeText={setIPassword}
          placeholderTextColor="#555"
          secureTextEntry
        />
        <InputLine
          placeholder="Confirm Password"
          value={icpassword}
          onChangeText={setIcPassword}
          placeholderTextColor="#555"
          secureTextEntry
        />
        <CommonErrorText value={message} />
        <CommonButton title="Next" onPress={() => void signUp()} />
      </section>
    </main>
  )
}

function MainTabsScreen() {
  const [route, setRoute] = useState<TabRoute>(() => window.location.hash === '#/favorites' ? 'favorites' : 'home')

  useEffect(() => {
    function updateRoute() {
      setRoute(window.location.hash === '#/favorites' ? 'favorites' : 'home')
    }

    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  return (
    <div className="main-tabs-shell">
      {route === 'favorites' ? <FavoritesScreen /> : <HomeScreen />}
      <TabBar activeRoute={route} />
    </div>
  )
}

export default function App() {
  const { isLoading, isLoggedIn } = useAuth()
  const [screen, setScreen] = useState<'login' | 'signup'>('login')
  
  if (isLoading){
    return (
      <main className="loading">
        <LoadingSpinner />
      </main>
    );
  } 
  if (isLoggedIn) return <MainTabsScreen />

  return screen === 'signup'
    ? <SignUpScreen onBack={() => setScreen('login')} />
    : <LoginScreen onSignUp={() => setScreen('signup')} />
}