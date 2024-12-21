"use strict";
import * as chai from "chai";
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
import supertest from "supertest"
import server from "../server.mjs";
import {mongoose} from "mongoose";
import userDAO from "../api/dao/userDAO.mjs";
const requestWithSupertest = supertest(server)

describe("Test user app", function () {
    let userTest = {
        firstName: 'Elouan',
        lastName: 'Danilo',
        email: 'elouan.danilo@gmail.com',
        password: 'password123'
    };
    let accessToken = null;

    before(async () => {
        // Nettoyer la base de données avant chaque test
        await userDAO.removeAll();
        await mongoose.connection.close()
        const {MongoMemoryServer} = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
    })

    after(async () => {
        await mongoose.connection.close()
    })

    it("GET /user empty", async () => {
        const response = await requestWithSupertest.get('/api/user');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').that.is.empty;
    });

    it("POST /user add valid user", async () => {
        const response = await requestWithSupertest.post('/api/user').send(userTest);
        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
        expect(response.body.user).to.have.property('firstName').to.equal(userTest.firstName);
        expect(response.body.user).to.have.property('lastName').to.equal(userTest.lastName);
        expect(response.body.user).to.have.property('email').to.equal(userTest.email);
        expect(response.body).to.have.property('accessToken');
        accessToken = response.body.accessToken;
    });

    it("GET /user", async () => {
        const response = await requestWithSupertest.get('/api/user');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').that.is.not.empty;
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.have.property('firstName').to.equal(userTest.firstName);
        expect(response.body[0]).to.have.property('lastName').to.equal(userTest.lastName);
        expect(response.body[0]).to.have.property('email').to.equal(userTest.email);
    });

    it("POST /user add invalid user", async () => {
        const response = await requestWithSupertest.post('/api/user').send({
            firstName: 'Elouan',
            lastName: 'Danilo',
            email: 'le.ed@mail.com'
        });
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Error while creating user")
    });

    it("POST /user add user with existing email", async () => {
        const response = await requestWithSupertest.post('/api/user').send(userTest);
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Error while creating user")
    });

    it("POST /login with valid user", async () => {
        const response = await requestWithSupertest.post('/api/login').send({
            email: userTest.email,
            password: userTest.password
        });
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('accessToken');
        expect(response.body).to.have.property('user');
        expect(response.body.user).to.have.property('firstName').to.equal(userTest.firstName);
        expect(response.body.user).to.have.property('lastName').to.equal(userTest.lastName);
        expect(response.body.user).to.have.property('email').to.equal(userTest.email);
    });

    it("POST /login with invalid user", async () => {
        const response = await requestWithSupertest.post('/api/login').send({
            email: "jadorelestests@mail.com",
            password: "TheBestPassword"
        });
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid credentials")
    });

    it("POST /login with invalid email", async () => {
        const response = await requestWithSupertest.post('/api/login').send({
            email: "lala@me.eu",
            password: userTest.password
        });
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid credentials")
    });

    it("POST /login with invalid password", async () => {
        const response = await requestWithSupertest.post('/api/login').send({
            email: userTest.email,
            password: "TheBestPassword"
        });
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid credentials")
    });

    it("POST /login with invalid data", async () => {
        const response = await requestWithSupertest.post('/api/login').send({
            name: userTest.firstName,
            password: userTest.password
        });
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid credentials");
    });


    it("PUT /user update user", async () => {
        const response = await requestWithSupertest.put('/api/user').set('Authorization', 'Bearer ' + accessToken).send({
            firstName: 'Jean',
            lastName: 'Jacques',
            email: userTest.email
        });
        expect(response.status).to.equal(200);
        expect(response.body.user).to.have.property('firstName').to.equal('Jean');
        expect(response.body.user).to.have.property('lastName').to.equal('Jacques');
    });

    it("PUT /user update user with invalid data", async () => {
        const response = await requestWithSupertest.put('/api/user').set('Authorization', 'Bearer ' + accessToken).send({
            name: 'Jean',
            lastName: 'Jacques',
            email: userTest.email
        });
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Error while updating user")
    });

    it("PUT /user update inexistant user", async () => {
        const response = await requestWithSupertest.put('/api/user').set('Authorization', 'Bearer ' + accessToken).send({
            firstName: 'Jean',
            lastName: 'Jacques',
            email: 'lala@mail.com'
        });
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("User does not exist")
    });

    it("PUT /user update user with invalid token", async () => {
        const response = await requestWithSupertest.put('/api/user').set('Authorization', 'Bearer ' + 'invalidToken').send({
            firstName: 'Jean',
            lastName: 'Jacques',
            email: userTest.email
        });
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal("Unauthorized")
    });

    it("PUT /user update user with no token", async () => {
        const response = await requestWithSupertest.put('/api/user').send({
            firstName: 'Jean',
            lastName: 'Jacques',
            email: userTest.email
        });
        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal("Unauthorized")
    });

    it("DELETE /user remove existant user", async () => {
        const response = await requestWithSupertest.delete('/api/user').set('Authorization', 'Bearer ' + accessToken).send({
            email: userTest.email
        });
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("User deleted");
    });

    it("DELETE /user remove inexistant user", async () => {
        const response = await requestWithSupertest.delete('/api/user').set('Authorization', 'Bearer ' + accessToken).send({
            email: userTest.email
        });
        expect(response.status).to.equal(404);
        expect(response.body.message).to.equal("User does not exist");
    });
});