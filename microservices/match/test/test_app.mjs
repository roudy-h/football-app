"use strict";
import * as chai from "chai";
import supertest from "supertest"
import server from "../server.mjs";
import {mongoose} from "mongoose";
import {matchDAO, saveMatches} from "../api/dao/matchDAO.mjs";

const requestWithSupertest = supertest(server)

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

describe("Test match app", function () {
    before(async () => {
        // Nettoyer la base de données avant chaque test
        await mongoose.connection.close()
        const {MongoMemoryServer} = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
        await saveMatches()
    })

    after(async () => {
        await mongoose.connection.close()
    })

    it("GET /match", async () => {
        const response = await requestWithSupertest.get('/api/match');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').that.is.not.empty;
    })

    it("GET /match/current", async () => {
        const response = await requestWithSupertest.get('/api/match/current');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').that.is.not.empty;
    })

    it("GET /match/day/30", async () => {
        const response = await requestWithSupertest.get('/api/match/day/30');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').that.is.not.empty;
        response.body.forEach((match) => {
           if (match.matchday !== 30) {
               assert.fail("Matchday does not match the expected value");
           }
        });
    })

    it("GET /match/442926", async () => {
        const response = await requestWithSupertest.get('/api/match/442926');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("id", 442926);
    });

    it("GET /match/616516515615611651 inexisting id", async () => {
        const response = await requestWithSupertest.get('/api/match/616516515615611651');
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("message", "Match with id 616516515615611651 does not exist");
    });

    it("GET /match/\"Un id\" invalid id type", async () => {
        const response = await requestWithSupertest.get('/api/match/Un id');
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property("message", "Invalid match ID type");
    });

    it("GET /match/day/25", async () => {
        const response = await requestWithSupertest.get('/api/match/day/25');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').that.is.not.empty;
        response.body.forEach((match) => {
            if (match.matchday !== 25) {
                assert.fail("Matchday does not match the expected value");
            }
        });
    });

    it("GET /match/day/42 invalid day", async () => {
        const response = await requestWithSupertest.get('/api/match/day/42');
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property("message", "No match found for this day");
    });

    it("GET /match/day/\"Un jour\" invalid day type", async () => {
        const response = await requestWithSupertest.get('/api/match/day/Un jour');
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property("message", "Invalid match day type");
    });
});