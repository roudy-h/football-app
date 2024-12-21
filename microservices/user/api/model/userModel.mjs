"use strict";

export default class User {
    firstName
    lastName
    email
    password
    constructor(obj) {
        this.firstName = obj.firstName
        this.lastName = obj.lastName
        this.email = obj.email
        this.password = obj.password
    }

    // Renvoie un objet contenant les informations de l'utilisateur
    getInfos() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email
        }
    }
}