'use strict';

var Nmap = function () {
    var libnmap = require('node-libnmap'),
        logger = require('./logger');

    this.sendResponse = function (res, payload) {
        var opts = {
            range: [payload.text]
        };

        logger.debug('nmap request for `%s` from %s@%s[%s]', payload.text, payload.user_name, payload.team_domain, payload.channel_name);
        logger.debug('opts', opts);

        libnmap.scan(opts, function (err, report) {
            if (err) {
                logger.error('nmap error', err);
                res.status(500).send({text: "nmap returned an error: " + err});
            }

            logger.debug('report', report);
            res.send(report);
        })
    };
};

module.exports = new Nmap();
