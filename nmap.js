'use strict';

var Nmap = function () {
    var nmap = require('node-libnmap'),
        logger = require('./logger');

    this.sendResponse = function (res, payload) {
        var opts = {
            range: [payload.text]
        };

        nmap.scan(opts, function (err, report) {
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
