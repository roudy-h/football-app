"use strict";
import * as chai from "chai";
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
import supertest from "supertest"
import server from "../server.mjs";
import Team from "../api/model/teamModel.mjs";

describe("Test team model", function () {
   const team = new Team({
      id: 1,
      name: "IUT Football Club",
      code: "IUT",
      country: "France",
      founded: 2024,
      national: false,
      logo: "https://iut-fc.fr/logo.png",
      venue: {
         id: 4269,
         name: "Maréchal Joffre Stadium",
         address: "3 rue maréchal Joffre",
         city: "Nantes",
         capacity: 536,
         surface: "grass",
         image: "https://iut-fc.fr/stadium.png"
      },
      players: [
         {
            id: 4664,
            name: "P. Van Laer",
            age: 20,
            number: 10,
            position: "Goalkeeper",
            photo: "https://media.api-sports.io/football/players/51146.png"
         },
         {
            id: 6256,
            name: "B. Mary",
            age: 19,
            number: 1,
            position: "Defender",
            photo: "https://media.api-sports.io/football/players/51147.png"
         },
      ]
   })

   it("create", async ()=> {
      // Assertions
      expect(team).to.be.an('object');
      expect(team).to.have.property('id').to.equal(1);
      expect(team).to.have.property('name').to.equal('IUT Football Club');
      expect(team).to.have.property('code').to.equal('IUT');
      expect(team).to.have.property('country').to.equal('France');
      expect(team).to.have.property('founded').to.equal(2024);
      expect(team).to.have.property('national').to.equal(false);
      expect(team).to.have.property('logo').to.equal('https://iut-fc.fr/logo.png');

      // Assertions for venue
      expect(team).to.have.property('venue');
      expect(team.venue).to.be.an('object');
      expect(team.venue).to.have.property('id').to.equal(4269);
      expect(team.venue).to.have.property('name').to.equal('Maréchal Joffre Stadium');
      expect(team.venue).to.have.property('address').to.equal('3 rue maréchal Joffre');
      expect(team.venue).to.have.property('city').to.equal('Nantes');
      expect(team.venue).to.have.property('capacity').to.equal(536);
      expect(team.venue).to.have.property('surface').to.equal('grass');
      expect(team.venue).to.have.property('image').to.equal('https://iut-fc.fr/stadium.png');

      // Assertions for players
      expect(team).to.have.property('players');
      expect(team.players).to.be.an('array').that.has.lengthOf(2);
      expect(team.players[0]).to.have.property('id').to.equal(4664);
      expect(team.players[0]).to.have.property('name').to.equal('P. Van Laer');
      expect(team.players[0]).to.have.property('age').to.equal(20);
      expect(team.players[0]).to.have.property('number').to.equal(10);
      expect(team.players[0]).to.have.property('position').to.equal('Goalkeeper');
      expect(team.players[0]).to.have.property('photo').to.equal('https://media.api-sports.io/football/players/51146.png');
      expect(team.players[1]).to.have.property('id').to.equal(6256);
      expect(team.players[1]).to.have.property('name').to.equal('B. Mary');
      expect(team.players[1]).to.have.property('age').to.equal(19);
      expect(team.players[1]).to.have.property('number').to.equal(1);
      expect(team.players[1]).to.have.property('position').to.equal('Defender');
      expect(team.players[1]).to.have.property('photo').to.equal('https://media.api-sports.io/football/players/51147.png');
   });

   it("getResume", async ()=> {
      const resume = team.getResume();

      expect(resume).to.be.an('object');
      expect(resume).to.have.property('id').to.equal(1);
      expect(resume).to.have.property('name').to.equal('IUT Football Club');
      expect(resume).to.have.property('code').to.equal('IUT');
      expect(resume).to.have.property('country').to.equal('France');
      expect(resume).to.have.property('founded').to.equal(2024);
      expect(resume).to.have.property('national').to.equal(false);
      expect(resume).to.have.property('logo').to.equal('https://iut-fc.fr/logo.png');
      expect(Object.keys(resume)).to.have.lengthOf(7);
   });
});
