'use strict';
module.exports =
class IPInfo {
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
                    icon_url: 'http://vignette1.wikia.nocookie.net/cowboybebop/images/c/cd/6_Ein1.png/revision/latest?cb=20091209161501',
                    channel: payload.channel_id || '@slackbot',
                    attachments: [{
                        title: "IP Info for " + info.ip,
                        title_link: "http://ipinfo.io/" + info.ip,
                        fields: [
                            {
                                title: 'City',
                                value: info.city,
                                short: true
                            }, {
                                title: 'Region',
                                value: info.region,
                                short: true
                            }, {
                                title: 'Postal',
                                value: info.postal,
                                short: true
                            }, {
                                title: 'Country',
                                value: info.country,
                                short: true
                            }, {
                                title: 'Hostname',
                                value: info.hostname
                            }, {
                                title: 'Org',
                                value: info.org
                            }
                        ]
                    }];
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
