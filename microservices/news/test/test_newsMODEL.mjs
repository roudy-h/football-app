"use strict";
import * as chai from "chai";
let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;
import supertest from "supertest"
import server from "../server.mjs";
import Article from "../api/model/newsModel.mjs";

describe("Test News model", function () {
    const nouvelle_news = new Article({
        source: "IUT Football Club",
        author: "Nathan Hequet",
        title: "IUT Football Club: Le commencement",
        description: "C'est une équipe à en couper le souffle !",
        url: "https://testNews/article",
        urlToImage: "https://testNews/image.jpg",
        publishedAt: "2024-04-09T08:00:00Z",
        content: "Je teste la fonction Modèl de News"
    });
 
    it("Create Article Object", function () {
       expect(nouvelle_news).to.be.an.instanceOf(Article);
    });
 
    it("Correct source", function () {
       expect(nouvelle_news.source).to.equal("IUT Football Club");
    });
 
    it("Correct author", function () {
       expect(nouvelle_news.author).to.equal("Nathan Hequet");
    });
 
    it("sCorrect title", function () {
       expect(nouvelle_news.title).to.equal("IUT Football Club: Le commencement");
    });
 
    it("Correct description", function () {
       expect(nouvelle_news.description).to.equal("C'est une équipe à en couper le souffle !");
    });
 
    it("Correct URL", function () {
       expect(nouvelle_news.url).to.equal("https://testNews/article");
    });
 
    it("Correct URL to image", function () {
       expect(nouvelle_news.urlToImage).to.equal("https://testNews/image.jpg");
    });
 
    it("Correct publish date", function () {
       expect(nouvelle_news.publishedAt).to.equal("2024-04-09T08:00:00Z");
    });
 
    it("Correct content", function () {
       expect(nouvelle_news.content).to.equal("Je teste la fonction Modèl de News");
    });
});
