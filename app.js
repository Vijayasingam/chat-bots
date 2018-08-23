var lodash = require('lodash');
var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');
var Bravey = require("bravey");
var nlp = new Bravey.Nlp.Fuzzy();
var mockServer = require('./mockServer');
var braveyLearning = require('./braveyLearning');
var request = require('./httpRequest');

var APPID = '48f5d0d7-804e-42e5-96f2-f59ed8b6ce24';
var APPPWD = 'XzYVeH1HYx0DYxq1jfTJYXF';
var objectMaps = JSON.parse(fs.readFileSync('objectMaps.json', 'utf8'));
function getBotDetails (response) {
    if (!response.response || response.response === true) {
        return {botName: 'endDialog', queryObject: {}}
    }
    var botName, queryObject = nlp.test(response.response);
    return (queryObject) ? {botName: objectMaps[queryObject.intent], queryObject: queryObject }: {botName: 'noMatchFound', queryObject: {}};
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
    appId: APPID,
    appPassword: APPPWD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());
server.get('/api/gemsCaseDetails/:id', mockServer.gemsData);
server.get('/api/callReportDetails', mockServer.callReportData);
server.get('/api/cobDetails', mockServer.COBData);
server.get('/api/dealDetails', mockServer.dealData);
server.get('/api/dealCCRStatus', mockServer.dealCCRStatus);
server.get('/api/documentDetails', mockServer.documentDetails);
server.get('/api/confirmQuery', mockServer.confirmQuery);

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session, results, config) {
    session.send (`Hi ${session.message.user.name} !`)
    session.beginDialog('askQuery');
});
function continueConversation (session, results) {
    var botObj = getBotDetails (results);
    session.queryObject = botObj.queryObject
    session.beginDialog(botObj.botName);
}
bot.dialog('askQuery', [
    function (session) {
        builder.Prompts.text(session, 'How can I help you?', {textFormat: 'xml'});
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('askQuery2', [
    function (session) {
        builder.Prompts.text(session, 'I can help you with following information, <br/>1. Client Details and Client related informations.<br/>2. Deal stage queries.', {textFormat: 'xml'});
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('callReportRequest', [
    function (session) {
        var params = {
            method: 'GET',
            path: '/api/callReportDetails'
        };
        request.httpRequest(params).then(function(body) {
            builder.Prompts.text(session, `Here is the requested Call Report details Call Date - ${body.callDate} Call Subject - ${body.callSubject} Company Name - ${body.companyName} Call Type - ${body.callType} Status - ${body.status}`, {textFormat: 'xml'});
        });

    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('gemsRequest', [
    function (session) {
        if (session.queryObject.entitiesIndex['gems_sr_req_id']) {
            var params = {
                method: 'GET',
                path: `/api/gemsCaseDetails/`+session.queryObject.entitiesIndex['gems_sr_req_id'].string.toUpperCase()
            };
            request.httpRequest(params).then(function(body) {
                var msg;
                if (body.error) {
                    msg = body.errorMessage;
                } else {
                    msg = `Please find the requested case details:<br/><b>Name</b> - ${body.name} <br/><b>Product Group</b> - ${body.productGroup} <br/><b>Query Type</b> - ${body.queryType} <br/><b>Classification</b> - ${body.classification} <br/><b>Created Date</b> - ${body.createdDate} <br/><b>Status</b> - ${body.status} <br/><b>Last Updated By</b> - ${body.lastUpdatedBy}`;
                }
                builder.Prompts.text(session, msg, {textFormat: 'xml'});
            });
        } else {
            if (!session.customObject) {
                session.customObject = {};
            }
            session.customObject.customQuestion = 'the GEMS case ID';
            session.beginDialog('getIdFromUser');
        }
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('cobRequest', [
    function (session) {
        var params = {
            method: 'GET',
            path: '/api/cobDetails'
        };
        request.httpRequest(params).then(function(body) {
            builder.Prompts.text(session, `Customer Name - ${body.customerName} is currently in Onboarding ${body.status} status.`, {textFormat: 'xml'});
        });
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('dealStageRequest', [
    function (session) {
        if (session.queryObject.entitiesIndex['deal_pipeline_id']) {
            var params = {
                method: 'GET',
                path: '/api/dealDetails'
            };
            request.httpRequest(params).then(function(body) {
                builder.Prompts.text(session, `Deal <b>${body.dealName}</b> is currently in <b>${body.stage}</b> stage.`, {textFormat: 'xml'});
            });
        } else {
            if (!session.customObject) {
                session.customObject = {};
            }
            session.customObject.customQuestion = 'the Deal ID';
            session.beginDialog('getIdFromUser');
        }
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('getIdFromUser', [
    function (session) {
        builder.Prompts.text(session, `Please enter ${session.customObject.customQuestion}`, {textFormat: 'xml'});
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
bot.dialog('noMatchFound', [
    function (session) {
        session.send('Sorry Unable to understand');
        session.endDialog();
        session.beginDialog('askQuery2');
    }
]);
bot.dialog('endDialog', [
    function (session) {
        session.endDialog();
    }
]);
bot.dialog('dealCCRStatus', [
    function (session) {
        var params = {
            method: 'GET',
            path: '/api/dealCCRStatus'
        };
        request.httpRequest(params).then(function(body) {
            builder.Prompts.text(session, `Conflicts Clearance Status for the Deal <b>${body.dealName}</b> is <b>${body.ccrStatus}</b>.`, {textFormat: 'xml'});
        });
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('documentDetails', [
    function (session) {
        var params = {
            method: 'GET',
            path: '/api/documentDetails'
        };
        request.httpRequest(params).then(function(body) {
            builder.Prompts.text(session, `Below document details upload are pending <br/><b>${body.doc1}</b><br/><b>${body.doc2}</b>.`, {textFormat: 'xml'});
        });
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('recentComplaints', [
/*     function (session) {
        builder.Prompts.text(session, `Are you referring to the current deal's client - <b>XYZ Corp Merger</b>?`, {textFormat: 'xml'});
    },
    function (session, results) {
        continueConversation (session, results)
    } */
    function (session) {
        console.log("I am in recentComplaints query dialog");
        var params = {
            method: 'GET',
            path: '/api/confirmQuery'
        };
        request.httpRequest(params).then(function(body) {
            builder.Prompts.text(session, `Below is the recent complaint raised for <b>${body.clientName}<br/><b>Name</b> - ${body.name} <br/><b>Product Group</b> - ${body.productGroup} <br/>`, {textFormat: 'xml'});
        });
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);
bot.dialog('confirmQuery', [
    function (session) {
        console.log("I am in confirm query dialog");
        var params = {
            method: 'GET',
            path: '/api/confirmQuery'
        };
        request.httpRequest(params).then(function(body) {
            console.log("I am gonna emit text");
            builder.Prompts.text(session, `Below is the recent complaint raised for <b>${body.clientName}<br/><b>Name</b> - ${body.name} <br/><b>Product Group</b> - ${body.productGroup} <br/><b>Query Type</b> - ${body.queryType} <br/><b>Classification</b> - ${body.classification} <br/><b>Created Date</b> - ${body.createdDate} <br/><b>Status</b> - ${body.status} <br/><b>Last Updated By</b> - ${body.lastUpdatedBy}`, {textFormat: 'xml'});
        });
    },
    function (session, results) {
        continueConversation (session, results)
    }
]);