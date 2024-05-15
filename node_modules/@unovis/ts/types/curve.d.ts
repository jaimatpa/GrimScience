export declare enum CurveType {
    Basis = "basis",
    BasisClosed = "basisClosed",
    BasisOpen = "basisOpen",
    Bundle = "bundle",
    Cardinal = "cardinal",
    CardinalClosed = "cardinalClosed",
    CardinalOpen = "cardinalOpen",
    CatmullRom = "catmullRom",
    CatmullRomClosed = "catmullRomClosed",
    CatmullRomOpen = "catmullRomOpen",
    Linear = "linear",
    LinearClosed = "linearClosed",
    MonotoneX = "monotoneX",
    MonotoneY = "monotoneY",
    Natural = "natural",
    Step = "step",
    StepAfter = "stepAfter",
    StepBefore = "stepBefore"
}
export declare const Curve: {
    basis: import("d3-shape").CurveFactory;
    basisClosed: import("d3-shape").CurveFactory;
    basisOpen: import("d3-shape").CurveFactory;
    bundle: import("d3-shape").CurveBundleFactory;
    cardinal: import("d3-shape").CurveCardinalFactory;
    cardinalClosed: import("d3-shape").CurveCardinalFactory;
    cardinalOpen: import("d3-shape").CurveCardinalFactory;
    catmullRom: import("d3-shape").CurveCatmullRomFactory;
    catmullRomClosed: import("d3-shape").CurveCatmullRomFactory;
    catmullRomOpen: import("d3-shape").CurveCatmullRomFactory;
    linear: import("d3-shape").CurveFactory;
    linearClosed: import("d3-shape").CurveFactory;
    monotoneX: import("d3-shape").CurveFactory;
    monotoneY: import("d3-shape").CurveFactory;
    natural: import("d3-shape").CurveFactory;
    step: import("d3-shape").CurveFactory;
    stepAfter: import("d3-shape").CurveFactory;
    stepBefore: import("d3-shape").CurveFactory;
};
