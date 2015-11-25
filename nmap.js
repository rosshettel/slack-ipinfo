'use strict';

var Nmap = function () {
    var libnmap = require('libnmap'),
        logger = require('./logger');

    this.sendResponse = function (res, payload) {
        var opts = {
            range: [payload.text],
            flags: [
                '-O'    //OS fingerprinting

            ]
        };

        logger.info('nmap request for `%s` from %s@%s[%s]', payload.text, payload.user_name, payload.team_domain, payload.channel_name);

        libnmap.scan(opts, function (err, report) {
            if (err) {
                logger.error('nmap error', err);
                res.status(500).send({text: "nmap returned an error: " + err});
            }

            logger.debug('report', report);

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
                if (value) {
                    fields.push({
                        title: title,
                        value: value,
                        short: short
                    });
                }
            }

            addField('Command', result.item.args, false);
            addField('Status', 'Host is ' + result.host[0].status[0].item.state, true);
            //addField('')

            logger.debug('message', message);

            res.send(message);
        });
    };
};

module.exports = new Nmap();
