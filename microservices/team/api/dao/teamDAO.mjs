"use strict";
import fs from "fs";
import Team from "../model/teamModel.mjs";
import {mongoose} from "mongoose";

// Schéma de données des équipes
const schema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    country: { type: String, required: true },
    founded: { type: Number, required: true },
    national: { type: Boolean, required: true },
    logo: { type: String, required: true },
    venue: { type: Object, required: true },
    players: { type: Array, required: true }
});


// Modèle de données des matchs
const MongoTeam = mongoose.model('teamCollection', schema);

function read() {
    return new Promise((resolve, reject) => {
        fs.readFile('api/data/json/teams.json', 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

// Fonction asynchrone pour sauvegarder les équipes dans la base de données
export async function saveTeams() {
    try {
        const teams = await read();
        for (const team of teams) {
            const newTeam = new MongoTeam(new Team({
                id : team.team.id,
                name : team.team.name,
                code : team.team.newCodes,
                country : team.team.country,
                founded : team.team.founded,
                national : team.team.national,
                logo : team.team.logo,
                venue : team.venue,
                players : team.players
            }));
            await newTeam.save();
        }
        console.log("Tous les équipes ont été sauvegardés avec succès.");
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des matchs:", error);
    }
}

await saveTeams();

// fonction pour créer le classement

async function getClassement() {
    const res = await fetch("http://localhost:8010/api/match")
    const dataMatch = await res.json()
    const dataTeam = await teamDAO.findAll()

    const classement = []

    const matchFinished = []
    dataMatch.forEach(match => {
        if (match.status === 'FINISHED') {
            matchFinished.push(match)
        }
    })

    // récupérer les équipes
    dataTeam.forEach(team => {
        classement.push({code: team.code, logo: team.logo, name: team.name, score : 0, win: 0, draw: 0, loose: 0, goalFor: 0, goalAgainst: 0, diff: 0})
    })

    // faire le classement
    dataTeam.forEach((team, index) => {
        dataMatch.forEach(match => {
            const homeMatch = match.homeTeam.tla === team.code
            const awayMatch = match.awayTeam.tla === team.code
            const winner = match.score.winner

            if (homeMatch || awayMatch) {
                classement[index].goalFor += homeMatch ? match.score.fullTime.home : match.score.fullTime.away
                classement[index].goalAgainst += homeMatch ? match.score.fullTime.away : match.score.fullTime.home
                classement[index].diff += homeMatch ? match.score.fullTime.home - match.score.fullTime.away : match.score.fullTime.away - match.score.fullTime.home

                if (winner === 'HOME_TEAM' && homeMatch || winner === 'AWAY_TEAM' && awayMatch) {
                    classement[index].win += 1
                    classement[index].score += 3
                } else if (winner === 'AWAY_TEAM' && homeMatch || winner === 'HOME_TEAM' && awayMatch) {
                    classement[index].loose += 1
                } else if (winner === 'DRAW') {
                    classement[index].draw += 1
                    classement[index].score += 1
                }
            }
        })
    })

    // trier le classement selon les points
    classement.sort(function (a, b) {
        return b.score - a.score;
    })

    // enlever 1 pt à montpelier car pénalité
    classement.forEach(team => {
        if (team.code === 'MON') {
            team.score -= 1
        }
    });

    return classement
}


const teamDAO = {
    // Renvoie la liste des équipes simplifiée
    findAll: async () => {
        const teams = await MongoTeam.find({})
        return teams.map(team => new Team(team).getResume())
    },
    // Renvoie les informations détaillées d'une équipe en fonction de son code
    findTeamByCode: async (code) => {
        try {
            const team = await MongoTeam.findOne({code: code})
            return team ? new Team(team) : null
        } catch (e) {
            return Promise.reject("Invalid team code type")
        }
    },
    // Renvoie le classement des équipes
    findRank: async () => {
        return await getClassement()
    },
}

export default teamDAO