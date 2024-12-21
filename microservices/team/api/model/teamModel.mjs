"use strict";
export default class Team {
    id
    name
    code
    country
    founded
    national
    logo
    venue
    players
    constructor(obj) {
        this.id = obj.id
        this.name = obj.name
        this.code = obj.code
        this.country = obj.country
        this.founded = obj.founded
        this.national = obj.national
        this.logo = obj.logo
        this.venue = obj.venue
        this.players = obj.players
    }

    getResume() {
        return {
            id: this.id,
            name: this.name,
            code: this.code,
            country: this.country,
            founded: this.founded,
            national: this.national,
            logo: this.logo
        }
    }
}