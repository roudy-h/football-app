import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './Equipe.css'
import teamDAO from "../../dao/DAOTeam.mjs";

/**
 * Composant Player : affiche les informations d'un joueur
 * @param name : nom du joueur
 * @param number : numéro du joueur
 * @param age : âge du joueur
 * @param photo : photo du joueur
 * @returns {JSX.Element}
 * @constructor
 */
function Player({ name, number, age, photo }) {
    return (
        <div className="containerPlayer">
            <img src={photo} />
            <p><b>{name}</b></p>
            <p>numéro {number}</p>
            <p>{age} ans</p>
        </div>
    )
}

function Team({dataTeam}) {
    return (
        <div className='containerTeam' style={{ backgroundImage: `url(${dataTeam.venue.image})` }}>
            <img src={dataTeam.logo} />
            <h1><mark>&nbsp;{dataTeam.name}&nbsp;</mark></h1>
        </div>
    )
}

function Attacker({ name, number, age, photo, position }) {
    return (
        <div>
            {position === 'Attacker' && (
                <Player name={name} number={number} age={age} photo={photo} />
            )}
        </div>
    )
}

function Attackers({attackers}) {
    return (
        <div className='containerPlayers'>
            <h3>Attanquants</h3>
            <div className='players'>
                {attackers.map(player => (
                    <div key={player.number}>
                        <Attacker
                            key={player.id}
                            name={player.name}
                            number={player.number}
                            age={player.age}
                            photo={player.photo}
                            position='Attacker'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

function Defender({ name, number, age, photo, position }) {
    return (
        <div>
            {position === 'Defender' && (
                <Player name={name} number={number} age={age} photo={photo} />
            )}
        </div>
    )
}

function Defenders({defenders}) {
    return (
        <div className='containerPlayers'>
            <h3>Défenseurs</h3>
            <div className='players'>
                {defenders.map(player => (
                    <div key={player.number}>
                        <Defender
                            key={player.id}
                            name={player.name}
                            number={player.number}
                            age={player.age}
                            photo={player.photo}
                            position='Defender'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

function Midfielder({ name, number, age, photo, position }) {
    return (
        <div>
            {position === 'Midfielder' && (
                <Player name={name} number={number} age={age} photo={photo} />
            )}
        </div>
    )
}

function Midfielders({midfielders}) {
    return (
        <div className='containerPlayers'>
            <h3>Milieus</h3>
            <div className='players'>
                {midfielders.map(player => (
                    <div key={player.number}>
                        <Midfielder
                            key={player.id}
                            name={player.name}
                            number={player.number}
                            age={player.age}
                            photo={player.photo}
                            position='Midfielder'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

function Goalkeeper({ name, number, age, photo, position }) {
    return (
        <div>
            {position === 'Goalkeeper' && (
                <Player name={name} number={number} age={age} photo={photo} />
            )}
        </div>
    )
}

function Goalkeepers({goalkeepers}) {
    return (
        <div className='containerPlayers'>
            <h3>Gardiens</h3>
            <div className='players'>
                {goalkeepers.map(player => (
                    <div key={player.number}>
                        <Goalkeeper
                            name={player.name}
                            number={player.number}
                            age={player.age}
                            photo={player.photo}
                            position='Goalkeeper'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Equipe() {
    var { code } = useParams()
    const [dataTeam, setDataTeam] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const team = await teamDAO.returnTeamByCode(code)
                setDataTeam(team)
            } catch (error) {
                console.error("Error fetching teams:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [code])

    // if (!dataTeam || !dataTeam.players) {
    //     return <div>Chargement en cours...</div>;
    // }

    if (loading) {
        return <div>Chargement en cours</div>
    }

    const attackers = dataTeam.players.filter(player => player.position === 'Attacker')
    const defenders = dataTeam.players.filter(player => player.position === 'Defender')
    const midfielders = dataTeam.players.filter(player => player.position === 'Midfielder')
    const goalkeepers = dataTeam.players.filter(player => player.position === 'Goalkeeper')

    return (
        <div>
            <Team dataTeam={dataTeam}/>
            <h2>Joueurs :</h2>
            <Attackers attackers={attackers} />
            <Defenders defenders={defenders} />
            <Midfielders midfielders={midfielders} />
            <Goalkeepers goalkeepers={goalkeepers} />
        </div>
    )
}