import {useNavigate} from "react-router-dom";
import React, {useRef, useState} from "react";
import userDAO from "../../dao/userDAO.mjs";
import './Login.css';
import Input from "../Input/Input";

/**
 * Composant Login pour la connexion
 * @param connected - L'utilisateur est-il connecté ?
 * @param setConnected - La fonction pour modifier la connexion
 * @returns {Element}
 * @constructor
 */
export default function Login({connected, setConnected}) {
    const navigate = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();

    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const success = await userDAO.login({
                email: emailRef.current.value,
                password: passwordRef.current.value
            });
            setConnected(true)
            navigate('/')
        } catch (error) {
            setError(error.message); // Affichage de l'erreur dans le formulaire
        }
    };

    return (
        <div className="container">
            <div className="allForm">
                <form onSubmit={handleSubmit}>
                    <h2>Se connecter</h2>
                    {error && <div>Adresse e-mail ou mot de passe incorrect.</div>}
                    {error && error}
                    <Input ref={emailRef} title={"Email"} type={"email"} />
                    <Input ref={passwordRef} title={"Mot de passe"} type={"password"} />
                    <button type="submit">Se connecter</button>
                </form>
                <h4>Ou</h4>
                <button onClick={() => {navigate("/register")}}>S'inscrire</button>
            </div>
        </div>
    )
}