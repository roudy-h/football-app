import { useEffect, useState } from 'react'
import './CalendrierResultats.css'
import { Link } from 'react-router-dom'
import matchDAO from "../../dao/DAOMatch.mjs"
import predictionDAO from '../../dao/predictionDAO.mjs'
import Match from './Match/Match'

/**
 * Composant CalendrierResultats : affiche les matchs et les résultats de la journée choisie
 * @returns {JSX.Element}
 * @constructor
 */
export default function CalendrierResultats() {
    const [dataMatch, setDataMatch] = useState([])
    const [day, setDay] = useState([])
    const [currentDay, setCurrentDay] = useState([])
    const [disablePrevious, setDisablePrevious] = useState(false)
    const [disableNext, setDisableNext] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchData = async (day) => {
        try {
            const match = await matchDAO.returnMatchByDay(day)
            setDataMatch(match)
        } catch (error) {
            console.error("Error fetching matches:", error)
        }
    }

    useEffect(() => {
        async function fetchDay() {
            try {
                const curentMatchDay = await matchDAO.returnCurrentMatch()
                return curentMatchDay[0].matchday
            } catch (error) {
                console.error("Error fetching day:", error)
            }
        }

        async function fetchInitialData() {
            try {
                const day = await fetchDay()
                setCurrentDay(day)
                setDay(day)
                const match = await matchDAO.returnMatchByDay(day)
                setDataMatch(match)
            } catch (error) {
                console.error("Error fetching matches:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchInitialData()
    }, [])

    useEffect(() => {
        setDisablePrevious(day <= 1)
        setDisableNext(day >= 34)
    }, [day])

    function verifyDate(previousDate, date) {
        if (previousDate !== date) {
            return date
        }
    }

    function verifyDay(day) {
        if (day < 1) return 1
        if (day > 34) return 34
        return day
    }

    if (loading) {
        return <div>Chargement en cours...</div>;
    }

    return (
        <div className='container'>
            <h1>Matchs du jour {day}</h1>
            <div className='buttons'>
                <button onClick={() => {
                    setDay(verifyDay(day - 1))
                    fetchData(verifyDay(day - 1))
                }} disabled={disablePrevious}>
                    &laquo; &nbsp; Journée précédente
                </button>

                <button onClick={() => {
                    setDay(currentDay)
                    fetchData(currentDay)
                }}>
                    Revenir à la journée actuelle ({currentDay})
                </button>

                <button onClick={() => {
                    setDay(verifyDay(day + 1))
                    fetchData(verifyDay(day + 1))
                }} disabled={disableNext}>
                    Jouréne suivante &nbsp; &raquo;
                </button>
            </div>
            <div className='matches'>
                <div>
                    {dataMatch.map((match, i) => (
                        <div key={i}>
                            {(i === 0 || verifyDate(dataMatch[i-1].date, dataMatch[i].date)) && (
                                <div className='dayDate'>{match.date}</div>
                            )}
                            <Match
                            status={match.status}
                            homeTeam={match.homeTeam.name}
                            homeTeamImg={match.homeTeam.crest}
                            awayTeam={match.awayTeam.name}
                            awayTeamImg={match.awayTeam.crest}
                            hour={match.hour}
                            score={match.score.fullTime.home + ' - ' + match.score.fullTime.away}
                            codeHome={match.homeTeam.tla}
                            codeAway={match.awayTeam.tla}
                            match={match}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}