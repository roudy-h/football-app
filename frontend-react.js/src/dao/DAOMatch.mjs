/**
 * DAO pour les actualités
 * @type {{returnCurrentMatch: (function(): Promise<any>), returnMatch: (function(): Promise<any>), returnMatchByDay: (function(*): Promise<any>)}}
 */
const MatchDAO = {
    /**
     * Récupère tous les matchs du championnat (saison en cours)
     * @returns {Promise<any>}
     */
    returnMatch : async () => {
        let url = "http://localhost:8010/api/match"
        const res = await fetch(url)
        const data = await res.json()
        return data
    },

    /**
     * Récupère les matchs d'une journée du championnat
     * @param day {number} numéro de la journée
     * @returns {Promise<any>}
     */
    returnMatchByDay : async (day) => {
        let url = "http://localhost:8010/api/match/day/" + day
        const res = await fetch(url)
        const data = await res.json()
        return data
    },

    /**
     * Récupère les matchs en cours ou à venir du championnat
     * @returns {Promise<any>}
     */
    returnCurrentMatch : async () => {
        let url = "http://localhost:8010/api/match/current"
        const res = await fetch(url)
        const data = await res.json()
        return data
    }
}

export default MatchDAO