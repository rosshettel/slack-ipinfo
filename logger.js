var winston = require('winston'),
    slackWinston = require('slack-winston'),
    moment = require('moment'),
    slackWebhook = process.env.LOGGING_WEBHOOK || 'n/a',
    logger = new (winston.Logger)({
        transports: [
            new winston.transports.Console({
                level: 'debug',
                colorize: true,
                prettyPrint: false,
                timestamp: function () {
                    return moment().format("MM/DD HH:mm:ss");
                }
            }),
            new slackWinston.Slack({
                domain: 'rosshettel',
                webhook_url: slackWebhook,
                channel: 'ipinfo-logs',
                silent: slackWebhook === 'n/a',
                level: 'info'
            })
        ]
    });

module.exports = logger;