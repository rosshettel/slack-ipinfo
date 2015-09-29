'use strict';
module.exports = class IPInfo {
    constructor() {
        this.ipinfo = require('ipinfo');
    }

    sendPlainTextResponse(res, payload) {
        this.ipinfo(payload.text, function (err, info) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(info);
            }
        });
    }

    sendPrettyResponse(res, payload) {
        let superagent = require('superagent'),
            self = this;
        const WEBHOOK = process.env.WEBHOOK;

        this.ipinfo(payload.text, function (err, info) {
            if (err) {
                res.status(500).send(err);
            } else {
                let message = {
                    username: 'IPInfo',
                    icon_url: '',
                    channel: payload.channel_name || '@slackbot',
                    text: info.hostname,
                    attachments: [{

                    }]
                };

                console.log('posting message', message);

                superagent.post(WEBHOOK, message, function (err) {
                    if (err) {
                        console.log('Error posting to slack!', err.toString());
                        self.sendPlainTextResponse(res, payload);
                    } else {
                        res.status(200).end();
                    }
                });
            }
        });
    }
}
