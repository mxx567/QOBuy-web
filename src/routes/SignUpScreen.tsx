import { useState } from "react"
import { supabase } from "../supabase"
import CommonHeader from "../components/CommonHeader"
import InputLine from "../components/InputLine"
import CommonErrorText from "../components/CommonErrorText"
import CommonButton from "../components/CommonButton"
import { useNavigate } from "react-router-dom"

type SignUpScreenProps = {
  onBack: () => void
}

export default function SignUpScreen({ onBack }: SignUpScreenProps) {
  const [iemail, setIEmail] = useState('')
  const [iusername, setIUsername] = useState('')
  const [ipassword, setIPassword] = useState('')
  const [icpassword, setIcPassword] = useState('')
  const [message, setMessage] = useState('')
 
  const nav = useNavigate();

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

    if (error) {
        setMessage(error.message)
        return;
    }
    nav("/")
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