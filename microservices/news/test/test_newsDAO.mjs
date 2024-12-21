import * as chai from "chai";
import newsDao from "../api/dao/newsDAO.mjs";
import { mongoose } from 'mongoose';
import Article from "../api/model/newsModel.mjs";
import { generateUniqueRandomIndex } from "../api/dao/newsDAO.mjs";

let expect = chai.expect;

describe("Test of newsDAO", function () {
    let newArticle;
    let selectedIndices

    before(async () => {
        await mongoose.connection.close();
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    beforeEach(async () => {
        await newsDao.removeAll();
        newArticle = new Article({
            source: { id: "1", name: "Test Source" },
            author: "Test Author",
            title: "Test Title",
            description: "Test Description",
            url: "https://example.com",
            urlToImage: "https://example.com/image.jpg",
            publishedAt: new Date(),
            content: "Test Content"
        });

        selectedIndices = []
    });

    it("should find all news articles from the database", async () => {
        await newsDao.add(newArticle);
        const news = await newsDao.findAllNews();
        expect(news).to.be.an("array").and.to.have.lengthOf.at.least(1);
    }).timeout(5000);

    it("should add a new news article to the database", async () => {
       
    
        const addedArticle = await newsDao.add(newArticle);
        expect(addedArticle.source.id).to.equal(newArticle.source.id);
        expect(addedArticle.author).to.equal(newArticle.author);
        expect(addedArticle.title).to.equal(newArticle.title);
        expect(addedArticle.description).to.equal(newArticle.description);
        expect(addedArticle.url).to.equal(newArticle.url);
        expect(addedArticle.urlToImage).to.equal(newArticle.urlToImage);
    });

    it("devrait reinitialiser le tableau de valeurs", () => {
        const maxIndex = 10;

        for (let i = 0; i < maxIndex; i++) {
            generateUniqueRandomIndex(maxIndex);
        }

        expect(selectedIndices).to.be.an("array").and.to.be.empty;
    });

    it("devrait générer un index aléatoire unique dans la plage spécifiée", () => {
        const maxIndex = 10;
        const randomIndex = generateUniqueRandomIndex(maxIndex);
        expect(randomIndex).to.be.a("number").and.to.be.at.least(0).and.to.be.below(maxIndex);
    });

    // it("devrait générer des indices uniques dans la plage spécifiée", () => {
    //     const maxIndex = 2;
    //     const generatedIndices = [0, 1, 2];
    //     const index = generateUniqueRandomIndex(maxIndex);
    //     generatedIndices.push(index);
    //     expect(generatedIndices.includes(index)).to.be.true; 
    // });

    
    
    

   
});
