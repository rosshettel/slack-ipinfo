'use strict';
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = process.env.PORT || 3000,
    server = app.listen(port);

app.use(bodyParser.urlencoded({extended: true}));

function isValidToken(payload) {
    let token = process.env.TOKEN;
    return payload.token === token;
}


app.post('/', function (req, res) {
    let payload = req.body,
        ipinfo = require('ipinfo');

    if (!isValidToken(payload)) {
        return res.status(403).send({error: "Slack slash command token does not match"});
    }

    ipinfo(payload.text, function (err, info) {
        console.log(err);
        console.log(info);

        res.send(info);
    });
});