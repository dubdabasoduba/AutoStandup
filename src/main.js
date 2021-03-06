const AppDao = require("./dao")
const UserRepository = require("./repositories/users-repo")
const TeamRepository = require("./repositories/teams-repo")
const UserStandupsRepository = require("./repositories/user-standups-repo")

const dao = new AppDao(process.env.DB_PATH)
const userRepo = new UserRepository(dao)
const teamRepo = new TeamRepository(dao)
const userStandupRepo = new UserStandupsRepository(dao)

function main() {
    initDb()
}

function initDb() {
    //Create tables
    teamRepo.createTable()    
        .then(() => { return userRepo.createTable() })
        .then(() => { return userStandupRepo.createTable() })
        .catch((err) => {
            console.log('Error: ')
            console.log(JSON.stringify(err))
        })

}

module.exports = { main, userRepo, teamRepo, userStandupRepo }