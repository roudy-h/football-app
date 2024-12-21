"use strict";
import fetch from 'node-fetch';
import fs from 'fs';
import mongoose from "mongoose";
import Match from "../model/matchModel.mjs";

// Schéma de données des matchs
const schema = new mongoose.Schema({
    area: {
        id: { type: Number, rqeuired: true },
        name: { type: String, required: true },
        code: { type: String, required: true },
        flag: { type: String, required: true }
    },
    competition: {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        code: { type: String, required: true },
        type: { type: String, required: true },
        emblem: { type: String, required: true }
    },
    season: {
        id: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        currentMatchday: { type: Number, required: true },
        winner: { type: Object }
    },
    id: { type: Number, required: true },
    utcDate: { type: String, required: true },
    status: { type: String, required: true },
    matchday: { type: Number, required: true },
    stage: { type: String, required: true },
    group: { type: String },
    lastUpdated: { type: Date, required: true },
    homeTeam: {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        shortName: { type: String, required: true },
        tla: { type: String, required: true },
        crest: { type: String, required: true }
    },
    awayTeam: {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        shortName: { type: String, required: true },
        tla: { type: String, required: true },
        crest: { type: String, required: true }
    },
    score: {
        winner: { type: String },
        duration: { type: String, required: true },
        fullTime: { home: { type: Number }, away: { type: Number } },
        halfTime: { home: { type: Number }, away: { type: Number } }
    },
    odds: { msg: {} },
    referees: [
        {
            id: { type: Number, required: true },
            name: { type: String, required: true },
            type: { type: String, required: true },
            nationality: { type: String, required: true }
        }
    ]
});


// Modèle de données des matchs
const MongoMatch = mongoose.model('matchesCollection', schema);

// Fonction pour lire les données des matchs depuis le fichier
function read() {
    return new Promise((resolve, reject) => {
        fs.readFile('api/data/json/matches.json', 'utf-8', (err, data) => {
            if (err) {
                console.log("erreur:", err);
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

// Fonction asynchrone pour sauvegarder les matchs dans la base de données
export async function saveMatches() {
    try {
        const matches = await read();
        for (const match of matches) {
            const newMatch = new MongoMatch(new Match(match));
            await newMatch.save();
        }
        console.log("Tous les matchs ont été sauvegardés avec succès.");
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des matchs:", error);
    }
}

// Appel de la fonction pour sauvegarder les matchs
saveMatches();

/**
 * Objet d'Accès aux Données (DAO) des matchs pour récupérer des informations sur les matchs.
 */
export const matchDAO = {
    /**
     * Récupère tous les matchs de la saison actuelle.
     * @returns {Promise<Array<Match>>} Une promesse qui résout à un tableau d'objets Match représentant tous les matchs de la saison actuelle.
     */
    findAllMatch: async () => {
        const matches = await MongoMatch.find({})
        return matches.map(match => new Match(match))
    },

    /**
     * Récupère les matchs en cours ou programmés pour le futur.
     * @returns {Promise<Array<Match>>} Une promesse qui résout à un tableau d'objets Match représentant les matchs en cours ou à venir.
     */
    findCurrentMatch: async () => {
        const matches = await MongoMatch.find({});
        const matchFind =  matches.filter((match) => match.matchday === match.season.currentMatchday)
        return matchFind.map(match => new Match(match))
    },

    /**
     * Récupère les matchs pour un jour spécifique du championnat.
     * @param {number} day - Le jour du championnat pour lequel les matchs doivent être récupérés.
     * @returns {Promise<Array<Match>>} Une promesse qui résout à un tableau d'objets Match représentant les matchs du jour spécifié.
     * @throws {string} "No match found for this day" si aucun match n'est trouvé pour le jour spécifié.
     * @throws {string} "Invalid match day type" si le jour spécifié n'est pas un nombre.
     */
    findMatchByDay: async (day) =>  {
        try {
            const matches = await MongoMatch.find({matchday: day})
            if (matches.length === 0) {
                return Promise.reject("No match found for this day")
            }
            return matches.map(match => new Match(match))
        } catch (e) {
            return Promise.reject("Invalid match day type")
        }
    },

    /**
     * Récupère un match par son identifiant.
     * @param {string} id - L'identifiant du match à récupérer.
     * @returns {Promise<Match|null>} Une promesse qui résout à un objet Match s'il est trouvé, ou null s'il n'y a pas de match avec l'identifiant spécifié.
     * @throws {string} "Invalid match ID type" si l'identifiant spécifié n'est pas un nombre.
     */
    findMatchById: async (id) => {
        try {
            const match = await MongoMatch.findOne({ id: id });
            return match ? new Match(match) : null;
        } catch (error) {
            return Promise.reject("Invalid match ID type")
        }
    }
}