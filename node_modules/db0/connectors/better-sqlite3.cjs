"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = sqliteConnector;
var _nodePath = require("node:path");
var _nodeFs = require("node:fs");
var _betterSqlite = _interopRequireDefault(require("better-sqlite3"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function sqliteConnector(opts) {
  let _db;
  const getDB = () => {
    if (_db) {
      return _db;
    }
    const filePath = (0, _nodePath.resolve)(opts.cwd || ".", opts.path || `.data/${opts.name || "db"}.sqlite3`);
    (0, _nodeFs.mkdirSync)((0, _nodePath.dirname)(filePath), {
      recursive: true
    });
    _db = new _betterSqlite.default(filePath);
    return _db;
  };
  return {
    name: "sqlite",
    exec(sql) {
      return getDB().exec(sql);
    },
    prepare(sql) {
      const _stmt = getDB().prepare(sql);
      const stmt = {
        bind(...params) {
          if (params.length > 0) {
            _stmt.bind(...params);
          }
          return stmt;
        },
        all(...params) {
          return Promise.resolve(_stmt.all(...params));
        },
        run(...params) {
          const res = _stmt.run(...params);
          return Promise.resolve({
            success: res.changes > 0
          });
        },
        get(...params) {
          return Promise.resolve(_stmt.get(...params));
        }
      };
      return stmt;
    }
  };
}