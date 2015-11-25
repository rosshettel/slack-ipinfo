'use strict';

var IPInfo = function () {
    let ipinfo = require('ipinfo'),
        querystring = require('querystring'),
        validator = require('validator'),
        logger = require('./logger'),
        MAPS_KEY = process.env.MAPS_KEY;

    this.sendResponse = function (res, payload) {
        logger.debug('request for `%s` from %s@%s[%s]', payload.text, payload.user_name, payload.team_domain, payload.channel_name);

        if(!validator.isIP(payload.text)) {
            res.send({text: "Please include a valid v4 or v6 IP address."});
            return;
        }

        ipinfo(payload.text, function (err, info) {
            if (err) {
                logger.error('ipinfo error', err);
                res.status(500).send({error: err});
                return;
            }

            let fields = [],
                message = {
                    response_type: 'ephemeral',
                    attachments: [{
                        title: 'IP Info for ' + info.ip,
                        title_link: 'http://ipinfo.io/' + info.ip,
                        fields: fields
                    }]
                };

            function addField(title, value) {
                if (value) {
                    fields.push({
                        title: title,
                        value: value,
                        short: true
                    });
                }
            }

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

            res.send(message);
        });
    }
};

module.exports = new IPInfo();