import {useNavigate} from "react-router-dom";

/**
 * Fonction qui permet de se déconnecter
 * @param setConnected
 * @constructor
 */
export default function Logout({setConnected}) {
    const navigate = useNavigate()
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.reload();
    setConnected(false)
    navigate("/")
}