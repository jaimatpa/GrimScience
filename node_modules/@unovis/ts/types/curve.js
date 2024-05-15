import { curveBasis, curveBasisClosed, curveBasisOpen, curveBundle, curveCardinal, curveCardinalClosed, curveCardinalOpen, curveCatmullRom, curveCatmullRomClosed, curveCatmullRomOpen, curveLinear, curveLinearClosed, curveMonotoneX, curveMonotoneY, curveNatural, curveStep, curveStepAfter, curveStepBefore } from 'd3-shape';

var CurveType;
(function (CurveType) {
    CurveType["Basis"] = "basis";
    CurveType["BasisClosed"] = "basisClosed";
    CurveType["BasisOpen"] = "basisOpen";
    CurveType["Bundle"] = "bundle";
    CurveType["Cardinal"] = "cardinal";
    CurveType["CardinalClosed"] = "cardinalClosed";
    CurveType["CardinalOpen"] = "cardinalOpen";
    CurveType["CatmullRom"] = "catmullRom";
    CurveType["CatmullRomClosed"] = "catmullRomClosed";
    CurveType["CatmullRomOpen"] = "catmullRomOpen";
    CurveType["Linear"] = "linear";
    CurveType["LinearClosed"] = "linearClosed";
    CurveType["MonotoneX"] = "monotoneX";
    CurveType["MonotoneY"] = "monotoneY";
    CurveType["Natural"] = "natural";
    CurveType["Step"] = "step";
    CurveType["StepAfter"] = "stepAfter";
    CurveType["StepBefore"] = "stepBefore";
})(CurveType || (CurveType = {}));
const Curve = {
    [CurveType.Basis]: curveBasis,
    [CurveType.BasisClosed]: curveBasisClosed,
    [CurveType.BasisOpen]: curveBasisOpen,
    [CurveType.Bundle]: curveBundle,
    [CurveType.Cardinal]: curveCardinal,
    [CurveType.CardinalClosed]: curveCardinalClosed,
    [CurveType.CardinalOpen]: curveCardinalOpen,
    [CurveType.CatmullRom]: curveCatmullRom,
    [CurveType.CatmullRomClosed]: curveCatmullRomClosed,
    [CurveType.CatmullRomOpen]: curveCatmullRomOpen,
    [CurveType.Linear]: curveLinear,
    [CurveType.LinearClosed]: curveLinearClosed,
    [CurveType.MonotoneX]: curveMonotoneX,
    [CurveType.MonotoneY]: curveMonotoneY,
    [CurveType.Natural]: curveNatural,
    [CurveType.Step]: curveStep,
    [CurveType.StepAfter]: curveStepAfter,
    [CurveType.StepBefore]: curveStepBefore,
};

export { Curve, CurveType };
//# sourceMappingURL=curve.js.map
