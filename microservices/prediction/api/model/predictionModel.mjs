"use strict";

let predictionId = 0;

// Represents une prédiction d'un utilisateur pour un match donné
export default class Prediction {
    id
    date
    matchId
    prediction
    userEmail
    constructor(obj) {
        if (obj.id) {
            this.id = obj.id;
        } else {
            this.id = predictionId;
            predictionId++;
        }
        this.date = obj.date;
        this.matchId = obj.matchId;
        this.prediction = obj.prediction;
        this.userEmail = obj.userEmail;
    }
    getInfos() {
        return {
            id: this.id,
            date: this.date,
            matchId: this.matchId,
            prediction: this.prediction,
        }
    }
}