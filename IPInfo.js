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
            querystring = require('querystring'),
            self = this;
        const WEBHOOK = process.env.WEBHOOK;
        const MAPS_KEY = process.env.MAPS_KEY;

        this.ipinfo(payload.text, function (err, info) {
            if (err) {
                res.status(500).send(err);
            } else {
                let fields = [],
                    message = {
                        username: 'IPInfo',
                        icon_url: 'http://vignette1.wikia.nocookie.net/cowboybebop/images/c/cd/6_Ein1.png/revision/latest?cb=20091209161501',
                        channel: payload.channel_id || '@slackbot',
                        attachments: [{
                            title: "IP Info for " + info.ip,
                            title_link: "http://ipinfo.io/" + info.ip,
                            fields: fields
                        }]
                    },
                    addField = function addField(title, value) {
                        if (value) {
                            fields.push({
                                title: title,
                                value: value,
                                short: true
                            });
                        }
                    };

                addField('City', info.city);
                addField('Region', info.region);
                addField('Postal', info.postal);
                addField('Country', info.country);
                addField('Hostname', info.hostname);
                addField('Organiziation', info.org);

                if (info.loc) {
                    message.attachments[0].image_url = "https://maps.googleapis.com/maps/api/staticmap?" + querystring.stringify({
                            center: info.loc,
                            size: '400x125',
                            zoom: '9',
                            key: MAPS_KEY
                        });
                }

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
