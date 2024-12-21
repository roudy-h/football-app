/**
 * DAO Pour les équipes
 */
const TeamDAO = {
    /**
     * Récupère toutes les équipes du championnat
     * @returns {Promise<any>}
     */
    returnTeams : async () => {
        let url = "http://localhost:8040/api/team"
        const res = await fetch(url)
        const data = await res.json()
        return data
    },

    /**
     * Récupère une équipe par son code
     * @param code {number} code de l'équipe
     * @returns {Promise<any>}
     */
    returnTeamByCode : async (code) => {
        let url = "http://localhost:8040/api/team/" + code
        const res = await fetch(url)
        const data = await res.json()
        return data
    },

    /**
     * Récupère les classements des équipes du championnat
     * @returns {Promise<any>}
     */
    returnRanks: async () => {
        let url = "http://localhost:8040/api/team/ranks"
        const res = await fetch(url)
        const data = await res.json()
        return data
    },

 
}

export default TeamDAO