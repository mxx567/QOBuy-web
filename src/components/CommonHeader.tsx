import backIcon from '../assets/back.png'

type CommonHeaderProps = {
  headerText: string
  onBack: () => void
}

export default function CommonHeader({ headerText, onBack }: CommonHeaderProps) {
  return (
    <header className="common-header">
      <button className="back-button" type="button" onClick={onBack} aria-label="Go back">
        <img src={backIcon} alt="" />
      </button>
      <span>{headerText}</span>
    </header>
  )
}