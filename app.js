var restify = require('restify');
var builder = require('botbuilder');

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

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    // session.send("You said: %s", session.message.text);
    session.beginDialog('greetings');
});
bot.dialog('greetings', [
    function (session) {
        session.beginDialog('askQuery');
    },
    function (session, results) {
        session.endDialog('Hello %s!', results.response);
    }
]);
bot.dialog('askQuery', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your Query?');
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);
