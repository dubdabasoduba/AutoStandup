const express = require("express")
const DialogRouter = express.Router()
const signature = require("../verify-signature")
const AutoStandup = require("../slack-bot")
const slackBot = new AutoStandup()

const botResponse = new Array("Got it! Thanks", "Awesome!",
    "Cool. Will get it posted.", "Great!", "Thank you!", "Thanks!", "You are awesome", "Yes!",
    "Just doing my job", "Okay!", "Alright!","Nice, thanks")

function pickRandomResponse() {
    var pos = Math.floor(Math.random() * (botResponse.length - 0) + 0)
    return botResponse[pos]
}

function sendConfirmation(userId) {
    slackBot.sendMessageToUser(userId, pickRandomResponse())
}



//Handle post request from slack
DialogRouter.post('/dialog/new', function (req, res, next) {
    const body = JSON.parse(req.body.payload)
    if (signature.isVerified(req)) {
        let standupDetails = {
            username: body.user.id,
            standup_today: body.submission.standup_today,
            team: body.submission.team,
            standup_previous: body.submission.standup_previous,
            date_posted: body.state
        }
        console.log("Form submission id : " + body.callback_id);
        res.status(200).json({})

        if(standupDetails.team === "None"){
            slackBot.postIndividualStandupToChannel(standupDetails)
            standupDetails.status = 1
            slackBot.saveStandup(standupDetails)
        }else{
            standupDetails.status = 0
            slackBot.saveStandup(standupDetails)
        }
      
        sendConfirmation(body.user.id)
    } else {
        console.log("Token Mismatch!")
        res.status(404).end()
    }

})

//Test get request from slack
DialogRouter.get('/dialog', function (req, res, next) {
    res.send("Cool! Everything works for dialog! Congratulations!!")
})

module.exports = DialogRouter