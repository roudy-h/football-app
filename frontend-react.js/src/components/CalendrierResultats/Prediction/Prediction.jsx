import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import predictionDAO from '../../../dao/predictionDAO.mjs';
import './Prediction.css';

/**
 * Composant Prediction : affiche les prédictions d'un match
 * @param match : informations du match
 * @returns {JSX.Element}
 * @constructor
 */
export default function Prediction({ match }) {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [predictionChanged, setPredictionChanged] = useState(false);
    const navigate = useNavigate();
    const [isFinished, setIsFinished] = useState(false)

    useEffect(() => {
        async function fetchPrediction() {
            try {
                const prediction = await predictionDAO.getMatchPrediction(match.id);
                setPrediction(prediction);
            } catch (error) {
                console.error("Error fetching prediction:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPrediction();
    }, [match.id, predictionChanged]); // Mettre à jour la dépendance pour inclure match.id
    
    useEffect(() => {
        setIsFinished(match.status === 'FINISHED');
    }, [match.status]);

    async function savePrediction(value, team) {
        if (!window.localStorage.getItem("accessToken")) {
            navigate("/login");
            return;
        }

        const confirmationMessage = `Êtes-vous sûr de vouloir parier sur ${team} pour le match ${match.homeTeam.name} contre ${match.awayTeam.name} ?`;
        const confirmation = window.confirm(confirmationMessage);

        if (confirmation) {
            try {
                await predictionDAO.addPrediction(match.id, value);
                setPredictionChanged(prevState => !prevState);
            } catch (error) {
                console.error("Error adding prediction:", error);
                alert("Une erreur s'est produite lors de l'ajout de la prédiction. Veuillez réessayer.");
            }
        }
    }

    return (
        <div className="prediction-container">
            <h3>Les prédictions</h3>
            {loading ? (
                <div>Chargement en cours...</div>
            ) : (
                <div key={match.id} className="prediction">
                        <p>{prediction ? "Les prédictions de ce match" : "Aucune prédiction pour ce match"}</p>
                    {prediction && (
                        <div className="resultats">
                            <div className="progress" style={{ height: '10px', float: 'left', width: `${prediction.home}%`, backgroundColor: 'blue' }}></div>
                            <div className="progress" style={{ height: '10px', float: 'left', width: `${prediction.draw}%`, backgroundColor: 'gray' }}></div>
                            <div className="progress" style={{ height: '10px', float: 'left', width: `${prediction.away}%`, backgroundColor: 'red' }}></div>
                        </div>
                    )}
                    <div className="prediction-valeurs">
                        {prediction && (
                            <>
                                <p>{match.homeTeam.name} : {prediction.home}%</p>
                                <p>Match nul : {prediction.draw}%</p>
                                <p>{match.awayTeam.name} : {prediction.away}%</p>
                            </>
                        )}
                        {!isFinished && (
                            <>
                                <button onClick={() => savePrediction("home", `la victoire de ${match.homeTeam.name}`, match.awayTeam.name, `${match.homeTeam.name} vs ${match.awayTeam.name}`)}>Parier sur la victoire de {match.homeTeam.name}</button>
                                <button onClick={() => savePrediction("draw", "un match nul", "", `${match.homeTeam.name} vs ${match.awayTeam.name}`)}>Parier sur un match nul</button>
                                <button onClick={() => savePrediction("away", `la victoire de ${match.awayTeam.name}`, match.homeTeam.name, `${match.homeTeam.name} vs ${match.awayTeam.name}`)}>Parier sur la victoire de {match.awayTeam.name}</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
