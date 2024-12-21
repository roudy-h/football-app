"use strict";

import teamDAO from "../dao/teamDAO.mjs";

const teamController = {
    // Renvoyer toutes les équipes
    findAll: async () => {
        return await teamDAO.findAll();
    },
    // Renvoyer une équipe par son code
    findTeamByCode: async (code) => {
        return await teamDAO.findTeamByCode(code);
    },
    findRank: async () => {
        return teamDAO.findRank();
    },
}

export default teamController;