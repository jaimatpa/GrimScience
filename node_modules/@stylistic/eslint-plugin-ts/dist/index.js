'use strict';

var configs = require('./configs.js');
require('@typescript-eslint/utils');
require('@typescript-eslint/utils/ast-utils');
require('./utils.js');
require('@stylistic/eslint-plugin-js');

var index = Object.assign(configs.plugin, { configs: configs.configs });

module.exports = index;
