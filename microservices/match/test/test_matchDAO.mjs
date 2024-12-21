"use strict";

import mongoose from 'mongoose';
import {matchDAO, saveMatches} from "../api/dao/matchDAO.mjs";
import * as chai from "chai";

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

describe("Test matchDAO", async () => {

    before(async () => {
        await mongoose.connection.close()
        const {MongoMemoryServer} = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
        await saveMatches()
    })

    it("findAll", async () => {
       const matchs = await matchDAO.findAllMatch()
        expect(matchs).to.be.not.empty;
    });

    it("findCurrentMatch", async () => {
        const matchs = await matchDAO.findCurrentMatch()
        matchs.forEach((match) => {
            if (match.matchday !== match.season.currentMatchday) {
                assert.fail("Matchday does not match the current matchday of the season");
            }
        })
    })

    it("findMatchById valid id", async () => {
        const match = await matchDAO.findMatchById(442926)
        expect(match).to.have.property("id", 442926)
    });

    it("findMatchById invalid id", async () => {
        const matchs = await matchDAO.findMatchById(6415641654156416456416416)
        expect(matchs).to.be.equal(null)
    });

    it("findMatchById invalid id type", async () => {
        try {
            const matchs = await matchDAO.findMatchById("Un id")
            assert.fail("Invalid match id type")
        } catch (e) {
            expect(e).to.equal("Invalid match ID type")
        }
    });

    it("findMatchByDay valid day", async () => {
        const matchs = await matchDAO.findMatchByDay(30)
        matchs.forEach((match) => {
            if (match.matchday !== 30) {
                assert.fail("Matchday does not match the expected value");
            }
        })
    })

    it("findMatchByDay invalid day +", async () => {
        try {
            const matchs = await matchDAO.findMatchByDay(42)
            assert.fail("No match found for this day")
        } catch (e) {
            expect(e).to.equal("No match found for this day")
        }
    });

    it("findMatchByDay invalid day -", async () => {
        try {
            const matchs = await matchDAO.findMatchByDay(-42)
            assert.fail("No match found for this day")
        } catch (e) {
            expect(e).to.equal("No match found for this day")
        }
    });

    it("findMatchByDay invalid day type", async () => {
        try {
            const matchs = await matchDAO.findMatchByDay("Un jour");
            assert.fail("Invalid day type")
        } catch (e) {
            expect(e).to.equal("Invalid match day type")
        }
    });
});