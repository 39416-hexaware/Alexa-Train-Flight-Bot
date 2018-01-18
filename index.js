'use strict';

//imports
var express = require('express');
var Alexa = require('alexa-app');
var SSML = require('ssml');
var SSMLBuilder = require('ssml-builder');
var async = require('async');
var requestAPI = require('request');
var commonFiles = require('./util/commonFiles');
const data = require('./util/dataProcessor');

var objData = new data.BookTrainData();
var objEmployeeDetails = null;
var objRequestData = null;

var port = process.env.PORT || 5000;
//Assign port

var app = express();
//Create express object

var alexaApp = new Alexa.app("Alexa-Train-Flight-Bot");
var objSSML = new SSML();
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

//   alexaApp.dictionary = { "names": ["matt", "joe", "bob", "bill", "mary", "jane", "dawn"] };

alexaApp.intent("TrainTicketBook",
    function (request, response) {
        console.log('Mubash');
        console.log(JSON.stringify(request));

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

            console.log('before async parallel');
            async.parallel([
                function (calback, response) {
                    requestAPI(options, function (error, resp, body, response) {
                        if (error) {
                            console.dir(error);
                            return
                        }
                        else {
                            console.log('API Success');
                            console.log('status code:' + resp.statusCode);

                            console.log('Inside data process');
                            console.log(JSON.stringify(response));
                            calback(false, body, response);
                        }
                    });
                }],
                function (err, result, response) {
                    console.log('callback fn')
                    console.log(JSON.stringify(result));
                    console.log(JSON.stringify(response));
                    let ticketno = result[0];
                    console.log(ticketno);
                    objSSMLBuilder.say("LET ME SEE.")
                        .pause('2s')
                        .say("Train ticket booking for " + passengers + " members is successful from " + boardingpoint + " to " + destination + " on " + dateoftravel)
                        .pause('2s')
                        .say("Your ticket number is " + ticketno)
                        .toString({ pretty: true });

                    let speechOutput = objSSMLBuilder.ssml(true);
                    console.log(speechOutput);

                    response.say(speechOutput);
                });

                console.log('exit else');
        }
    }
);

console.log("Server Running at Port : " + port);
app.listen(port);
// Listening to port
