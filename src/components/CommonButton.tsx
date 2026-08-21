type CommonButtonProps = {
  title: string
  disabled?: boolean
  onPress: () => void
}

export default function CommonButton({ title, disabled, onPress }: CommonButtonProps) {
  return <button className="common-button" type="button" disabled={disabled} onClick={onPress}>{title}</button>
}