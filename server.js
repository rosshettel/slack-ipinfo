'use strict';
var express = require('express'),
    bodyParser = require('body-parser'),
    slack = require('slack-api'),
    app = express(),
    port = process.env.PORT || 3000,
    logger = require('./logger'),
    IPInfo = require('./IPInfo'),
    nmap = require('./nmap');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/static'));

app.get('/oauth', function (req, res) {
    if (!req.query.code) {
        res.status(400).send('Code query param not found!');
    }

    slack.oauth.access({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.query.code
    }, function (err, data) {
        if (err) {
            logger.error('error', err);
            res.send({error: err});
        }
        logger.debug('data', data);
        res.send({message: "Thanks, authenticated!"});
    });
});

app.post('/slash/ip', function (req, res) {
    let payload = req.body;

    if (payload.token !== process.env.TOKEN) {
        res.status(403).send({error: "Tokens do not match!"});
    }

    IPInfo.sendResponse(res, payload);
});

app.post('/slash/nmap', function (req, res) {
    let payload = req.body;

    if (payload.token !== process.env.TOKEN) {
        res.status(403).send({error: 'Tokens do not match!'});
    }

    nmap.sendResponse(res, payload);
});

process.on('uncaughtException', function (err) {
    logger.error('Uncaught Exception!', err);
});

app.listen(port);