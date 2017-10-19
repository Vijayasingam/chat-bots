var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');

var questionObjs = JSON.parse(fs.readFileSync('ConversationKB.json', 'utf8'));
function getBotName (response) {
    let botName;
    console.log ("**", JSON.stringify (response));
    botName = questionObjs.kb.findBy("question", response.response);
    return (botName) ? botName : 'noMatchFound';
}
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '689b39ba-a383-4fc1-bfee-1c657835a1d4',
    appPassword: 'nn0tZiqADBpf2mhtUNgcmAQ'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Welcome!");
    session.beginDialog('askQuery');
});
bot.dialog('askQuery', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your Query?');
    },
    function (session, results) {
        let botName = getBotName (results);
        session.beginDialog(botName);
        // session.endDialogWithResult(results);
    }
]);
bot.dialog('showName', [
    function (session) {
        session.send('Hi! My Name is Chat Bot');
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog('noMatchFound', [
    function (session) {
        session.send('Sorry Unable to understand');
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);


