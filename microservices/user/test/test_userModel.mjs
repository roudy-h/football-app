"use strict";
import * as chai from "chai";
import User from "../api/model/userModel.mjs";

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

describe("Test du model User", function () {
    it("create", async ()=> {
        const user = new User({firstName: 'Raul', lastName: 'Durand', email: 'raul.durand@mail.com', password: '1234'})
        expect(user).to.have.property('firstName', 'Raul')
        expect(user).to.have.property('lastName', 'Durand')
        expect(user).to.have.property('email', 'raul.durand@mail.com')
        expect(user).to.have.property('password','1234')
        expect(user).to.have.all.keys('firstName', 'lastName', 'email', 'password')})
});