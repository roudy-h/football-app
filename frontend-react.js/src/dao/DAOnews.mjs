/**
 * DAO pour les actualités
 */
const NewsDao = {
    /**
     * Récupère toutes les actualités
     * @returns {Promise<any>}
     */
    returnAllArticles : async() => {
        const url = "http://localhost:8020/api/news"
        try {
            const res = await fetch(url)
            const data = await res.json()
            return data
        } catch (error) {
            console.error('Erreur lors du chargement des actualités:', error);
        }
    }
}

export default NewsDao
