"use strict";
import * as chai from "chai";
import userDAO, {hashPassword} from "../api/dao/userDAO.mjs";
import {mongoose} from 'mongoose';

let assert = chai.assert;
let should = chai.should();
let expect = chai.expect;

describe("Test of userDAO", function () {
    before(async ()=>{
        await mongoose.connection.close()
        const {MongoMemoryServer}  = await import('mongodb-memory-server')
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri)
    })

    beforeEach(async ()=>{
        await userDAO.removeAll()
    })

    it("findAll empty", async ()=> {
        const users = await userDAO.findAll();
        expect(users).to.be.an("array").that.is.empty
    });

    it("findAll one user", async ()=> {
        const userToAdd = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            password: 'password123'
        };
        await userDAO.add(userToAdd);
        const users = await userDAO.findAll();

        expect(users).to.be.an("array").that.is.not.empty
        expect(users).to.have.lengthOf(1)

        expect(users[0].firstName).to.equal('John');
        expect(users[0].lastName).to.equal('Doe');
        expect(users[0].email).to.equal('test@example.com');
    });

    it("findAll two user", async ()=> {
        const userToAdd1 = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            password: 'password123'
        };
        await userDAO.add(userToAdd1);

        const userToAdd2 = {
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice@mail.com',
            password: 'AnotherPassword'
        };
        await userDAO.add(userToAdd2);
        const users = await userDAO.findAll();

        expect(users).to.be.an("array").that.is.not.empty
        expect(users).to.have.lengthOf(2)

        expect(users[0].firstName).to.equal('John');
        expect(users[0].lastName).to.equal('Doe');
        expect(users[0].email).to.equal('test@example.com');

        expect(users[1].firstName).to.equal('Alice');
        expect(users[1].lastName).to.equal('Smith');
        expect(users[1].email).to.equal('alice@mail.com');
    });

    it("Add and reject with bad data", () => {
        const userToAdd = {
            SAE: 4
        }
        userDAO.add(userToAdd).catch((error)=>{
            expect(error).to.equal("Not a valid user")
        });
    });

    it("Add valid user", async () => {
        const userToAdd = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            password: 'password123'
        };
        const user = await userDAO.add(userToAdd);

        expect(user.firstName).to.equal('John');
        expect(user.lastName).to.equal('Doe');
        expect(user.email).to.equal('test@example.com');
    });

    it("Add existing email", async () => {
        const userToAdd = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            password: 'password123'
        };
        await userDAO.add(userToAdd);
        userDAO.add(userToAdd).catch((error)=>{
            expect(error).to.equal("User already exists")
        });
    });

    it("Remove existing email", async () => {
        const userToAdd = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            password: 'password123'
        };
        await userDAO.add(userToAdd);
        expect(await userDAO.removeByEmail(userToAdd.email)).to.be.true;
    });

    it("Remove unexisting email", async () => {
        expect(await userDAO.removeByEmail("SAE")).to.be.false;
    });

    it("Update unexisting email", async () => {
       const user = {
           firstName: 'Alice',
           lastName: 'Smith',
           email: 'alice@mail.com',
           password: 'AnotherPassword'
       }
       userDAO.update(user).catch((error)=> {
           expect(error).to.equal("User does not exist")
       });
    });

    it("Update existing email", async () => {
        const user = {
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice@mail.com',
            password: 'AnotherPassword'
        }
        await userDAO.add(user);

        user.firstName = 'Bob';
        user.lastName = 'Brown';
        const updatedUser = await userDAO.update(user);

        expect(updatedUser.firstName).to.equal('Bob');
        expect(updatedUser.lastName).to.equal('Brown');
    });

    it("Login with existing user", async () => {
        const user = {
            firstName: 'Alice',
            lastName: 'Smith',
            email: 'alice@mail.com',
            password: 'AnotherPassword'
        }
        await userDAO.add(user);

        const userInfo = {
            email: 'alice@mail.com',
            password: 'AnotherPassword'
        }
        const loggedInUser = await userDAO.login(userInfo);
        expect(loggedInUser.email).to.equal(userInfo.email);
    });

    it("Login with unexisting user", async () => {
        const user = {
            firstName: 'Jean',
            lastName: 'Martin',
            email: 'jean.martin@mail.com',
            password: 'TheBestPassword'
        }

       userDAO.login(user).catch((error)=> {
           expect(error).to.equal("Invalid credentials")
       });
    });
});


// describe('Test de userController.findAll', () => {
//     it('Devrait renvoyer un tableau d\'utilisateurs', async () => {
//         const users = await userDAO.findAll();
//         assert(Array.isArray(users));
//     });
// });
//
// // Test de la fonction add du contrôleur d'utilisateur
// describe('Test de userDAO', () => {
//     it('Devrait ajouter un nouvel utilisateur', async () => {
//         const userToAdd = {
//             email: 'test@example.com',
//             password: 'password123',
//             firstName: 'John',
//             lastName: 'Doe'
//         };
//         const addedUser = await userDAO.add(userToAdd);
//         assert(addedUser instanceof User);
//         assert.strictEqual(addedUser.email, userToAdd.email);
//         // assert.strictEqual(addedUser.password, userToAdd.password);
//         // assert.strictEqual(addedUser.firstName, userToAdd.firstName);
//         // assert.strictEqual(addedUser.lastName, userToAdd.lastName);
//     });
//
//     it('Devrait rejeter l\'ajout si l\'utilisateur existe déjà', async () => {
//         const existingUser = {
//             email: 'existing@example.com',
//             password: 'existingPassword',
//             firstName: 'Jane',
//             lastName: 'Doe'
//         };
//         try {
//             await userDAO.add(existingUser);
//         } catch (error) {
//             assert.strictEqual(error, 'L\'utilisateur existe déjà');
//         }
//     });
// });
//
// // Test de la fonction login du contrôleur d'utilisateur
// describe('Test de userController.login', () => {
//     it('Devrait permettre à un utilisateur existant de se connecter avec les bons identifiants', async () => {
//         const userInfo = {
//             email: 'test@example.com',
//             password: 'password123'
//         };
//         const loggedInUser = await userDAO.login(userInfo);
//         assert(loggedInUser instanceof User);
//         assert.strictEqual(loggedInUser.email, userInfo.email);
//     });
//
//     it('Devrait rejeter la connexion avec des identifiants incorrects', async () => {
//         const userInfo = {
//             email: 'test@example.com',
//             password: 'wrongpassword'
//         };
//         try {
//             await userDAO.login(userInfo);
//         } catch (error) {
//             assert.strictEqual(error, 'Adresse mail ou mot de passe incorrect');
//         }
//     });
// });