"use strict";
import * as chai from "chai";
import Match from "../api/model/matchModel.mjs";

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

describe("Test user app", function () {
    it("create", async () => {
        // Données pour créer un objet Match
        const matchData = {
            area: { id: 2081, name: "France", code: "FRA", flag: "https://crests.football-data.org/773.svg" },
            competition: { id: 2015, name: "Ligue 1", code: "FL1", type: "LEAGUE", emblem: "https://crests.football-data.org/FL1.png" },
            season: { id: 1595, startDate: "2023-08-13T00:00:00.000Z", endDate: "2024-05-18T00:00:00.000Z", currentMatchday: 28, winner: null },
            id: 442926,
            utcDate: "2024-03-08T20:00:00Z",
            date: "08 mars 2024",
            hour: "20:00",
            status: "FINISHED",
            matchday: 25,
            stage: "REGULAR_SEASON",
            group: null,
            lastUpdated: "2024-03-10T05:21:21.000Z",
            homeTeam: { id: 522, name: "OGC Nice", shortName: "Nice", tla: "NIC", crest: "https://crests.football-data.org/522.png" },
            awayTeam: { id: 518, name: "Montpellier HSC", shortName: "Montpellier", tla: "MON", crest: "https://crests.football-data.org/518.png" },
            score: { fullTime: { home: 1, away: 2 }, halfTime: { home: 1, away: 2 }, winner: "AWAY_TEAM", duration: "REGULAR" },
            odds: { msg: "Activate Odds-Package in User-Panel to retrieve odds." },
            referees: [{ id: 43886, name: "Ruddy Buquet", type: "REFEREE", nationality: "France", _id: "6613fc9c68116659015b7870" }]
        };

        try {
            const match = new Match(matchData);

            expect(match).to.have.property('id', 442926);
            expect(match).to.have.property('utcDate', "2024-03-08T20:00:00Z");
            expect(match).to.have.property('status', "FINISHED");
        } catch (error) {
            assert.fail("Failed to create match: " + error);
        }
    });


});

