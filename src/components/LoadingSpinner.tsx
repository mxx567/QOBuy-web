import loadingspinner from '../assets/icons/loadingspinner.png'

export default function LoadingSpinner(){
    return(
        <div>
            <img className="loadingSpinner" src={loadingspinner}/>
        </div>
    );
}