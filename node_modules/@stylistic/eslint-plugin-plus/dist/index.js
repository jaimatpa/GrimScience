'use strict';

var indentBinaryOps = require('./indent-binary-ops.js');
var typeGenericSpacing = require('./type-generic-spacing.js');
var typeNamedTupleSpacing = require('./type-named-tuple-spacing.js');
require('./utils.js');
require('@typescript-eslint/utils');

var rules = {
  "indent-binary-ops": indentBinaryOps,
  "type-generic-spacing": typeGenericSpacing,
  "type-named-tuple-spacing": typeNamedTupleSpacing
};

var index = {
  rules
};

module.exports = index;
