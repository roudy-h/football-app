import React, {useState, useRef, navigate} from 'react';
import { useNavigate } from 'react-router-dom';
import userDAO from '../../dao/userDAO';
import './Register.css';
import Input from "../Input/Input";

/**
 * Composant Register pour l'inscription d'un utilisateur
 * @param setConnected - La fonction pour modifier la connexion
 * @returns {Element}
 * @constructor
 */
export default function Register({setConnected}) {
    const navigate = useNavigate();

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const success = await userDAO.register({
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value
            });
            setConnected(true)
            navigate("/")
        } catch (error) {
            setError(error.message); // Affichage de l'erreur dans le formulaire
        }
    };

    return (
        <div className="container">
            <div className="allForm">
                <form onSubmit={handleSubmit}>
                    <h2>S'inscrire</h2>
                    {error && <div>Oops ! Quelque chose s'est mal passé lors de l'inscription.</div>}
                    <Input ref={firstNameRef} title={"Prénom"} type={"text"} />
                    <Input ref={lastNameRef} title={"Nom"} type={"text"} />
                    <Input ref={emailRef} title={"Email"} type={"email"} />
                    <Input ref={passwordRef} title={"Mot de passe"} type={"password"} />
                    <button type="submit">S'inscrire</button>
                </form>
                <h4>Ou</h4>
                <button onClick={() => {navigate("/login")}}>Se connecter</button>
            </div>
        </div>
    )
}
