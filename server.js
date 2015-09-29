'use strict';
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT || 3000,
    server = app.listen(port);

const TOKEN = process.env.TOKEN;
const WEBHOOK = process.env.WEBHOOK;

app.use(bodyParser.urlencoded({extended: true}));

function isValidToken(payload) {
    return payload.token === TOKEN;
}


app.post('/', function (req, res) {
    let payload = req.body,
        IPInfo = new (require('./IPInfo.js'));

    if (!isValidToken(payload)) {
        return res.status(403).send({error: "Slack slash command token does not match"});
    }

    console.log('payload', payload);

    if (WEBHOOK) {
        IPInfo.sendPrettyResponse(res, payload);
    } else {
        IPInfo.sendPlainTextResponse(res, payload);
    }
});