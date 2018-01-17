'use strict';

var Alexa = require("alexa-sdk");
//IMPORT DEPENDENCIES

var appId = undefined; //'amzn1.echo-sdk-ams.app.your-skill-id';
//LEAVE THIS BLANK


//-------------------------------------------AWS LAMBDA ENTRY POINT------------------------------------------------------------
exports.handler = function(event, context, callback) {

  // console.log("Event : "+JSON.stringify(event));
  // console.log("Context : "+JSON.stringify(context));
  //UNCOMMENT TO SEE REQUEST AND RESPONSE OBJECT JSONs FOR DEBUGGING PURPOSES

  var alexa = Alexa.handler(event, context);
        alexa.registerHandlers(newSessionHandlers); //handlers contain alexa-sdk function based intent logic
        alexa.execute();
};//THIS IS THE CONNECTOR TO ALEXA SKILL ON DEVELOPER ALEXA PORTAL

//---------------------------------------INTENT MANAGEMENT AND FUNCTIONS-------------------------------------------------------
var newSessionHandlers = {
    'LaunchRequest': function() {

        this.attributes['speechOutput']="Hello there! This is the launch request message. Place the default greeting message here. THis will play everytime you invoke the Alexa Skill."
        this.attributes['repromptSpeech']="Are you there? This is the secondary waiting message prompt if you don't say anything or I don't here anything."
        this.emit(':ask', this.attributes['speechOutput'],this.attributes['repromptSpeech']);
    },//Launches the Trigger or executes by Invokation Word or Invokation name
      //This is a Mandatory code component

    'TellIntent': function() {
        this.attributes['speechOutput']="I was coded by Mubash. Yes, he is awesome. I am still incomplete though. You do it yourself now!";
        this.emit(':tell',this.attributes['speechOutput']);
    },//Example of Tell. Alexa does not prompt a secondary waiting message. Session Ends.

    'AskIntent': function() {
        this.attributes['speechOutput']="I was coded by Mubash. Yes, he is awesome. I am still incomplete though. You do it yourself now!";
        this.attributes['repromptSpeech']="Are you there? This is the secondary waiting message prompt if you don't say anything or I don't here anything."
        this.emit(':ask', this.attributes['speechOutput'],this.attributes['repromptSpeech']);
    },//Example of Ask. Alexa prompts a secondary waiting message. Session Waits.

    'SlotIntent': function() {
        var stateslot = this.event.request.intent.slots.testvar.value; //Observe state.value? state is the slot name you put in Training Dashboard in Developer Alexa Portal for that slot
        this.attributes['speechOutput']=`Slot Value is ${stateslot}`;
        this.attributes['repromptSpeech']="Are you there? This is the secondary waiting message prompt if you don't say anything or I don't here anything."
        this.emit(':ask', this.attributes['speechOutput'],this.attributes['repromptSpeech']);
    },//Example of How to Take Slot Values From Utterance

    'CardTellIntent': function() {
        var cardTitle = 'Card Title';
        var cardContent = 'Card Summary Content';
        this.attributes['speechOutput']="Speech Output Message";
        this.emit(':tellWithCard',this.attributes['speechOutput'], cardTitle, cardContent);

    },//Example of How to Send Card to Alexa Companion App : Tell Mode.

    'CardTellIntent': function() {
        var cardTitle = 'Card Title';
        var cardContent = 'Card Summary Content';
        this.attributes['speechOutput']="Speech Output Message";
        this.attributes['repromptSpeech']="Are you there? This is the secondary waiting message prompt if you don't say anything or I don't here anything."
        this.emit(':askWithCard',this.attributes['speechOutput'], this.attributes['repromptSpeech'], cardTitle, cardContent);

    },//Example of How to Send Card to Alexa Companion App : Ask Mode.

    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput']="You can just ask me stuff, don\'t sweat it."
       this.attributes['repromptSpeech']="Are you there?"
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },//Mandatory Block

    "AMAZON.StopIntent": function() {
        this.emit(':tell', "Goodbye!");
    },//Mandatory Block

    "AMAZON.CancelIntent": function() {
        this.emit(':tell', "Goodbye!");
    },//Mandatory Block

    'SessionEndedRequest': function () {
        console.log('session ended!');
        //this.attributes['endedSessionCount'] += 1;
        this.emit(":tell", "Goodbye!");
    },//Mandatory Block

     'UnhandledIntent': function() {
        console.log("UNHANDLED");
        var message = 'I didn\'t get you. Try again';
        this.emit(':ask', message, message);
    },//Mandatory Block

};
