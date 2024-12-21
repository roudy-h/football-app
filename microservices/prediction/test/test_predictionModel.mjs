"use strict";
import * as chai from "chai";
import Prediction from "../api/model/predictionModel.mjs";

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

describe("Test predictionMedel", function () {
    it("creat", async () => {
        const prediction = new Prediction({
            id: 1,
            date: new Date('2024-04-05'),
            matchId: 1,
            prediction: "home",
            userEmail: "uneAdresseMail@truc.com"
        });
        expect(prediction).to.have.property('id', 1);
        expect(prediction).to.have.property('date');
        expect(prediction.date.toISOString()).to.equal(new Date('2024-04-05').toISOString());
        expect(prediction).to.have.property('matchId', 1);
        expect(prediction).to.have.property('prediction', 'home');
        expect(prediction).to.have.property('userEmail', 'uneAdresseMail@truc.com');
    });

    it("creat without id", async () => {
        const prediction = new Prediction({
            date: new Date('2024-04-05'),
            matchId: 1,
            prediction: "home",
            userEmail: "uneAdresseMail@truc.com"
        });
        expect(prediction).to.have.property('id');
        expect(prediction).to.have.property('date');
        expect(prediction.date.toISOString()).to.equal(new Date('2024-04-05').toISOString());
        expect(prediction).to.have.property('matchId', 1);
        expect(prediction).to.have.property('prediction', 'home');
        expect(prediction).to.have.property('userEmail', 'uneAdresseMail@truc.com');
    });

    it("getInfos", async () => {
        const prediction = new Prediction({
            id: 1,
            date: new Date('2024-04-05'),
            matchId: 1,
            prediction: "home",
            userEmail: "uneAdresseMail@truc.com"
        });
        const predictionInfos = prediction.getInfos();
        expect(predictionInfos).to.have.property('id', 1);
        expect(predictionInfos).to.have.property('date');
        expect(predictionInfos.date.toISOString()).to.equal(new Date('2024-04-05').toISOString());
        expect(predictionInfos).to.have.property('matchId', 1);
        expect(predictionInfos).to.have.property('prediction', 'home');
        expect(predictionInfos).to.not.have.property('userEmail');
    });
});
