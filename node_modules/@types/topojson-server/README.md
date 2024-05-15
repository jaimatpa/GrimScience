# Installation
> `npm install --save @types/topojson-server`

# Summary
This package contains type definitions for topojson-server (https://github.com/topojson/topojson-server).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/topojson-server.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/topojson-server/index.d.ts)
````ts
import * as GeoJSON from "geojson";
import * as TopoJSON from "topojson-specification";

export function topology(objects: { [k: string]: GeoJSON.GeoJsonObject }, quantization?: number): TopoJSON.Topology;

````

### Additional Details
 * Last updated: Tue, 07 Nov 2023 15:11:36 GMT
 * Dependencies: [@types/geojson](https://npmjs.com/package/@types/geojson), [@types/topojson-specification](https://npmjs.com/package/@types/topojson-specification)

# Credits
These definitions were written by [Ricardo Mello](https://github.com/ricmello), [Zhutian Chen](https://github.com/chenzhutian), [denisname](https://github.com/denisname), and [Russell Porter](https://github.com/russellporter).
