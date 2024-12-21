import {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import './Equipes.css'
import TeamDAO from "../../dao/DAOTeam.mjs";
const dataTeam = await TeamDAO.returnTeams()

/**
 * Composant EquipeDetails : affiche les informations d'une équipe
 * @param nom : nom de l'équipe
 * @param logo : logo de l'équipe
 * @param code : code de l'équipe
 * @returns {JSX.Element}
 * @constructor
 */
function EquipeDetails({nom, logo, code}) {
    return (
        <div className='teamContainer'>
            <Link className='teamLink' to={`/equipe/${code}`}>
                <div className='team'>
                    <img src={logo} alt="logo de l'équipe"/>
                    <p id='name'>{nom}</p>
                </div>
            </Link>
        </div>
    )
}

/**
 * Composant Equipes : affiche les informations de toutes les équipes
 * @returns {JSX.Element}
 * @constructor
 */
export default function Equipes() {
    return (
        <div className='container'>
            <h1>&Eacute;quipes</h1>
            <div className='teams'>
                {dataTeam.map((team, i) => (
                    <EquipeDetails key={i} nom={team.name} logo={team.logo} code={team.code}/>
                ))}
            </div>
        </div>
    )
}
