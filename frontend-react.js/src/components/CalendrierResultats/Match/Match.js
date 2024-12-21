import { useEffect, useState } from 'react'
import './Match.css'
import { Link } from 'react-router-dom'
import Prediction from '../Prediction/Prediction'

/**
 * Composant Match : affiche les informations d'un match
 * @param status : statut du match
 * @param homeTeam : nom de l'équipe à domicile
 * @param homeTeamImg : logo de l'équipe à domicile
 * @param awayTeam : nom de l'équipe à l'extérieur
 * @param awayTeamImg : logo de l'équipe à l'extérieur
 * @param hour : heure du match
 * @param score : score du match
 * @param codeHome : code de l'équipe à domicile
 * @param codeAway : code de l'équipe à l'extérieur
 * @param match : informations du match
 * @returns {JSX.Element}
 * @constructor
 */
export default function Match({status, homeTeam, homeTeamImg, awayTeam, awayTeamImg, hour, score, codeHome, codeAway, match}) {
    const [prediction, setPrediction] = useState(false)
    const [textButtonP, setTextButtonP] = useState("voir les prédictions")

    function handleClick(btn) {
        console.log()
        setPrediction(!prediction)
        // const btn = document.querySelectorAll(".btn-prediction")
        if (!prediction) {
            setTextButtonP("fermer")
            // btn[0].classList.add("btn-prediction-clicked")
        } else {
            setTextButtonP("voir les prédictions")
            // btn[0].classList.remove("btn-prediction-clicked")
        }
    }

    return (
        <div>
            <div className="matchContainer">
                <div className="infosMatch">
                    <div className="match">
                        <div className="homeTeam">
                            <Link to={`/equipe/${codeHome}`}>
                                <p className='nameTeam'>{homeTeam}</p>
                                <img src={homeTeamImg} alt={homeTeam} width="30px"/>
                            </Link>
                        </div>

                        {status === 'FINISHED' && (
                            <div className="score">
                                <p>{score}</p>
                            </div>
                        )}

                        {status === 'IN_PLAY' && (
                            <div className="score">
                                <p>Match en cours...</p>
                            </div>
                        )}

                        {(status === 'SCHEDULED' || status === 'TIMED') && (
                            <div className="hour">
                                <p>{hour}</p>
                            </div>
                        )}

                        <div className="awayTeam">
                            <Link to={`/equipe/${codeAway}`}>
                                <img src={awayTeamImg} alt={awayTeam} width="30px"/>
                                <p className='nameTeam'>{awayTeam}</p>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="infosPrediction">
                    {prediction && <Prediction match={match}/>}
                </div>
            </div>
            <button onClick={() => {handleClick()}} className="btn-prediction">{textButtonP}</button>
        </div>
    )
}