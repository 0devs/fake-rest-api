#!/usr/bin/env node

var fs = require('fs');

var start = require('./start');
var packageJson = require('./package.json');

var program = require('commander');

program.version(packageJson.version);

var action = null;

program.command('start')
    .description('Starting fake REST API service')
    .option('-p, --port <n>', 'port', null)
    .option('-c, --config <s>', 'config', null)
    .action(function (cmd, options) {

        action = 'start';

        var config;

        var configPath = cmd.config;

        if (configPath) {

            configPath = String(configPath);

            if (!fs.existsSync(configPath)) {
                console.log('no config file "' + configPath + '"');
                return;
            }

            var configText = fs.readFileSync(configPath);

            try  {
                config = JSON.parse(configText);
            } catch (e) {
                console.log('config must be valid JSON');
                return;
            }

        } else {
            config = {};
        }

        if (cmd.port) {
            config.port = cmd.port;
        }

        start(config);
    });

program.parse(process.argv);

if (!action) {
    program.outputHelp();
}
