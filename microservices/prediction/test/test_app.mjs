"use strict";
import * as chai from "chai";
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
import supertest from "supertest"
import server from "../server.mjs";
import {mongoose} from "mongoose";
import predictionDAO from "../api/dao/predictionDAO.mjs";
import fetch from "node-fetch";
const requestWithSupertest = supertest(server)

describe("Test user app", function () {
    let accessToken;

    before(async () => {
        // Nettoyer la base de données avant chaque test
        await predictionDAO.removeAll();
        await mongoose.connection.close()
        const {MongoMemoryServer} = await import('mongodb-memory-server')
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


    after(async () => {
        await mongoose.connection.close()
    })

    it("GET /prediction empty", async () => {
        const response = await requestWithSupertest.get('/api/prediction');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').that.is.empty;
    })

    it("POST /prediction not empty", async () => {
        const prediction = {
            "matchId": 443012,
            "prediction": "home"
        };
        const response = await requestWithSupertest.post('/api/prediction')
            .send(prediction)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id').that.is.not.null;
        expect(response.body).to.have.property('matchId').to.equal(prediction.matchId);
        expect(response.body).to.have.property('prediction').to.equal(prediction.prediction);
    });

    it("POST /prediction valid prediction", async () => {
       const prediction = {
              "matchId": 443012,
              "prediction": "home"
       }

        try {
            const response = await requestWithSupertest.post('/api/prediction')
                .send(prediction)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.status).to.equal(201);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('id').that.is.not.null;
            expect(response.body).to.have.property('matchId').to.equal(prediction.matchId);
            expect(response.body).to.have.property('prediction').to.equal(prediction.prediction);
        } catch (error) {
           assert.fail("Not a valid prediction");
        }
    });

    it("POST /prediction invalid prediction", async () => {
        const prediction = {
            "matchId": 443012,
            "prediction": "invalid"
        }

        const response = await requestWithSupertest.post('/api/prediction')
            .send(prediction)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message').to.equal("Not a valid value for prediction");
    });

    it("POST /prediction invalid date", async () => {
       const prediction = {
                "matchId": 442954,
                "prediction": "home"
       }

       const response = await requestWithSupertest.post('/api/prediction')
           .send(prediction)
           .set('Authorization', `Bearer ${accessToken}`);
       expect(response.status).to.equal(400);
       expect(response.body).to.have.property('message').to.equal("Match already started");
    });

    it("POST /prediction existing prediction", async () => {
       const prediction = {
                "matchId": 443012,
                "prediction": "home"
       }

       const response = await requestWithSupertest.post('/api/prediction')
           .send(prediction)
           .set('Authorization', `Bearer ${accessToken}`);
       expect(response.status).to.equal(201);
       const response2 = await requestWithSupertest.post('/api/prediction')
           .send(prediction)
           .set('Authorization', `Bearer ${accessToken}`);
       expect(response2.status).to.equal(400);
       expect(response2.body).to.have.property('message').to.equal("User already predicted this match");
    });

    it("POST /prediction unexisting match", async () => {
        const prediction = {
                "matchId": 0,
                "prediction": "home"
       }

       const response = await requestWithSupertest.post('/api/prediction')
           .send(prediction)
           .set('Authorization', `Bearer ${accessToken}`);
       expect(response.status).to.equal(400);
       expect(response.body).to.have.property('message').to.equal("Match not found");
    });

    it("POST /prediction unexisting user", async () => {
        const prediction = {
                "matchId": 443012,
                "prediction": "home"
        }

        const response = await requestWithSupertest.post('/api/prediction')
            .send(prediction)
            .set('Authorization', `Bearer Bonjour.à.tous.les.amis`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message').to.equal("User not found");
    });

    it("GET /prediction/user", async () => {
        const prediction = {
            "matchId": 443012,
            "prediction": "home"
        }

        const response = await requestWithSupertest.post('/api/prediction')
            .send(prediction)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).to.equal(201);

        const response2 = await requestWithSupertest.get('/api/prediction/user')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response2.status).to.equal(200);
        expect(response2.body).to.be.an('array').that.is.not.empty;
        expect(response2.body).to.have.lengthOf(1);
        expect(response2.body[0]).to.have.property('id').that.is.not.null;
        expect(response2.body[0]).to.have.property('matchId').to.equal(prediction.matchId);
        expect(response2.body[0]).to.have.property('prediction').to.equal(prediction.prediction);
    });

    it("GET /prediction/user invalid token", async () => {
        const response = await requestWithSupertest.get('/api/prediction/user')
            .set('Authorization', `Bearer lalala`);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message').to.equal("User not found");
    });

    it("GET /prediction/match/:id", async () => {
        const prediction = {
            "matchId": 443012,
            "prediction": "home"
        }

        const response = await requestWithSupertest.post('/api/prediction')
            .send(prediction)
            .set('Authorization', `Bearer ${accessToken}`);
        expect(response.status).to.equal(201);

        const response2 = await requestWithSupertest.get('/api/prediction/match/443012');
        expect(response2.status).to.equal(200);
        expect(response2.body).to.be.an('array').that.is.not.empty;
        expect(response2.body).to.have.lengthOf(1);
        expect(response2.body[0]).to.have.property('id').that.is.not.null;
        expect(response2.body[0]).to.have.property('matchId').to.equal(prediction.matchId);
        expect(response2.body[0]).to.have.property('prediction').to.equal(prediction.prediction);
    });

    it("GET /prediction/match/:id invalid match", async () => {
        const response = await requestWithSupertest.get('/api/prediction/match/0');
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message').to.equal("Match not found");
    });


})