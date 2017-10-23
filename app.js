var lodash = require('lodash');
var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');
var Bravey = require("bravey");
var nlp = new Bravey.Nlp.Fuzzy();
var mockServer = require('./mockServer');
var braveyLearning = require('./braveyLearning');

var objectMaps = JSON.parse(fs.readFileSync('objectMaps.json', 'utf8'));
function getBotDetails (response) {
    var botName, queryObject = nlp.test(response.response);
    console.log ("**", queryObject)
    return (queryObject) ? objectMaps[queryObject.intent] : 'noMatchFound';
}
//Setup Bravey Documents
braveyLearning.init(Bravey, nlp);
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '48f5d0d7-804e-42e5-96f2-f59ed8b6ce24',
    appPassword: 'XzYVeH1HYx0DYxq1jfTJYXF'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());
server.get('/api/gemsCaseDetails', mockServer.gemsData);
server.get('/api/callReportDetails', mockServer.callReportData);
server.get('/api/cobDetails', mockServer.COBData);
server.get('/api/dealDetails', mockServer.dealData);

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Hi RM!');
    session.beginDialog('askQuery');
});
function continueConversation (session, results) {
    var botName = getBotDetails (results);
    session.beginDialog(botName);
}
bot.dialog('askQuery', [
    function (session) {
        builder.Prompts.text(session, 'How can I help you?');
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('callReportRequest', [
    function (session) {
        builder.Prompts.text(session, 'Here is the requested Call Report details\nCall Date - 10 Jul 2017\nCall Subject - Sales Discussion\nCompany Name - XYZ Corp.\nCall Type - Multi-Purpose\nStatus - Completed');
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('gemsRequest', [
    function (session) {
        builder.Prompts.text(session, 'Please find the requested case details:\nName - XYZ Corp.\nProduct Group - Money Management\nClassification - Complaint\nCreated Date - 09 Sep 2017\nStatus - Overdue');
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('cobRequest', [
    function (session) {
        builder.Prompts.text(session, 'Customer Name - XYZ Corp is currently in Onboarding In-Progress status.');
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('dealStageRequest', [
    function (session) {
        builder.Prompts.text(session, 'Deal Name - XYZ Deal is currently in Marketing stage.');
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('thankYou', [
    function (session) {
        session.send('You are welcome! Have a great day!');
        session.endDialog();
    }
]);
bot.dialog('thanks', [
    function (session) {
        session.send('My pleasure. Have a good day!');
        session.endDialog();
    }
]);
bot.dialog('noMatchFound', [
    function (session) {
        session.send('Sorry Unable to understand');
        session.endDialog();
        session.beginDialog('askQuery');
    }
]);


