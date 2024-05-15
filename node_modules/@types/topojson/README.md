# Installation
> `npm install --save @types/topojson`

# Summary
This package contains type definitions for topojson (https://github.com/topojson/topojson).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/topojson.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/topojson/index.d.ts)
````ts
import * as GeoJSON from "geojson";
import * as TopoJSON from "topojson-specification";

export as namespace topojson;

// ---------------------------------------------------------------
// TopoJSON Server
// ---------------------------------------------------------------

export * from "topojson-server";

// ---------------------------------------------------------------
// TopoJSON Simplify
// ---------------------------------------------------------------

export * from "topojson-simplify";

// ---------------------------------------------------------------
// TopoJSON Client
// ---------------------------------------------------------------

export * from "topojson-client";

// ---------------------------------------------------------------
// U.S. Atlas TopoJSON
// ---------------------------------------------------------------

export interface UsAtlas extends TopoJSON.Topology {
    objects: {
        counties: { type: "GeometryCollection"; geometries: Array<TopoJSON.Polygon | TopoJSON.MultiPolygon> };
        states: { type: "GeometryCollection"; geometries: Array<TopoJSON.Polygon | TopoJSON.MultiPolygon> };
        nation: TopoJSON.GeometryCollection;
    };
    bbox: [number, number, number, number];
    transform: TopoJSON.Transform;
}

// ---------------------------------------------------------------
// World Atlas TopoJSON
// ---------------------------------------------------------------

export interface WorldAtlas extends TopoJSON.Topology {
    objects: {
        countries: { type: "GeometryCollection"; geometries: Array<TopoJSON.Polygon | TopoJSON.MultiPolygon> };
        land: TopoJSON.GeometryCollection;
    };
    bbox: [number, number, number, number];
    transform: TopoJSON.Transform;
}

````

### Additional Details
 * Last updated: Tue, 07 Nov 2023 15:11:36 GMT
 * Dependencies: [@types/geojson](https://npmjs.com/package/@types/geojson), [@types/topojson-client](https://npmjs.com/package/@types/topojson-client), [@types/topojson-server](https://npmjs.com/package/@types/topojson-server), [@types/topojson-simplify](https://npmjs.com/package/@types/topojson-simplify), [@types/topojson-specification](https://npmjs.com/package/@types/topojson-specification)

# Credits
These definitions were written by [Ricardo Mello](https://github.com/ricmello), [Zhutian Chen](https://github.com/chenzhutian), and [denisname](https://github.com/denisname).
