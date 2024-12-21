"use strict";

import predictionDAO from "../dao/predictionDAO.mjs";

const predictionController = {
    findAll: async () => {
        return await predictionDAO.findAll();
    },
    add: async (prediction, accessToken) => {
        return await predictionDAO.add(prediction, accessToken);
    },
    findPredictionsByUser: async (accessToken) => {
        return await predictionDAO.findPredictionsByUser(accessToken)
    },
    findPredictionsByMatchId: async (matchId) => {
        return await predictionDAO.findPredictionsByMatchId(matchId);
    }
}

export default predictionController;