import errorIcon from '../assets/Error.png'

export default function CommonErrorText({ value }: { value: string }) {
    if (!value) return null
    return (
        <div className="error-text" role="alert"><img src={errorIcon} alt="" /> 
            <span>{value}</span>
        </div>
    );
}