"use strict";

import {mongoose} from "mongoose";
import Prediction from "../model/predictionModel.mjs";
import fetch from 'node-fetch';

const schema = new mongoose.Schema({
    id: {type: Number, required: true},
    date: {type: Date, required: true},
    matchId: {type: Number, required: true},
    prediction: {type: String, required: true},
    userEmail: {type: String, required: true}
});

const MongoPrediction = new mongoose.model("predictionCollection", schema);

/**
 * Récupère les informations de l'utilisateur à partir de son token d'accès.
 * @param accessToken
 * @returns {Promise<unknown>}
 */
async function getUser(accessToken) {
    const response = await fetch("http://localhost:8050/api/account", {
        headers: {authorization: "Bearer " + accessToken},
    });
    if (response.ok) {
        return await response.json();
    } else {
        return Promise.reject("User not found");
    }
}

/**
 * Data Access Object (DAO) pour la gestion des prédictions.
 */
const predictionDAO = {
    /**
     * Renvoie un tableau de toutes les prédictions.
     * @returns {Promise<Prediction>}
     */
    findAll: async () => {
        const data = await MongoPrediction.find({});
        return data.map((prediction) => new Prediction(prediction).getInfos());
    },

    /**
     * Renvoie une prédiction connue par son identifiant ou null si elle n'existe pas.
     * @param id
     * @returns {Promise<Prediction|null>}
     */
    findById: async (id) => {
        const data = await MongoPrediction.findOne({id: id});
        return data ? new Prediction(data).getInfos() : null;
    },

    /**
     * Ajoute une nouvelle prédiction si elle est valide et n'existe pas déjà.
     * @param prediction
     * @param accessToken
     * @returns {Promise<Prediction|null>}
     * @throws {string} "Match not found" si le match n'existe pas.
     * @throws {string} "User already predicted this match" si l'utilisateur a déjà prédit ce match.
     * @throws {string} "Match already started" si le match a déjà commencé.
     * @throws {string} "Not a valid prediction" si la prédiction n'est pas valide.
     * @throws {string} "Not a valid value for prediction" si la valeur de la prédiction n'est pas valide.
     */
    add: async (prediction, accessToken) => {
        let match = null
        const user = await getUser(accessToken);
        try {
            const respense = await fetch(`http://localhost:8010/api/match/${prediction.matchId}`);
            if (respense.ok) {
                match = await respense.json();
            } else {
                return Promise.reject("Match not found");
            }
        } catch (e) {
            return Promise.reject("API error : ", e);
        }
        if (await predictionDAO.userHavePredicted(user.email, prediction.matchId) != null) {
            return Promise.reject("User already predicted this match");
        } else if (new Date(match.utcDate).getTime() < new Date().getTime()) {
            return Promise.reject("Match already started");
        } else if (prediction.prediction &&
                    (prediction.prediction === "home" ||
                    prediction.prediction === "draw" ||
                    prediction.prediction === "away")) {
            try {
                const predictionAdd = new Prediction({
                    date: new Date(),
                    prediction: prediction.prediction,
                    matchId: prediction.matchId,
                    userEmail: user.email
                })
                const newPrediction = new MongoPrediction(predictionAdd);
                await newPrediction.save();
                return await predictionDAO.findById(predictionAdd.id);
            } catch (error) {
                return Promise.reject("Not a valid prediction");
            }
        } else {
            return Promise.reject("Not a valid value for prediction");
        }
    },

    /**
     * Renvoie un tableau de toutes les prédictions d'un utilisateur à partir de son token d'accès.
     * @param accessToken
     * @returns {Promise<*>}
     */
    findPredictionsByUser: async (accessToken) => {
        const user = await getUser(accessToken);
        const data = await MongoPrediction.find({userEmail: user.email});
        return data.map((prediction) => new Prediction(prediction).getInfos());
    },

    /**
     * Renvoie un tableau de toutes les prédictions d'un match.
     * @param matchId
     * @returns {Promise<*>}
     * @throws {string} "Match not found" si le match n'existe pas.
     */
    findPredictionsByMatchId: async (matchId) => {
        let match = null
        try {
            const respense = await fetch(`http://localhost:8010/api/match/${matchId}`)
            if (respense.ok) {
                match = await respense.json();
            } else {
                return Promise.reject("Match not found");
            }
        } catch (e) {
            return Promise.reject("match API error : ", e);
        }
        const data = await MongoPrediction.find({matchId: match.id});
        return data.map((prediction) => new Prediction(prediction).getInfos());
    },

    /**
     * Vérifie si un utilisateur a déjà prédit un match.
     * @param email
     * @param matchId
     * @returns {Promise<*>}
     */
    userHavePredicted: async (email, matchId) => {
        return await MongoPrediction.findOne({userEmail: email, matchId: matchId})
    },

    /**
     * Supprime toutes les prédictions.
     * @returns {Promise<void>}
     */
    removeAll: async () => {
        await MongoPrediction.deleteMany()
    }
}

export default predictionDAO;