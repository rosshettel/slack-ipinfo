'use strict';

var IPInfo = function () {
    let ipinfo = require('ipinfo'),
        logger = require('./logger'),
        MAPS_KEY = process.env.MAPS_KEY;

    this.sendResponse = function (res, payload) {
        //todo - validate valid IP address
        ipinfo(payload.text, function (err, info) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            let fields = [],
                message = {
                    response_type: 'in_channel',
                    text: 'IP Info',
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

            logger.debug('responding with message', message);

            res.send(message);
        });
    }
};

module.exports = new IPInfo();