'use strict';

var Nmap = function () {
    var libnmap = require('libnmap'),
        logger = require('./logger');

    this.sendResponse = function (res, payload) {
        var opts = {
            range: [payload.text]
        };

        logger.info('nmap request for `%s` from %s@%s[%s]', payload.text, payload.user_name, payload.team_domain, payload.channel_name);

        libnmap.scan(opts, function (err, report) {
            if (err) {
                logger.error('nmap error', err);
                res.status(500).send({text: "nmap returned an error: " + err});
            }

            let fields = [],
                message = {
                    response_type: 'ephemeral',
                    attachments: [{
                        title: 'nmap scan results for ' + payload.text,
                        fields: fields
                    }]
                },
                result = report[payload.text];

            function addField(title, value, short) {
                var short = short || true;
                if (value) {
                    fields.push({
                        title: title,
                        value: value,
                        short: short
                    });
                }
            }

            addField('Command', result.item.args);
            addField('Status', 'Host is ' + result.host[0].status);
            //addField('')

            res.send(message);
        })
    };
};

module.exports = new Nmap();
