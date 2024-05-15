import { eventHandler, getRequestURL } from "h3";
import { joinURL } from "ufo";
import { handlersMeta } from "#internal/nitro/virtual/server-handlers";
import { useRuntimeConfig } from "#internal/nitro";
export default eventHandler((event) => {
  const base = useRuntimeConfig()?.app?.baseURL;
  const url = joinURL(getRequestURL(event).origin, base);
  return {
    openapi: "3.1.0",
    info: {
      title: "Nitro Server Routes",
      version: null
    },
    servers: [
      {
        url,
        description: "Local Development Server",
        variables: {}
      }
    ],
    paths: getPaths()
  };
});
function getPaths() {
  const paths = {};
  for (const h of handlersMeta) {
    const { route, parameters } = normalizeRoute(h.route);
    const tags = defaultTags(h.route);
    const method = (h.method || "get").toLowerCase();
    const item = {
      [method]: {
        tags,
        parameters,
        responses: {
          200: { description: "OK" }
        }
      }
    };
    if (paths[route] === void 0) {
      paths[route] = item;
    } else {
      Object.assign(paths[route], item);
    }
  }
  return paths;
}
function normalizeRoute(_route) {
  const parameters = [];
  let anonymousCtr = 0;
  const route = _route.replace(/:(\w+)/g, (_, name) => `{${name}}`).replace(/\/(\*)\//g, () => `/{param${++anonymousCtr}}/`).replace(/\*\*{/, "{").replace(/\/(\*\*)$/g, () => `/{*param${++anonymousCtr}}`);
  const paramMatches = route.matchAll(/{(\*?\w+)}/g);
  for (const match of paramMatches) {
    const name = match[1];
    if (!parameters.some((p) => p.name === name)) {
      parameters.push({
        name,
        in: "path",
        required: true,
        schema: { type: "string" }
      });
    }
  }
  return {
    route,
    parameters
  };
}
function defaultTags(route) {
  const tags = [];
  if (route.startsWith("/api/")) {
    tags.push("API Routes");
  } else if (route.startsWith("/_")) {
    tags.push("Internal");
  } else {
    tags.push("App Routes");
  }
  return tags;
}
