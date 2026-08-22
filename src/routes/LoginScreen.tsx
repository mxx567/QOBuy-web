import { useState } from "react"
import { supabase } from "../supabase"
import logo from "../assets/Logo.png"
import CommonErrorText from "../components/CommonErrorText"
import CommonButton from "../components/CommonButton"
import InputLine from "../components/InputLine"


type LoginScreenProps = {
  onSignUp: () => void
}

export default function LoginScreen({ onSignUp }: LoginScreenProps) {
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