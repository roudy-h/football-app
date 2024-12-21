"use strict";
import * as chai from "chai";
import { mongoose } from 'mongoose';
import fetch from "node-fetch";
import predictionDAO from "../api/dao/predictionDAO.mjs";

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

describe("Test predictionDAO", async () => {
    let accessToken;

    before(async () => {
        await mongoose.connection.close()
        const { MongoMemoryServer } = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
    })

    beforeEach(async () => {
        await predictionDAO.removeAll()
        const user = {
            "firstName": "Bob",
            "lastName": "Dupont",
            "email": "bob@mail.com",
            "password": "pass"
        };

        try {
            const response = await fetch("http://localhost:8050/api/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                const data = await response.json();
                accessToken = data.accessToken; // Correction : assigner la valeur accessToken reçue
            } else {
                console.log(response.statusText)
                throw new Error("Impossible de créer l'utilisateur");
            }
        } catch (error) {
            console.error("Erreur lors de la création de l'utilisateur de test :", error);
            throw error;
        }
    })

    afterEach(async () => {
        try {
            const response = await fetch("http://localhost:8050/api/user", {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                expect(data).to.have.property('message', 'User deleted');
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la suppression de l'utilisateur : ", error);
        }
    })

    it("findAll", async () => {
        const prediction1 = {
            "matchId": 443012,
            "prediction": "home"
        };

        const prediction2 = {
            "matchId": 443004,
            "prediction": "draw"
        };

        try {
            // Ajoutez deux prédictions pour tester findAll
            await predictionDAO.add(prediction1, accessToken);
            await predictionDAO.add(prediction2, accessToken);

            // Récupérez toutes les prédictions
            const predictions = await predictionDAO.findAll();

            // Assurez-vous que le résultat est un tableau de la longueur attendue
            expect(predictions).to.be.an('array').with.lengthOf(2);

            // Vérifiez que toutes les prédictions contiennent les propriétés attendues
            predictions.forEach(prediction => {
                expect(prediction).to.have.property('date');
                expect(prediction).to.have.property('matchId');
                expect(prediction).to.have.property('prediction');
            });

        } catch (e) {
            assert.fail("Failed to retrieve predictions: " + e);
        }
    });


    it("add valid prediction", async () => {
        const prediction = {
            "matchId": 443012,
            "prediction": "home"
        };

        try {
            const response = await predictionDAO.add(prediction, accessToken)
            expect(response).to.have.property('date');
            expect(response).to.have.property('matchId', 443012);
            expect(response).to.have.property('prediction', 'home');
        } catch (e) {
            assert.fail("Prediction addition failed : " + e);
        }
    });

    it("add invalid prediction", async () => {
        const prediction = {
            "matchId": 443012,
            "prediction": "invalid"
        };
        try {
            const response = await predictionDAO.add(prediction, accessToken)
            assert.fail("Prediction addition failed");
        } catch (e) {
            expect(e).to.equal("Not a valid value for prediction");
        }
    });

    it("add prediction invalid date", async () => {
        const prediction = {
            "matchId": 442954,
            "prediction": "invalid"
        };
        try {
            const response = await predictionDAO.add(prediction, accessToken)
            assert.fail("Prediction addition failed");
        } catch (e) {
            expect(e).to.equal("Match already started");
        }
    });

    it("add existing prediction", async () => {
        const prediction = {
            "matchId": 443012,
            "prediction": "home"
        };

        try {
            await predictionDAO.add(prediction, accessToken)
            await predictionDAO.add(prediction, accessToken)
            assert.fail("Prediction addition failed");
        } catch (e) {
            expect(e).to.equal("User already predicted this match");
        }
    });

    it("add prediction unexisting match", async () => {
        const prediction = {
            "matchId": 101010101010101010101010,
            "prediction": "home"
        };

        try {
            await predictionDAO.add(prediction, accessToken)
            assert.fail("Prediction addition failed");
        } catch (e) {
            expect(e).to.equal("Match not found");
        }
    });

    it("add prediction unexisting user", async () => {
        const prediction = {
            "matchId": 443012,
            "prediction": "home"
        };

        try {
            await predictionDAO.add(prediction, "lalala")
            assert.fail("Prediction addition failed");
        } catch (e) {
            expect(e).to.equal("User not found");
        }
    });

    it("findPredictionsByUser", async () => {
        const prediction1 = {
            "matchId": 443012,
            "prediction": "home"
        };

        const prediction2 = {
            "matchId": 443004,
            "prediction": "draw"
        };

        try {
            // Ajoutez deux prédictions pour tester findPredictionsByUser
            await predictionDAO.add(prediction1, accessToken);
            await predictionDAO.add(prediction2, accessToken);

            // Récupérez les prédictions de l'utilisateur
            const userPredictions = await predictionDAO.findPredictionsByUser(accessToken);

            // Assurez-vous que le résultat est un tableau non vide
            expect(userPredictions).to.be.an('array').that.is.not.empty;

            // Vérifiez que le tableau de prédictions de l'utilisateur contient les prédictions attendues
            const predictionIds = userPredictions.map(prediction => prediction.matchId);
            expect(predictionIds).to.include(prediction1.matchId);
            expect(predictionIds).to.include(prediction2.matchId);

            // Assurez-vous que le tableau de prédictions de l'utilisateur a la longueur attendue
            expect(userPredictions).to.have.lengthOf(2); // Vous pouvez remplacer 2 par la longueur attendue

            // Vérifiez que toutes les prédictions de l'utilisateur contiennent les propriétés attendues
            userPredictions.forEach(prediction => {
                expect(prediction).to.have.property('date');
                expect(prediction).to.have.property('matchId');
                expect(prediction).to.have.property('prediction');
            });
        } catch (e) {
            assert.fail("Failed to retrieve user predictions: " + e);
        }
    });

    it("findPredictionsByUser invalid user", async () => {
        try {
            const predictions = await predictionDAO.findPredictionsByUser("lalala")
            assert.fail("Prediction addition failed");
        } catch (e) {
            expect(e).to.equal("User not found");
        }
    });

    it("findPredictionsByMatchId valid match id", async () => {
        const prediction = {
            matchId: 443012,
            prediction: "home"
        };

        try {
            // Ajoutez une prédiction pour le match spécifié
            await predictionDAO.add(prediction, accessToken);

            // Récupérez les prédictions pour le match spécifié
            const predictions = await predictionDAO.findPredictionsByMatchId(prediction.matchId);

            // Assurez-vous que le résultat est un tableau non vide
            expect(predictions).to.be.an('array').that.is.not.empty;

            expect(predictions).to.have.lengthOf(1);
            expect(predictions[0].prediction).to.equal(prediction.prediction);

        } catch (e) {
            assert.fail("Failed to retrieve predictions by match ID: " + e);
        }
    });

    it("findPredictionsByMatchId invalid match id", async () => {
        try {
            const predictions = await predictionDAO.findPredictionsByMatchId(10000000000000000000000000)
            assert.fail("Prediction addition failed");
        } catch (e) {
            expect(e).to.equal("Match not found");
        }
    })
});
