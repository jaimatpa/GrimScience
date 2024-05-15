export interface Particle {
    source: {
        lat: number;
        lon: number;
    };
    target: {
        lat: number;
        lon: number;
    };
    location: {
        lat: number;
        lon: number;
    };
    velocity: number;
    x: number;
    y: number;
    r?: number;
    color?: string;
}
export interface LatLon {
    lat: number;
    lon: number;
}
