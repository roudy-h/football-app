/**
 * DAO pour les prédictions
 * @type {{getMatchPrediction: ((function(*): Promise<null|{away, draw, home}|undefined>)|*), addPrediction: ((function(*, *): Promise<any|undefined>)|*), getUserPredictions: ((function(): Promise<any|undefined>)|*)}}
 */
const predictionDAO = {
    /**
     * Récupère les prédictions d'un match
     * @param matchId {string} id du match
     * @returns {Promise<{away: string, draw: string, home: string}|null>}
     */
    getMatchPrediction: async (matchId) => {
        const response = await fetch(`http://localhost:8030/api/prediction/match/${matchId}`);
        if (response.ok) {
            const prediction = await response.json();
            if (prediction.length === 0) {
                return null
            }
            let home = 0
            let draw = 0
            let away = 0
            prediction.forEach(p => {
                if (p.prediction === 'home') {
                    home++;
                } else if (p.prediction === 'away') {
                    away++;
                } else {
                    draw++;
                }
            })
            return {
                home: (home / prediction.length * 100).toFixed(2),
                draw: (draw / prediction.length * 100).toFixed(2),
                away: (away / prediction.length * 100).toFixed(2)
            }
        } else {
            console.log(response)
            throw new Error(response.message || response.statusText);
        }
    },

    /**
     * Ajoute une prédiction
     * @param matchId {number}
     * @param prediction {string} home, draw ou away
     * @returns {Promise<any>}
     */
    addPrediction: async (matchId, prediction) => {
        const response = await fetch(`http://localhost:8030/api/prediction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            },
            body: JSON.stringify({
                prediction: prediction,
                matchId: matchId
            })
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            alert(data.message)
        }
    },

    /**
     * Récupère les prédictions d'un utilisateur
     * @returns {Promise<any>}
     */
    getUserPredictions: async () => {
        const response = await fetch('http://localhost:8030/api/prediction/user', {
            headers: {'authorization' : 'Bearer ' +localStorage.getItem('accessToken')}
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error(response.message || response.statusText);
        }
    }
}

export default predictionDAO;