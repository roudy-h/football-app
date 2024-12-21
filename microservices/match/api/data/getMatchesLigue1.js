var request = require("request")
var fs = require("fs")

// FOOTBALL DATA ORG
var apiKey = '32b0650288bd4a8abe400f8d04a3a868'

// créé un tableau de Date enter le 12/08/23 et le 18/05/24 avec 10 jours d'intervalle pour faire ensuite les requêtes
function generateDatesLigue1() {
    const startDate = new Date('2023-08-12')
    const endDate = new Date('2024-05-18')
    const dates = []

    let currentDate = startDate
    while (currentDate <= endDate) {
        const formattedDate = currentDate.toISOString().slice(0, 10)
        dates.push(formattedDate)
        currentDate.setDate(currentDate.getDate() + 10)
    }
    dates.push('2024-05-19')

    return dates
}

// fonction pour créer un fichier avec les matchs de ligue 1 pour un intervale défini (entre dateFrom et dateTo) 
function addMatch(dateFrom, dateTo, id) {
    var options = {
        method: 'GET',
        url: 'http://api.football-data.org/v4/matches',
        headers: {
            'X-Auth-Token': apiKey
        },
        qs: {
            dateFrom: dateFrom,
            dateTo: dateTo,
            competitions: '2015' // league 1
        }
    }
    
    request(options, function (error, response, body) {
        if (error) throw new Error(error)
    
        var data = JSON.parse(body)
    
        fs.writeFile(`./json/matches-ligue-1/match-${id}.json`, JSON.stringify(data, null, 2), function(err) {
            if (err) {
                console.error("Erreur lors de l'écriture du fichier :", err)
            } else {
                console.log("succès !")
            }
        })
    })
}

// appelle la fonction pour créer les fichiers des matchs pour les dates précédemments calculées
const dateArray = generateDatesLigue1()
dateArray.forEach((date, index) => {
    if (date === '2024-05-19') {
        return
    }
    addMatch(date, dateArray[index+1], index)
})

// combine tous les matchs en un seul fichier json
function combineDataLigue1() {
    const ids = []
    for (let i = 0; i<= 28; i++) {
        ids.push(i)
    }
    let jsonDataArray = []

    const jsonManquant = './json/match-manquant.json'

    // fs.readFile(jsonManquant, 'utf8', (err, data) => {
    //     if (err) {
    //         console.error("Erreur lors de la lecture du fichier :", err)
    //         return
    //     }
    //     const matchManquant = JSON.parse(data)
    //     jsonDataArray.push(matchManquant)
    // })
    const data = fs.readFileSync(jsonManquant, 'utf8')
    const matchManquant = JSON.parse(data)
    jsonDataArray.push(matchManquant)


    const uniqueMatchIds = new Set()

    ids.forEach(id => {
        const json = `json/matches-ligue-1/match-${id}.json`
        const data = fs.readFileSync(json, 'utf8')
        const jsonData = JSON.parse(data).matches

        jsonData.forEach(match => {
            if (!uniqueMatchIds.has(match.id)) {
                jsonDataArray.push(match)
                uniqueMatchIds.add(match.id)
            }
        })
    })

    jsonDataArray.forEach(match => {
        if (match.homeTeam.tla === 'RC ') {
            match.homeTeam.tla = 'RC'
        } else if (match.awayTeam.tla === 'RC ') {
            match.awayTeam.tla = 'RC'
        }
    })

    const combinedData = JSON.stringify(jsonDataArray, null, 2)

    fs.writeFile('json/matches.json', `${combinedData}`, function(err) {
        if (err) {
            console.error("Erreur lors de l'écriture du fichier combiné :", err)
        } else {
            console.log("Fichier combiné créé avec succès.")
        }
    })
}

setTimeout(() => {
    combineDataLigue1()
}, 30000)