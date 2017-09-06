/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2015, Joyent, Inc.
 */

/*
 * Test configuration
 */

'use strict';

var fmt = require('util').format;
var fs = require('fs');
var jsprim = require('jsprim');
var validateConfig = require('../../lib/config').validate;



// --- Globals



var NAPI_HOST = process.env.NAPI_HOST || 'localhost';
var NAPI_PORT = process.env.NAPI_PORT || 80;

var CONFIG_PATH_INTEGRATION = __dirname + '/../../config.json';
var CONFIG_PATH_UNIT = __dirname + '/../config.json';

/*
 * If there is a configuration file two levels up, then it's been generated by
 * config-agent and we should use that. Otherwise, we're running unit tests,
 * and can just load the simple version.
 */
var CONFIG_PATH = fs.existsSync(CONFIG_PATH_INTEGRATION) ?
    CONFIG_PATH_INTEGRATION : CONFIG_PATH_UNIT;


// --- Exports



// XXX: Allow overriding these values with config.json!
var CONFIG = {
    defaults: {
        // NIC tags max out at 31 chars.
        nic_tag_name: 'sdcnapitest_' + process.pid
    },
    napi: {
        host: fmt('http://%s:%d', NAPI_HOST, NAPI_PORT)
    },
    server: JSON.parse(fs.readFileSync(CONFIG_PATH))
};

if (!jsprim.hasKey(CONFIG.server, 'moray')) {
    CONFIG.server.moray = {
        host: process.env.MORAY_HOST || '10.99.99.17',
        logLevel: process.env.LOG_LEVEL || 'fatal',
        port: process.env.MORAY_PORT || 2020
    };
}

CONFIG.moray = jsprim.deepCopy(CONFIG.server.moray);

validateConfig(CONFIG.server);


module.exports = CONFIG;
