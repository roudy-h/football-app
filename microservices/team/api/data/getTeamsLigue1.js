var request = require("request")
var fs = require("fs")

// FOOTBALL API SPORT
apiKey = '005bbbd144507060761aa671f298dc55' // (clé de Roudy)

// ajoute dans un fichier JSON toutes les équipes de ligue 1
function getTeams() {
    var options = {
        method: 'GET',
        url: 'https://v3.football.api-sports.io/teams',
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': apiKey
        },
        qs: {
            league: 61,
            season: 2023
        }
    }

    request(options, function (error, response, body) {
        if (error) throw new Error(error)

        var data = JSON.parse(body)
        data = data.response

        fs.writeFile("./json/teams-ligue-1/teams-ligue-1.json", JSON.stringify(data, null, 2), function(err) {
            if (err) {
                console.error("Erreur lors de l'écriture du fichier :", err)
            } else {
                console.log("succès !")
            }
        })
    })
}


// ajoute dans des fichiers JSON distinct les joueurs de chaque équipe de ligue 1
function getPlayers() {
    const json = 'json/teams-ligue-1/teams-ligue-1.json'

    fs.readFile(json, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier :", err)
            return
        }

        const ids = []
        const jsonData = JSON.parse(data)

        jsonData.forEach(team => {
            ids.push(team.team.id)
        })

        function sendRequest(index) {
            if (index >= ids.length) {
                console.log("Toutes les demandes ont été traitées.")
                return
            }

            const id = ids[index]
            const options = {
                method: 'GET',
                url: 'https://v3.football.api-sports.io/players/squads',
                qs: { team: id },
                headers: {
                    'x-rapidapi-host': 'v3.football.api-sports.io',
                    'x-rapidapi-key': apiKey
                }
            }

            request(options, function (error, response, body) {
                if (error) {
                    console.error("Erreur lors de la demande pour l'équipe " + id + ":", error)
                } else {
                    const data = JSON.parse(body)
                    fs.writeFile(`json/teams-ligue-1/player-team-${id}.json`, JSON.stringify(data, null, 2), function (err) {
                        if (err) {
                            console.error("Erreur lors de l'écriture du fichier pour l'équipe " + id + ":", err)
                        } else {
                            console.log("Fichier créé pour l'équipe " + id)
                            setTimeout(() => {
                                sendRequest(index + 1)
                            }, 6000)
                        }
                    })
                }
            })
        }

        sendRequest(0)
    })
}

// combine les fichiers de chaque équipe de ligue 1 
function combineDataLigue1() {
    const json = 'json/teams-ligue-1/teams-ligue-1.json'
    var ids = []

    fs.readFile(json, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier :", err)
            return
        }

        const jsonData = JSON.parse(data)

        jsonData.forEach(team => {
            ids.push(team.team.id)
        })

        let jsonDataArray = []

        ids.forEach(id => {
            const jsonTeams = 'json/teams-ligue-1/teams-ligue-1.json'
            const dataTeams = fs.readFileSync(jsonTeams, 'utf8')
            const jsonDataTeams = JSON.parse(dataTeams)
        
            const jsonPlayers = `json/teams-ligue-1/player-team-${id}.json`
            const dataPlayers = fs.readFileSync(jsonPlayers, 'utf8')
            const jsonDataPlayers = JSON.parse(dataPlayers).response
        
            // Trouver l'objet d'équipe correspondant à l'ID
            const teamData = jsonDataTeams.find(team => team.team.id === id)
        
            // Retirer le niveau "team" des joueurs
            var players = jsonDataPlayers.map(player => {
                delete player.team
                return player
            })

            teamData.players = players

            jsonDataArray.push(teamData)
        })

        const transformedData = jsonDataArray.map(item => ({
            ...item,
            players: item.players[0].players
        }))
        
        const finalJsonData = JSON.stringify(transformedData, null, 2)

        fs.writeFile('json/teams.json', `${finalJsonData}`, function(err) {
            if (err) {
                console.error("Erreur lors de l'écriture du fichier combiné :", err)
            } else {
                console.log("Fichier combiné créé avec succès.")
            }
        })
    })
}

function modifyData() {
    const json = 'json/teams.json'

    fs.readFile(json, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier :", err)
            return
        }

        const jsonData = JSON.parse(data)

        const newNames = ['LOSC Lille', 'Olympique Lyonnais', 'Olympique de Marseille', 'Montpelier Hérault SC', 'FC Nantes', 'OGC Nice', 'Paris Saint-Germain', 'AS Monaco', 'Stade de Reims', 'Stade Rennais FC', 'RC Strasbourg Alsace', 'Toulouse FC', 'FC Lorient', 'Clermont Foot 63', 'Stade Brestois 29', 'Havre Athletic Club', 'FC Metz', 'RC Lens']
        const newCodes = ['LIL', 'LYO', 'MAR', 'MON', 'NAN', 'NIC', 'PSG', 'ASM', 'SDR', 'REN', 'RC', 'TOU', 'FCL', 'CLF', 'BRE', 'HAC', 'FCM', 'RCL']

        jsonData.forEach((team, i) => {
            team.team.name = newNames[i]
            team.team.code = newCodes[i]
        })

        const finalJsonData = JSON.stringify(jsonData, null, 2)

        fs.writeFile('json/teams.json', `${finalJsonData}`, function(err) {
            if (err) {
                console.error("Erreur lors de l'écriture du fichier combiné :", err)
            } else {
                console.log("Fichier modifié avec succès.")
            }
        })
    })
}

getTeams()

setTimeout(() => {
    getPlayers()
}, 10000)

setTimeout(() => {
    combineDataLigue1()
}, 130000)

setTimeout(() => {
    modifyData()
}, 131000)
