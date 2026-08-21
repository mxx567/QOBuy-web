type InputLineProps = {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  placeholderTextColor?: string
  secureTextEntry?: boolean
  inputMode?: 'text' | 'email' | 'numeric' | 'tel' | 'url'
  multiline?: boolean
  height?: number
}

export default function InputLine({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = '#555',
  secureTextEntry,
  inputMode = 'text',
  multiline,
  height = 40,
}: InputLineProps) {
  return multiline ? (
    <textarea
      className="input-line"
      style={{ height }}
      value={value}
      onChange={(event) => onChangeText(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
    />
  ) : (
    <input
      className="input-line"
      style={{ height }}
      type={secureTextEntry ? 'password' : inputMode === 'email' ? 'email' : 'text'}
      inputMode={inputMode}
      value={value}
      onChange={(event) => onChangeText(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      autoComplete={secureTextEntry ? 'current-password' : inputMode === 'email' ? 'email' : 'off'}
    />
  )
}