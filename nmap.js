'use strict';

var Nmap = function () {
    var libnmap = require('libnmap'),
        logger = require('./logger');

    this.sendResponse = function (res, payload) {
        var opts = {
            range: [payload.text],
            ports: '1-65535',
            flags: [
                '-T4'
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

            var portsList = '• ' + result.host[0].ports[0].port.map(function (port) {
                    return port.item.portid + '/' + port.item.protocol + '  (' + port.service[0].item.name +')';
                }).join('\n • ');


            addField('IP Address', result.host[0].address[0].item.addr, true);
            addField('Status', 'Host is ' + result.host[0].status[0].item.state, true);
            addField('Open Ports', portsList, false);
            addField('Command', result.item.args, false);
            addField('Summary', result.runstats[0].finished.item[0].summary, false);


            logger.debug('message', message);

            res.send(message);
        });
    };
};

module.exports = new Nmap();
