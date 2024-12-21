export default class Match {
    area
    competition
    season
    id
    utcDate
    date
    hour
    status
    matchday
    stage
    group
    lastUpdated
    homeTeam
    awayTeam
    score
    odds
    referees
    constructor(obj) {
        this.area = obj.area
        this.competition = obj.competition
        this.season = obj.season
        this.id = obj.id
        this.utcDate = obj.utcDate
        this.date = convertDate(obj.utcDate)
        this.hour = convertHour(obj.utcDate)
        this.status = obj.status
        this.matchday = obj.matchday
        this.stage = obj.stage
        this.group = obj.group
        this.lastUpdated = obj.lastUpdated
        this.homeTeam = obj.homeTeam
        this.awayTeam = obj.awayTeam
        this.score = obj.score
        this.odds = obj.odds
        this.referees = obj.referees
    }
}

function convertDate(date) {
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'décembre']
    const dix = date.substring(0, 10);
    let [annee, unmois, jour] = dix.split('-')
    unmois = unmois - 1
    return `${jour} ${mois[unmois]} ${annee}`
}

function convertHour(hour) {
    return hour.substring(11, 16) === '00:00' ? '-- : --' : hour.substring(11, 16)
}