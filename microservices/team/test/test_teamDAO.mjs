"use strict";
import * as chai from "chai";
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
import teamDAO, {saveTeams} from "../api/dao/teamDAO.mjs";
import mongoose from "mongoose";

describe("Test team DAO", function () {
    before(async () => {
        await mongoose.connection.close()
        const {MongoMemoryServer} = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
        await saveTeams()
    })

    it("find all teams", async () => {
        const teams = await teamDAO.findAll();
        expect(teams).to.be.an('array').that.is.not.empty
        expect(teams).to.have.lengthOf(18);
        expect(teams[0]).to.have.property('id').that.is.not.null;
        expect(teams[0]).to.have.property('name').that.is.not.empty;
        expect(teams[0]).to.have.property('code').that.is.not.empty;
        expect(teams[0]).to.have.property('country').that.is.not.empty;
        expect(teams[0]).to.have.property('founded').that.is.not.null;
        expect(teams[0]).to.have.property('national').that.is.not.null;
        expect(teams[0]).to.have.property('logo').that.is.not.empty;
    });

    it("findTeamByCode", async () => {
        const fcNantes = await teamDAO.findTeamByCode("NAN");

        expect(fcNantes).to.be.an('object');
        expect(fcNantes).to.have.property('id').to.equal(83);
        expect(fcNantes).to.have.property('name').to.equal('FC Nantes');
        expect(fcNantes).to.have.property('code').to.equal('NAN');
        expect(fcNantes).to.have.property('country').to.equal('France');
        expect(fcNantes).to.have.property('founded').to.equal(1943);
        expect(fcNantes).to.have.property('national').to.equal(false);
        expect(fcNantes).to.have.property('logo').to.equal('https://media.api-sports.io/football/teams/83.png');
        expect(fcNantes).to.have.property('venue');
        expect(fcNantes.venue).to.be.an('object');
        expect(fcNantes.venue).to.have.property('name').to.equal('Stade de la Beaujoire - Louis Fonteneau');
        expect(fcNantes.venue).to.have.property('address').to.equal('5, boulevard de la Beaujoire');
        expect(fcNantes.venue).to.have.property('city').to.equal('Nantes');
        expect(fcNantes.venue).to.have.property('capacity').to.equal(38285);
        expect(fcNantes.venue).to.have.property('surface').to.equal('grass');
        expect(fcNantes.venue).to.have.property('image').to.equal('https://media.api-sports.io/football/venues/662.png');
    });

    it("findTeamByCode code not found", async () => {
        const team = await teamDAO.findTeamByCode("IUT");
        expect(team).to.be.null;
    });

    it("findTeamByCode code invalid code", async () => {
        try {
            const team = await teamDAO.findTeamByCode({code: "IUT"});
            assert.fail("Invalid team code");
        } catch (e) {
            expect(e).to.equal("Invalid team code type");
        }
    });

    it("findRank", async () => {
        const rank = await teamDAO.findRank();
        expect(rank).to.be.an('array').that.is.not.empty;
        expect(rank).to.have.lengthOf(18);
        rank.forEach((team, index) => {
            expect(calculPoint(team)).to.equal(team.score);
        });
    });
});

// Calcul des points
function calculPoint(team) {
    const point = team.win * 3 + team.draw;
    return team.code !== "MON" ? point : point - 1;
}