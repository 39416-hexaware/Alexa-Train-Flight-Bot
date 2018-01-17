'use strict';

//imports
var express = require('express');
var Alexa = require('alexa-app');
var SSML = require('ssml');
var SSMLBuilder = require('ssml-builder');

var objRequestData = null;
var objEmployeeDetails = null;

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

        objSSML.say("LET ME SEE.")
            .break(200)
            .prosody({ rate: '0.8' })
            .say("COMING FROM TRAIN TICKET BOOK")
            .toString({ pretty: true });


        // let city = request.slots.City.value;
        // let contact = request.slots.Contact.value;
        // if (city == undefined) {
        //     objEmployeeDetails.Contact = contact != undefined ? contact : "";
        //     response.say("PLEASE PROVIDE NAME OF THE CITY.!")
        //         .reprompt("You there?");
        // }
        // else if (contact == undefined) {
        //     objEmployeeDetails.City = city != undefined ? city : "";
        //     response.say("PLEASE TELL ME WHAT DETAIL YOU WANT.!")
        //         .reprompt("You there?");
        // }
        // else {
        //     objEmployeeDetails.Contact = contact;
        //     objEmployeeDetails.City = city;

        //     // objSSML.say("LET ME SEE.")
        //     // .break(200)
        //     // .prosody({ rate: '0.8' })
        //     // .say("THE MANAGER FOR HDFC "+ city +" OFFICE IS MANOHAR. PLEASE NOTE DOWN HIS "+ contact +" NUMBER. 9 7 4 8 9 7 8 8 1 2.!")
        //     // .toString({ pretty: true });

        //     objSSMLBuilder.say("LET ME SEE.")
        //         .pause('2s')
        //         .say("THE MANAGER FOR HDFC " + city + " OFFICE IS MANOHAR. PLEASE NOTE DOWN HIS " + contact + " NUMBER!")
        //         .sayAs({
        //             word: "9748978812",
        //             interpret: "telephone"
        //         })

        //     let speechOutput = objSSMLBuilder.ssml(true);

        //     console.log(JSON.stringify(response.say));
        //     response.say(speechOutput);
        //     // response.say("LET ME SEE. THE MANAGER FOR HDFC " + city + " OFFICE IS MANOHAR. PLEASE NOTE DOWN HIS " + contact + " NUMBER. 9 7 4 8 9 7 8 8 1 2.!")
        //     //     .reprompt("You there?");
        // }
    }
);

alexaApp.intent("welcomeIntent",
    function (request, response) {
        console.log(JSON.stringify(request));
        // response.card({
        //     type: "Standard",
        //     title: "My Cool Card", // this is not required for type Simple or Standard
        //     text: "Your ride is on the way to 123 Main Street!\nEstimated cost for this ride: $25",
        //     image: { // image is optional
        //       smallImageUrl: "https://carfu.com/resources/card-images/race-car-small.png", // required
        //       largeImageUrl: "https://carfu.com/resources/card-images/race-car-large.png"
        //     }
        //   });
        response.say("HELLO THERE. I AM AN HDFC ASSISTANT. YOU CAN ASK ME DETAILS ABOUT AN HDFC EMPLOYEE, YOUR PENDING SERVICE REQUESTS OR MAKING A NEW SERVICE REQUEST.!")
            .reprompt("You there?");
    }
);

alexaApp.intent("newservicerequestIntent",
    function (request, response) {
        console.log(JSON.stringify(request));
        response.say("OKAY! REGARDING WHAT?")
            .reprompt("You there?");
    }
);

alexaApp.intent("requesttypeIntent",
    function (request, response) {
        console.log(objRequestData);
        console.log(JSON.stringify(request));
        // console.log(JSON.stringify(request.slots));
        if (request.slots.DesktopRequest == undefined) {
            response.say("PLEASE TELL REGARDING WHAT YOU WANT TO MAKE A SERVICE REQUEST?")
                .reprompt("You there?");
        }
        else {
            objRequestData.RequestType = request.slots.DesktopRequest.value;
            response.say("PLEASE TELL ME YOUR EMPLOYEE ID")
                .reprompt("You there?");
        }
    }
);

alexaApp.intent("employeeIdIntent",
    function (request, response) {
        console.log(objRequestData);
        console.log(JSON.stringify(request.slots));
        if (request.slots.EmployeeId == undefined) {
            response.say("PLEASE TELL ME YOUR EMPLOYEE ID")
                .reprompt("You there?");
        }
        else if (objRequestData.RequestType == null || objRequestData.RequestType == '') {
            response.say("PLEASE TELL REGARDING WHAT YOU WANT TO MAKE A SERVICE REQUEST?")
                .reprompt("You there?");
        }
        else {
            objRequestData.EmployeeId = request.slots.EmployeeId.value;
            response.say("YOUR SERVICE REQUEST HAS BEEN RAISED FOR THE " + objRequestData.RequestType + " FOR THE NEW JOINEES UNDER EMPLOYEE ID " + objRequestData.EmployeeId)
                .reprompt("You there?");
        }
    }
);

alexaApp.intent("pendingrequestIntent",
    function (request, response) {
        console.log(JSON.stringify(request));
        console.log(JSON.stringify(request.slots));
        response.say("YOU HAD RAISED THREE SERVICE REQUESTS YESTERDAY. THE ONE FOR A NEW DESKTOP ALLOCATION HAS BEEN APPROVED.")
            .reprompt("You there?");
    }
);

console.log("Server Running at Port : " + port);
app.listen(port);
// Listening to port
