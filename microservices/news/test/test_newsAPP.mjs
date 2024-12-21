"use strict";
import * as chai from "chai";
let expect = chai.expect;
import supertest from "supertest"
import server from "../server.mjs";
import { mongoose } from "mongoose";

import newsDao from "../api/dao/newsDAO.mjs";
const requestWithSupertest = supertest(server)

describe("Test des News", function () {

    let articleTest = {
        source: { id: "123", name: "IUT Nantes" },
        author: "Nathan H",
        title: "Article Test Title",
        description: "Roudy le cassoulet",
        url: "http://test.com/article",
        urlToImage: "http://test.com/article/image.jpg",
        publishedAt: new Date().toISOString(),
        content: "/"
    }
    
    before(async () => {
     
        await newsDao.removeAll();
        await mongoose.connection.close()
        const { MongoMemoryServer } = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
    })

    after(async () => {
        await mongoose.connection.close()
    })

    it("GET /news empty", async () => {
        const response = await requestWithSupertest.get("/api/news");
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').that.is.empty;
    });


    it("GET /news", async () => {
        await newsDao.add(articleTest)
        const response = await requestWithSupertest.get("/api/news");
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array').that.is.not.empty;
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.deep.include(articleTest);
    });

    

    
});
