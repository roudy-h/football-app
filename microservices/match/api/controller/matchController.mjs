"use strict";

import {matchDAO} from "../dao/matchDAO.mjs";

const matchController = {
    // Renvoie tous les matchs de la saison
    findAllMatch: async () => {
        return await matchDAO.findAllMatch();
    },
    // Renvoie les matchs en cours ou à venir
    findCurrentMatch: async () => {
        return await matchDAO.findCurrentMatch();
    },
    // Renvoie les matchs d'une journée du championnat
    findMatchByDay: async (day) => {
        return await matchDAO.findMatchByDay(day);
    },
    // Recherche un match par son id
    findMatchById: async (id) => {
        return await matchDAO.findMatchById(id);
    }
}

export default matchController