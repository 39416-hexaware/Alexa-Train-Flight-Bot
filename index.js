'use strict';

//imports
var express = require('express');
var Alexa = require('alexa-app');
var SSMLBuilder = require('ssml-builder');
var requestAPI = require('request');
var commonFiles = require('./util/commonFiles');
const data = require('./util/dataProcessor');

var objData = new data.BookTrainData();
var objStationData = new data.StationDetails();
var objEmployeeDetails = null;
var objRequestData = null;

var port = process.env.PORT || 5000;
//Assign port

var app = express();
//Create express object

var alexaApp = new Alexa.app("Alexa-Train-Flight-Bot");
var objSSMLBuilder = new SSMLBuilder();

alexaApp.express({
    expressApp: app,

    // verifies requests come from amazon alexa. Must be enabled for production.
    // You can disable this if you're running a dev environment and want to POST
    // things to test behavior. enabled by default.
    checkCert: false,

    // sets up a GET route when set to true. This is handy for testing in
    // development, but not recommended for production. disabled by default
    debug: true
});

alexaApp.launch(function (request, response) {
    // let card = {
    //     "version": "1.0",
    //     "response": {
    //       "outputSpeech": {"type":"PlainText","text":"Your Car-Fu car is on the way!"},
    //       "card": {
    //         "type": "Standard",
    //         "title": "Ordering a Car",
    //         "text": "Your ride is on the way to 123 Main Street!\nEstimated cost for this ride: $25",
    //         "image": {
    //           "smallImageUrl": "https://carfu.com/resources/card-images/race-car-small.png",
    //           "largeImageUrl": "https://carfu.com/resources/card-images/race-car-large.png"
    //         }
    //       }
    //     }
    //   }
    console.log(JSON.stringify(request));
    response.say("HELLO THERE. I AM TRAIN FLIGHT ALEXA.!")
        .reprompt("You there?");
});

alexaApp.intent("TrainTicketBook", function (request, response) {
    console.log(JSON.stringify(response));

    let passengers = request.slots.passengers.value;
    let boardingpoint = request.slots.boardingpoint.value;
    let destination = request.slots.destination.value;
    let dateoftravel = request.slots.dateoftravel.value;

    objData.IntentName = "TrainIntent.BookTicket";
    objData.BoardingPoint = boardingpoint != undefined ? boardingpoint : "";
    objData.Destination = destination != undefined ? destination : "";
    objData.DateOfTravel = dateoftravel != undefined ? dateoftravel : "";
    objData.Tickets = passengers != undefined ? passengers : "";

    if (boardingpoint === undefined || boardingpoint == '') {
        response.say("PLEASE TELL ME BOARDING POINT.!")
            .reprompt("You there?");
    }
    else if (destination === undefined || destination == '') {
        response.say("PLEASE TELL ME DESTINATION.!")
            .reprompt("You there?");
    }
    else if (dateoftravel === undefined || dateoftravel == '') {
        response.say("PLEASE TELL ME DATE OF TRAVEL.!")
            .reprompt("You there?");
    }
    else if (passengers === undefined || passengers == '') {
        response.say("PLEASE PROVIDE ME TOTAL NUMBER OF PASSENGERS.!")
            .reprompt("You there?");
    }
    else {
        var url = commonFiles.APIList['RailwayAPI']();
        var data = {
            "IntentName": objData.IntentName,
            "BoardingPoint": objData.BoardingPoint,
            "Destination": objData.Destination,
            "DateOfTravel": objData.DateOfTravel,
            "Tickets": objData.Tickets
        };
        console.log(data);

        var options = {
            url: url,
            method: 'POST',
            header: commonFiles.headerTemplate(),
            body: data,
            json: true
        };

        try {
            return callURI(options, "TrainTicketBook")
                .then((res) => {
                    objSSMLBuilder.say("LET ME SEE.")
                        .pause('2s')
                        .say("Train ticket booking for " + passengers + " members is successful from " + boardingpoint + " to " + destination + " on " + dateoftravel)
                        .pause('2s')
                        .say("Your ticket number is " + res)

                    let speechOutput = objSSMLBuilder.ssml(true);

                    console.log(JSON.stringify(response.say));
                    response.say(speechOutput);
                }).catch(function (err) {
                    console.log('CATCH', err);
                });
        }
        catch (err) {
            console.log(err);
        }
    }
});

alexaApp.intent("StationCodeIntent", function (request, response) {
    console.log(JSON.stringify(response));

    let stationName = request.slots.stationname.value;

    objStationData.IntentName = "TrainIntent.GetStationCode";
    objStationData.StationName = stationName != undefined ? stationName : "";

    if (stationName === undefined || stationName == '') {
        response.say("PLEASE PROVIDE ME YOUR STATION NAME")
            .reprompt("You there?");
    }
    else {
        var url = commonFiles.APIList['RailwayAPI']();
        var data = {
            "IntentName": objStationData.IntentName,
            "StationName": objStationData.StationName,
        };
        console.log(data);

        var options = {
            url: url,
            method: 'POST',
            header: commonFiles.headerTemplate(),
            body: data,
            json: true
        };

        try {
            return callURI(options, "StationCodeIntent")
                .then((res) => {
                    console.log(res);
                    objSSMLBuilder.say("LET ME SEE.")
                        .pause('2s')
                        .sayAs({
                            word: res,
                            interpret: "address"
                        })

                    let speechOutput = objSSMLBuilder.ssml(true);

                    console.log(JSON.stringify(response.say));
                    response.say(speechOutput);
                }).catch(function (err) {
                    console.log('CATCH', err);
                });
        }
        catch (err) {
            console.log(err);
        }
    }
});

function callURI(options, requestType) {
    return new Promise(function (resolve, reject) {
        requestAPI(options, function (error, resp, body) {
            if (error) {
                console.dir(error);
                reject(false);
            }
            else {
                console.log('API Success');
                console.log('status code:' + resp.statusCode);

                console.log('Inside data process');
                console.log(body);

                if (requestType == "TrainTicketBook") {
                    let ticketno = body;
                    console.log(ticketno);
                    resolve(ticketno);
                }
                else if (requestType == "StationCodeIntent") {
                    console.log(body[0][0]);
                    if (body[0][0].stations.length > 0) {
                        let codes = '';
                        for (let i = 0; i < body[0][0].stations.length; i++) {
                            codes += body[0][0].stations[i].code + ' - ' + body[0][0].stations[i].name + ', ';
                        }
                        resolve(codes);
                    }
                    let ticketno = body;
                    console.log(ticketno);
                    resolve(ticketno);
                }
            }
        });
    })
}

console.log("Server Running at Port : " + port);
app.listen(port);
// Listening to port
