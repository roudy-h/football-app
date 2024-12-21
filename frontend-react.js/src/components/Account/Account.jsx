import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Account.css'
import predictionDAO from "../../dao/predictionDAO.mjs";

/**
 * Composant Account : affiche les informations de l'utilisateur connecté
 * @returns {JSX.Element}
 */
export default function Account() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [prediction, setPrediction] = useState(null)

    useEffect(() => {
        const getPrediction = async () => {
            try {
                const data = await predictionDAO.getUserPredictions()
                setPrediction(data)
            } catch (e) {
                alert(e)
            }
        }

        getPrediction()
    }, [user])

    useEffect(() => {
        const accessToken = window.localStorage.getItem('accessToken');
        const userData = window.localStorage.getItem('user');

        if (!accessToken) {
            navigate("/login");
        } else if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        }
    }, [navigate]);

    return (
        <div className="user-container">
            <h1>Mon compte</h1>
            <div className="infos">
                {user && (
                    <>
                        <h2>Informations personnelles</h2>
                        <p>Prénom : {user.firstName}</p>
                        <p>Nom : {user.lastName}</p>
                        <p>Adresse mail : {user.email}</p>
                    </>
                )}
            </div>

            {prediction && (
                <div className="user-prediction">
                    <h2>Vos prédictions :</h2>
                    <ul>
                        {prediction.map((item, index) => (
                            <li key={index}>
                                <p>Date : {new Date(item.date).toLocaleString()} - Match ID : {item.matchId}</p>                                </li>
                        ))}
                    </ul>
                </div>
            )}

            <button>Me deconnecter</button>
        </div>
    );
}
