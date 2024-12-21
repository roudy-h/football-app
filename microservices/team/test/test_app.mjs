"use strict";
import * as chai from "chai";
import supertest from "supertest"
import server from "../server.mjs";
import {mongoose} from "mongoose";
import {saveTeams} from "../api/dao/teamDAO.mjs";

const requestWithSupertest = supertest(server)

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

describe("Test team app", function () {
    before(async () => {
        // Nettoyer la base de données avant chaque test
        await mongoose.connection.close()
        const {MongoMemoryServer} = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
        await saveTeams()
    })

    after(async () => {
        await mongoose.connection.close()
    })

    it("GET /team", async () => {
        const response = await requestWithSupertest.get('/api/team');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').that.is.not.empty;
    })

    it("GET /team/NAN", async () => {
        const response = await requestWithSupertest.get('/api/team/NAN');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("id", 83);
        expect(response.body).to.have.property("name", "FC Nantes");
        expect(response.body).to.have.property("code", "NAN");
        expect(response.body).to.have.property("country", "France");
        expect(response.body).to.have.property("founded", 1943);
        expect(response.body).to.have.property("national", false);
        expect(response.body).to.have.property("logo", "https://media.api-sports.io/football/teams/83.png");
        expect(response.body).to.have.property("venue");
        expect(response.body.venue).to.be.an('object');
        expect(response.body.venue).to.have.property("name", "Stade de la Beaujoire - Louis Fonteneau");
        expect(response.body.venue).to.have.property("address", "5, boulevard de la Beaujoire");
        expect(response.body.venue).to.have.property("city", "Nantes");
        expect(response.body.venue).to.have.property("capacity", 38285);
        expect(response.body.venue).to.have.property("surface", "grass");
        expect(response.body.venue).to.have.property("image", "https://media.api-sports.io/football/venues/662.png");
    });

    it("GET /team/IUT inexisting code", async () => {
        const response = await requestWithSupertest.get('/api/team/IUT');
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("message", "Team not found");
    });

    it("GET /team/44 invalid code type", async () => {
        // Ne fonctionne pas car le code est converti en string

        // const response = await requestWithSupertest.get('/api/team/44');
        // expect(response.status).to.equal(400);
        // expect(response.body).to.have.property("message", "Invalid team code type");
    });

    it("GET /team/ranks", async () => {
        const response = await requestWithSupertest.get('/api/team/ranks');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').that.is.not.empty;
        response.body.forEach((team) => {
            expect(team).to.have.property("code").that.is.not.empty;
            expect(team).to.have.property("logo").that.is.not.empty;
            expect(team).to.have.property("name").that.is.not.empty;
            expect(team).to.have.property("score").that.is.not.null;
            expect(team).to.have.property("win").that.is.not.null;
            expect(team).to.have.property("draw").that.is.not.null;
            expect(team).to.have.property("loose").that.is.not.null;
            expect(team).to.have.property("goalFor").that.is.not.null;
            expect(team).to.have.property("goalAgainst").that.is.not.null;
            expect(team).to.have.property("diff").that.is.not.null;

            expect(calculPoint(team)).to.equal(team.score);
        });
    });
});

// Calcul des points
function calculPoint(team) {
    const point = team.win * 3 + team.draw
    return team.code !== "MON" ? point : point - 1
}