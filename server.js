'use strict';
var express = require('express'),
    bodyParser = require('body-parser'),
    slack = require('slack-api'),
    app = express(),
    port = process.env.PORT || 3000,
    logger = require('./logger'),
    IPInfo = require('./IPInfo');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/static'));

app.get('/oauth', function (req, res) {
    logger.debug('oauth', {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.query.code});
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
        }
        logger.debug('data', data);
    });
});

app.post('/slash', function (req, res) {
    let payload = req.body;

    IPInfo.sendResponse(res, payload);
});

app.listen(port);