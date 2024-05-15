"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils/index.cjs");
var _cloudflare = require("./utils/cloudflare.cjs");
const DRIVER_NAME = "cloudflare-kv-binding";
module.exports = (0, _utils.defineDriver)(opts => {
  const r = (key = "") => opts.base ? (0, _utils.joinKeys)(opts.base, key) : key;
  async function getKeys(base = "") {
    base = r(base);
    const binding = (0, _cloudflare.getKVBinding)(opts.binding);
    const kvList = await binding.list(base ? {
      prefix: base
    } : void 0);
    return kvList.keys.map(key => key.name);
  }
  return {
    name: DRIVER_NAME,
    options: opts,
    async hasItem(key) {
      key = r(key);
      const binding = (0, _cloudflare.getKVBinding)(opts.binding);
      return (await binding.get(key)) !== null;
    },
    getItem(key) {
      key = r(key);
      const binding = (0, _cloudflare.getKVBinding)(opts.binding);
      return binding.get(key);
    },
    setItem(key, value) {
      key = r(key);
      const binding = (0, _cloudflare.getKVBinding)(opts.binding);
      return binding.put(key, value);
    },
    removeItem(key) {
      key = r(key);
      const binding = (0, _cloudflare.getKVBinding)(opts.binding);
      return binding.delete(key);
    },
    getKeys() {
      return getKeys().then(keys => keys.map(key => opts.base ? key.slice(opts.base.length) : key));
    },
    async clear(base) {
      const binding = (0, _cloudflare.getKVBinding)(opts.binding);
      const keys = await getKeys(base);
      await Promise.all(keys.map(key => binding.delete(key)));
    }
  };
});