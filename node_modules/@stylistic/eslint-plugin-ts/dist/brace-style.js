'use strict';

require('@typescript-eslint/utils/ast-utils');
require('@typescript-eslint/utils');
require('./utils.js');
var configs = require('./configs.js');
require('@stylistic/eslint-plugin-js');



module.exports = configs.braceStyle;
