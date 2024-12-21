/**
 * DAO Pour les utilisateurs (user)
 */
const userDAO = {
    /**
     * Inscription d'un utilisateur
     * @param user {Object} email, password, firstName, lastName
     * @returns {Promise<boolean>}
     */
    register: async (user) => {
        try {
            const response = await fetch('http://localhost:8050/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                return true;
            } else {
                throw new Error(data.message || response.statusText);
            }
        } catch (error) {
            throw error;
        }
    },
    /**
     * Connexion d'un utilisateur
     * @param user {Object} email, password
     * @returns {Promise<boolean>}
     */
    login: async (user) => {
        try {
            const response = await fetch('http://localhost:8050/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                return true;
            } else {
                throw new Error(data.message || response.statusText);
            }
        } catch (error) {
            throw error;
        }
    }
}

export default userDAO;