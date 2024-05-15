import fs from 'node:fs';
import { findUpSync } from 'find-up';
import parse from 'parse-gitignore';

const GITIGNORE = ".gitignore";
function ignore(options = {}) {
  const ignores = [];
  const {
    root = false,
    files: _files = root ? GITIGNORE : findUpSync(GITIGNORE) || [],
    strict = true
  } = options;
  const files = Array.isArray(_files) ? _files : [_files];
  for (const file of files) {
    let content = "";
    try {
      content = fs.readFileSync(file, "utf8");
    } catch (error) {
      if (strict)
        throw error;
      continue;
    }
    const parsed = parse(`${content}
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

export { ignore as default };
