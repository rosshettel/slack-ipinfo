'use strict';
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT || 3000,
    server = app.listen(port);

const TOKEN = process.env.TOKEN;
const WEBHOOK = process.env.WEBHOOK;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/static'));

function isValidToken(payload) {
    return payload.token === TOKEN;
}

app.get('/oauth', function (req, res) {
    //get query param `code`
    //
})

app.post('/', function (req, res) {
    let payload = req.body,
        IPInfo = new (require('./IPInfo.js'));

    if (!isValidToken(payload)) {
        return res.status(403).send({error: "Slack slash command token does not match"});
    }

    if (WEBHOOK) {
        IPInfo.sendPrettyResponse(res, payload);
    } else {
        IPInfo.sendPlainTextResponse(res, payload);
    }
});