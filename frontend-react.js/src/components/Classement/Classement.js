import {useState} from 'react'
import TeamDAO from "../../dao/DAOTeam.mjs";
import './Classement.css'
import { Link } from 'react-router-dom';

const classement = await TeamDAO.returnRanks()

/**
 * Composant Thead : affiche les entêtes du tableau
 * @returns {JSX.Element}
 * @constructor
 */
function Thead() {
    return (
        <thead>
            <tr>
                <th>Position</th>
                <th>Club</th>
                <th>Points</th>
                <th>Victoire</th>
                <th>Nul</th>
                <th>Défaite</th>
                <th>But pour</th>
                <th>But contre</th>
                <th>Différence</th>
            </tr>
        </thead>
    )
}

/**
 * Composant Tbody : affiche le contenu du tableau
 * @param classement
 * @returns {JSX.Element}
 * @constructor
 */
export function Tbody({ classement }) {
    return (
        <tbody>
            {classement.map((team, index) => (
                <tr key={team.code}>
                    <td>{index+1}</td>
                    <td id='team'>
                        <Link to={`/equipe/${team.code}`}>
                            <img src={team.logo} height='30px' />
                            {team.name}
                        </Link>
                    </td>
                    <td>{team.score}</td>
                    <td>{team.win}</td>
                    <td>{team.draw}</td>
                    <td>{team.loose}</td>
                    <td>{team.goalFor}</td>
                    <td>{team.goalAgainst}</td>
                    <td>{team.diff}</td>
                </tr>
            ))}
        </tbody>
    )
}

/**
 * Composant Classement : affiche le classement de la ligue
 * @returns {JSX.Element}
 * @constructor
 */
export default function Classement() {
    return (
        <div>
            <h1>Classement</h1>
            <table>
                <Thead />
                <Tbody classement={classement} />
            </table>
        </div>
    )
}