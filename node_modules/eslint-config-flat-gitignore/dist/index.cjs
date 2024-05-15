'use strict';

const fs = require('node:fs');
const findUp = require('find-up');
const parse = require('parse-gitignore');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const fs__default = /*#__PURE__*/_interopDefaultCompat(fs);
const parse__default = /*#__PURE__*/_interopDefaultCompat(parse);

const GITIGNORE = ".gitignore";
function ignore(options = {}) {
  const ignores = [];
  const {
    root = false,
    files: _files = root ? GITIGNORE : findUp.findUpSync(GITIGNORE) || [],
    strict = true
  } = options;
  const files = Array.isArray(_files) ? _files : [_files];
  for (const file of files) {
    let content = "";
    try {
      content = fs__default.readFileSync(file, "utf8");
    } catch (error) {
      if (strict)
        throw error;
      continue;
    }
    const parsed = parse__default(`${content}
`);
    const globs = parsed.globs();
    for (const glob of globs) {
      if (glob.type === "ignore")
        ignores.push(...glob.patterns);
      else if (glob.type === "unignore")
        ignores.push(...glob.patterns.map((pattern) => `!${pattern}`));
    }
  }
  if (strict && files.length === 0)
    throw new Error("No .gitignore file found");
  return {
    // TODO: ESLint does not work with names on global ignores yet
    // name: options.name || 'gitignore',
    ignores
  };
}

module.exports = ignore;
