"use strict";
import {mongoose} from 'mongoose';
import User from "../model/userModel.mjs";
import bcrypt from 'bcryptjs'

const schema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
})
const MongoUser = new mongoose.model('userCollection',schema)

// Fonction pour crypter un mot de passe
export async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        await Promise.reject("Error while hashing password : ", error);
    }
}

/**
 * Data Access Object (DAO) pour la gestion des utilisateurs.
 */
const userDAO = {
    /**
     * Renvoie un tableau de tous les utilisateurs.
     * @returns {Promise<Array<User>>} Une promesse résolue avec un tableau d'objets User représentant tous les utilisateurs.
     */
    findAll :async ()=> {
        const data = await MongoUser.find({})
        return data.map((user)=>new User(user))
    },

    /**
     * Renvoie un utilisateur connu par son adresse e-mail ou null s'il n'existe pas.
     * @param {string} email - L'adresse e-mail de l'utilisateur à rechercher.
     * @returns {Promise<User|null>} Une promesse résolue avec un objet User représentant l'utilisateur trouvé, ou null s'il n'existe pas.
     */
    findByEmail: async (email) => {
        const data = await MongoUser.findOne({email: email});
        return data ? new User(data).getInfos() : null;
    },

    /**
     * Ajoute un nouvel utilisateur s'il est valide et n'existe pas déjà.
     * @param {User} user - L'utilisateur à ajouter.
     * @returns {Promise<User>} Une promesse résolue avec un objet User représentant l'utilisateur ajouté.
     * @throws {string} "User already exists" si l'utilisateur existe déjà.
     * @throws {string} "Not a valid user" si l'utilisateur n'est pas valide.
     */
    add: async (user)=> {
        const userExist = await MongoUser.findOne({email: user.email});
        if(userExist){
            await Promise.reject("User already exists");
        }
        try {
            user.password = await hashPassword(user.password);
            const newUser = new MongoUser(new User(user));
            await newUser.save();
            return new User(user).getInfos();
        } catch (error) {
            await Promise.reject("Not a valid user");
        }
    },

    /**
     * Vérifie les informations de connexion de l'utilisateur.
     * @param {Object} userInfo - Les informations de connexion de l'utilisateur (email et mot de passe).
     * @returns {Promise<User>} Une promesse résolue avec un objet User représentant l'utilisateur connecté.
     * @throws {string} "Invalid credentials" si les informations de connexion sont incorrectes.
     */
    login: async (userInfo) => {
        const user = await MongoUser.findOne({email: userInfo.email});
        if (user != null) {
            const validPassword = await bcrypt.compare(userInfo.password, user.password);
            if (validPassword) {
                return new User(user).getInfos();
            }
        }
        await Promise.reject("Invalid credentials");
    },

    /**
     * Modifie les informations d'un utilisateur existant.
     * @param {User} user - L'utilisateur avec les nouvelles informations.
     * @returns {Promise<User>} Une promesse résolue avec un objet User représentant l'utilisateur modifié.
     * @throws {string} "User does not exist" si l'utilisateur n'existe pas.
     * @throws {string} "Error while updating user" si une erreur s'est produite lors de la mise à jour.
     */
    update: async(user) => {
        const userExist = await MongoUser.findOne({email: user.email});
        if(userExist){
            try {
                userExist.firstName = user.firstName;
                userExist.lastName = user.lastName;
                await userExist.save();
                return await userDAO.findByEmail(user.email);
            } catch (error) {
                await Promise.reject("Error while updating user");
            }
        } else {
            await Promise.reject("User does not exist");
        }
    },

    /**
     * Supprime un utilisateur en fonction de son adresse e-mail.
     * @param {string} email - L'adresse e-mail de l'utilisateur à supprimer.
     * @returns {boolean}
     */
    removeByEmail: async (email) => {
        const nbDeleted = await MongoUser.deleteOne({email: email});
        return nbDeleted.deletedCount === 1;
    },

    /**
     * Supprime tous les utilisateurs.
     * @returns {Promise<void>} Une promesse résolue une fois que tous les utilisateurs ont été supprimés.
     */
    removeAll: async () => {
        await MongoUser.deleteMany({});
    }
}
export default userDAO