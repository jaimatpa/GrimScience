'use strict';

require('@typescript-eslint/utils');
require('./utils.js');
var configs = require('./configs.js');
require('@stylistic/eslint-plugin-js');
require('@typescript-eslint/utils/ast-utils');



module.exports = configs.linesBetweenClassMembers;
