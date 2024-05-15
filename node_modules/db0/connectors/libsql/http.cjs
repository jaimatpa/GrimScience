"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
module.exports = libSqlConnector;
var _http = require("@libsql/client/http");
var _core = _interopRequireDefault(require("./core.cjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function libSqlConnector(opts) {
  let _client;
  const getClient = () => {
    if (!_client) {
      _client = (0, _http.createClient)(opts);
    }
    return _client;
  };
  return (0, _core.default)({
    name: "libsql-http",
    getClient
  });
}